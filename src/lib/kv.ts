// Unified KV interface that works with both local development and Cloudflare Workers
import { kv as mockKV } from './mock-kv';

// Dynamic import for Cloudflare KV implementation
// This allows the code to run in both browser and Cloudflare Worker environments
let cloudflareKV: typeof mockKV | null = null;
let initializeKV: ((env: any) => void) | null = null;

// In a Cloudflare Worker environment, this will be properly initialized
// In other environments, we'll use the mock implementation
try {
  // Check if we're in a Cloudflare Worker environment
  // We can't directly check for WorkerGlobalScope in Next.js, so we'll use a different approach
  // In a real Cloudflare Worker, this would be set by the Cloudflare runtime
  if (typeof process === 'undefined' || process.env.CLOUDFLARE_WORKER === 'true') {
    // Use dynamic import to avoid issues with Next.js static analysis
    import('./cloudflare-kv').then(cloudflareModule => {
      cloudflareKV = cloudflareModule.kv;
      initializeKV = cloudflareModule.initializeKV;
    });
  }
} catch (error) {
  console.warn('Not in a Cloudflare Worker environment, using mock KV');
}

// Export the appropriate KV implementation
export const kv = cloudflareKV || mockKV;
export { initializeKV };