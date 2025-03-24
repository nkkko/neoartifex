import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { cloudflareKV } from '@/lib/cloudflare-kv-api';

type Rating = {
  like: number; // Count of likes
  dislike: number; // Count of dislikes
  score?: number; // Calculated score (likes - dislikes)
};

interface KVOperation<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Key prefix for ratings
const RATINGS_PREFIX = 'ratings:';

// Helper to create a full key for a prompt
const getRatingKey = (slug: string) => `${RATINGS_PREFIX}${slug}`;

// KV operations wrapper
const KV = {
  // Get a single rating by slug
  async getRating(slug: string): Promise<KVOperation<Rating>> {
    try {
      const key = getRatingKey(slug);
      const value = await kv.get(key);
      return { 
        success: true, 
        data: value || { like: 0, dislike: 0, score: 0 }
      };
    } catch (error) {
      console.error(`Error reading rating for ${slug}:`, error);
      return { 
        success: false, 
        error: `Failed to read rating for ${slug}`
      };
    }
  },
  
  // Set a rating for a specific slug
  async setRating(slug: string, rating: Rating): Promise<KVOperation> {
    try {
      const key = getRatingKey(slug);
      await kv.set(key, rating);
      return { success: true };
    } catch (error) {
      console.error(`Error saving rating for ${slug}:`, error);
      return { 
        success: false, 
        error: `Failed to save rating for ${slug}`
      };
    }
  },
  
  // Get all ratings
  async getAllRatings(): Promise<KVOperation<Record<string, Rating>>> {
    try {
      // If we're using Cloudflare KV API, we can use listKeys with a prefix
      if (typeof cloudflareKV !== 'undefined' && cloudflareKV.isConfigured && cloudflareKV.isConfigured() && cloudflareKV.listKeys) {
        // Get all keys with the ratings prefix
        const keys = await cloudflareKV.listKeys(RATINGS_PREFIX);
        
        // Fetch all ratings in parallel
        const ratingPromises = keys.map(async (key) => {
          const slug = key.replace(RATINGS_PREFIX, '');
          const ratingData = await kv.get(key);
          return { slug, rating: ratingData };
        });
        
        // Wait for all fetches to complete
        const ratingsData = await Promise.all(ratingPromises);
        
        // Convert to record format
        const ratings: Record<string, Rating> = {};
        ratingsData.forEach(item => {
          if (item.rating) {
            ratings[item.slug] = item.rating;
          }
        });
        
        return { success: true, data: ratings };
      } else {
        // Fallback for other environments - check if we have a legacy 'ratings' key
        const legacyRatings = await kv.get('ratings');
        if (legacyRatings && typeof legacyRatings === 'object') {
          return { success: true, data: legacyRatings };
        }
        return { success: true, data: {} };
      }
    } catch (error) {
      console.error('Error fetching all ratings:', error);
      return { 
        success: false, 
        error: 'Failed to fetch all ratings'
      };
    }
  }
};

// Get all ratings
export async function GET() {
  try {
    // Get all ratings
    const result = await KV.getAllRatings();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch ratings');
    }
    
    const ratings: Record<string, Rating> = result.data || {};
    
    // Calculate scores for any ratings that don't have them
    for (const slug in ratings) {
      const rating = ratings[slug];
      if (rating.score === undefined) {
        rating.score = rating.like - rating.dislike;
        // Save the updated rating with score
        await KV.setRating(slug, rating);
      }
    }
    
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
    
    // Get current rating for this prompt
    const result = await KV.getRating(slug);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get current rating');
    }
    
    const rating = result.data;
    
    // Update the appropriate counter
    if (liked === true) {
      rating.like += 1;
    } else if (liked === false) {
      rating.dislike += 1;
    }
    
    // Calculate the score (likes - dislikes)
    rating.score = rating.like - rating.dislike;
    
    // Save the updated rating
    const saveResult = await KV.setRating(slug, rating);
    
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