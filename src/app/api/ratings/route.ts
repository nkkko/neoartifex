import { NextRequest, NextResponse } from 'next/server';

// Import Vercel KV client if available
let kv: any;
try {
  // This import will only work if @vercel/kv is installed and properly configured
  kv = require('@vercel/kv');
} catch (error) {
  console.warn('Vercel KV not available, using fallback storage');
}

type Rating = {
  like: number; // Count of likes
  dislike: number; // Count of dislikes
};

interface KVOperation {
  success: boolean;
  data?: any;
  error?: string;
}

// Create an in-memory store for development fallback
const inMemoryStore: Record<string, any> = {};

// KV operations with Vercel KV when available, fallback to in-memory/localStorage otherwise
const KV = {
  // Get a value from KV store
  async get(key: string): Promise<KVOperation> {
    // If Vercel KV is available, use it
    if (kv) {
      try {
        const value = await kv.get(key);
        return { success: true, data: value };
      } catch (error) {
        console.error('Error reading from Vercel KV:', error);
        return { success: false, error: 'Failed to read from Vercel KV' };
      }
    }
    
    // For client-side development (browser environment)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const value = localStorage.getItem(`kv:${key}`);
        return { success: true, data: value ? JSON.parse(value) : null };
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return { success: false, error: 'Failed to read from localStorage' };
      }
    }
    
    // For server-side development (Node.js environment)
    return { success: true, data: inMemoryStore[key] || null };
  },
  
  // Set a value in KV store
  async set(key: string, value: any): Promise<KVOperation> {
    // If Vercel KV is available, use it
    if (kv) {
      try {
        await kv.set(key, value);
        return { success: true };
      } catch (error) {
        console.error('Error writing to Vercel KV:', error);
        return { success: false, error: 'Failed to write to Vercel KV' };
      }
    }
    
    // For client-side development (browser environment)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`kv:${key}`, JSON.stringify(value));
        return { success: true };
      } catch (error) {
        console.error('Error writing to localStorage:', error);
        return { success: false, error: 'Failed to write to localStorage' };
      }
    }
    
    // For server-side development (Node.js environment)
    inMemoryStore[key] = value;
    return { success: true };
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
    
    const ratings = result.data || {};
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