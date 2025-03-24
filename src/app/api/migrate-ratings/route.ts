import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

// Key prefix for ratings
const RATINGS_PREFIX = 'ratings:';

type Rating = {
  like: number;
  dislike: number;
  score?: number;
};

// This API route migrates ratings from the old single-key format to the new per-prompt format
export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with a special key for security
    const authKey = request.nextUrl.searchParams.get('key');
    const isAllowed = process.env.NODE_ENV !== 'production' || authKey === process.env.MIGRATION_AUTH_KEY;
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get the old ratings object
    const oldRatings = await kv.get('ratings');
    
    if (!oldRatings || typeof oldRatings !== 'object') {
      return NextResponse.json({
        success: true,
        message: 'No ratings to migrate or invalid ratings format',
        migratedCount: 0
      });
    }
    
    const results = {
      success: true,
      migratedCount: 0,
      migratedSlugs: [] as string[]
    };
    
    // Migrate each rating to its own key
    for (const slug in oldRatings) {
      const rating = oldRatings[slug] as Rating;
      
      // Ensure the score is calculated
      if (rating.score === undefined) {
        rating.score = rating.like - rating.dislike;
      }
      
      // Save with the new key format
      const newKey = `${RATINGS_PREFIX}${slug}`;
      await kv.set(newKey, rating);
      
      results.migratedCount++;
      results.migratedSlugs.push(slug);
    }
    
    // Optionally delete the old ratings key (uncomment this when you're sure the migration worked)
    // await kv.del('ratings');
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error migrating ratings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}