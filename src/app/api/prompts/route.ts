import { NextResponse } from 'next/server';
import { getAllPrompts } from '@/lib/api';
import { kv } from '@/lib/kv';

// Helper to create a full key for a prompt rating
const getRatingKey = (slug: string) => `ratings:${slug}`;

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Get all prompts
    const prompts = getAllPrompts([
      'title',
      'description',
      'tags',
      'created',
      'author',
      'version',
    ]);
    
    // Get all ratings in a single batch operation
    const promptSlugs = prompts.map(prompt => prompt.slug).filter(Boolean);
    const ratingsData: Record<string, { like: number; dislike: number; score: number }> = {};
    
    // Fetch all ratings in parallel
    await Promise.all(promptSlugs.map(async (slug) => {
      try {
        if (!slug) return;
        const key = getRatingKey(slug);
        const rating = await kv.get(key) || { like: 0, dislike: 0, score: 0 };
        ratingsData[slug as string] = rating;
      } catch (err) {
        console.error(`Error fetching rating for ${slug}:`, err);
        if (slug) {
          ratingsData[slug] = { like: 0, dislike: 0, score: 0 };
        }
      }
    }));
    
    // Return both prompts and ratings in one response
    return NextResponse.json({
      prompts,
      ratings: ratingsData,
      timestamp: Date.now(),
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching prompts and ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts and ratings' },
      { status: 500 }
    );
  }
}