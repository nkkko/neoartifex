// Simplified Cloudflare Worker implementation without Next.js dependencies

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Env {
  NEOARTIFEX_KV: KVNamespace;
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

// Rating model
type Rating = {
  like: number;
  dislike: number;
  score?: number;
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Initialize the KV namespace
    const kv = env.NEOARTIFEX_KV;
    
    // Get the URL of the request
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle API requests
    if (path.startsWith('/api/')) {
      // Handle ratings API
      if (path === '/api/ratings') {
        if (request.method === 'GET') {
          return await handleGetRatings(kv);
        } else if (request.method === 'POST') {
          return await handlePostRating(request, kv);
        } else {
          return new Response('Method not allowed', { status: 405 });
        }
      }
      
      // Add other API routes as needed
      
      // Default response for unknown API routes
      return new Response('API endpoint not found', { status: 404 });
    }
    
    // Default response for non-API requests
    return new Response('Cloudflare Worker is running!', { status: 200 });
  },
};

// GET ratings handler
async function handleGetRatings(kv: KVNamespace): Promise<Response> {
  try {
    // Get ratings from KV store
    const ratingsData = await kv.get('ratings');
    const ratings: Record<string, Rating> = ratingsData ? JSON.parse(ratingsData) : {};
    
    // Calculate scores for any ratings that don't have them
    for (const slug in ratings) {
      const rating = ratings[slug];
      if (rating.score === undefined) {
        rating.score = rating.like - rating.dislike;
      }
    }
    
    // Save the updated ratings with scores if needed
    await kv.put('ratings', JSON.stringify(ratings));
    
    return new Response(JSON.stringify({ ratings }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch ratings' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// POST rating handler
async function handlePostRating(request: Request, kv: KVNamespace): Promise<Response> {
  try {
    const { slug, liked } = await request.json();
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Get current ratings
    const ratingsData = await kv.get('ratings');
    const ratings: Record<string, Rating> = ratingsData ? JSON.parse(ratingsData) : {};
    
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
    await kv.put('ratings', JSON.stringify(ratings));
    
    return new Response(JSON.stringify({ success: true, rating }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving rating:', error);
    return new Response(JSON.stringify({ error: 'Failed to save rating' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}