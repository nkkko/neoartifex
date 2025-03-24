// Simplified worker for testing Cloudflare KV

export default {
  async fetch(request, env, ctx) {
    // Initialize KV namespace
    const kv = env.NEOARTIFEX_KV;
    
    // Get the URL of the request
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle different routes
    if (path === '/test/get') {
      try {
        const value = await kv.get('ratings');
        return new Response(JSON.stringify({ success: true, data: value }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        });
      }
    }
    
    if (path === '/test/set') {
      try {
        const testData = {
          'test-prompt': { like: 15, dislike: 3, score: 12 }
        };
        await kv.put('ratings', JSON.stringify(testData));
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        });
      }
    }
    
    // Default response
    return new Response('Test Worker Running', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};