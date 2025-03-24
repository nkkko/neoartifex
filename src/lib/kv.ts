// Unified KV interface that works with both local development and Cloudflare KV
import { kv as mockKV } from './mock-kv';
import { cloudflareKV } from './cloudflare-kv-api';

// Determine which KV implementation to use
let activeKV: typeof mockKV;

// In development, use the mock KV
// In production on Vercel, use the Cloudflare KV API client
if (process.env.NODE_ENV === 'production' && cloudflareKV.isConfigured()) {
  activeKV = cloudflareKV;
  console.log('Using Cloudflare KV API');
} else {
  activeKV = mockKV;
  console.log('Using mock KV implementation');
}

// Export the KV interface
export const kv = activeKV;

// For Cloudflare Workers, we'll keep this for compatibility
// but it won't be used in Vercel functions
export const initializeKV = (env: any): void => {
  // This function is a no-op in Vercel functions
  // It's only used when running in a Cloudflare Worker
};