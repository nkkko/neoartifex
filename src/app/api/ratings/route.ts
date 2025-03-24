import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

type Rating = {
  like: number; // Count of likes
  dislike: number; // Count of dislikes
  score?: number; // Calculated score (likes - dislikes)
};

interface KVOperation {
  success: boolean;
  data?: any;
  error?: string;
}

// KV operations wrapper
const KV = {
  // Get a value from KV store
  async get(key: string): Promise<KVOperation> {
    try {
      const value = await kv.get(key);
      return { success: true, data: value };
    } catch (error) {
      console.error('Error reading from KV:', error);
      return { success: false, error: 'Failed to read from KV store' };
    }
  },
  
  // Set a value in KV store
  async set(key: string, value: any): Promise<KVOperation> {
    try {
      await kv.set(key, value);
      return { success: true };
    } catch (error) {
      console.error('Error writing to KV:', error);
      return { success: false, error: 'Failed to write to KV store' };
    }
  }
};

// Get all ratings
export async function GET() {
  try {
    // Get ratings from KV store
    const result = await KV.get('ratings');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch ratings');
    }
    
    const ratings: Record<string, Rating> = result.data || {};
    
    // Calculate scores for any ratings that don't have them
    for (const slug in ratings) {
      const rating = ratings[slug];
      if (rating.score === undefined) {
        rating.score = rating.like - rating.dislike;
      }
    }
    
    // Save the updated ratings with scores if needed
    await KV.set('ratings', ratings);
    
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// Add or update a rating
export async function POST(request: NextRequest) {
  try {
    const { slug, liked } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }
    
    // Get current ratings
    const result = await KV.get('ratings');
    const ratings: Record<string, Rating> = result.success && result.data ? result.data : {};
    
    // Get or initialize rating for this prompt
    const rating = ratings[slug] || { like: 0, dislike: 0 };
    
    // Update the appropriate counter
    if (liked === true) {
      rating.like += 1;
    } else if (liked === false) {
      rating.dislike += 1;
    }
    
    // Calculate the score (likes - dislikes)
    rating.score = rating.like - rating.dislike;
    
    // Save the updated rating
    ratings[slug] = rating;
    const saveResult = await KV.set('ratings', ratings);
    
    if (!saveResult.success) {
      throw new Error(saveResult.error || 'Failed to save rating');
    }
    
    return NextResponse.json({ success: true, rating });
  } catch (error) {
    console.error('Error saving rating:', error);
    return NextResponse.json(
      { error: 'Failed to save rating' },
      { status: 500 }
    );
  }
}