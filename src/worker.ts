import { initializeKV, Env } from './lib/cloudflare-kv';

// Define ExecutionContext type for Cloudflare Workers
interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Initialize the KV namespace
    initializeKV(env);
    
    // Get the URL of the request
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle API requests
    if (path.startsWith('/api/')) {
      // Handle different API routes
      if (path.startsWith('/api/ratings')) {
        return handleRatingsAPI(request);
      }
      
      // Add other API routes as needed
      
      // Default response for unknown API routes
      return new Response('API endpoint not found', { status: 404 });
    }
    
    // Default response for non-API requests
    return new Response('Cloudflare Worker is running!', { status: 200 });
  },
};

// Handler for ratings API
async function handleRatingsAPI(request: Request): Promise<Response> {
  try {
    // Handle different HTTP methods
    if (request.method === 'GET') {
      // Dynamically import the ratings handler to avoid including Next.js specific code
      const routeModule = await import('./app/api/ratings/route');
      // @ts-ignore - Next.js API route structure
      return routeModule.GET();
    } else if (request.method === 'POST') {
      const routeModule = await import('./app/api/ratings/route');
      // @ts-ignore - Next.js API route structure
      return routeModule.POST(request);
    }
    
    // Method not allowed
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error handling ratings API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}