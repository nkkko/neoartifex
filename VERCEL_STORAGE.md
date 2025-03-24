# Configuring Storage for Cloudflare Deployment

This application uses a ratings system that requires persistent storage. Since this is a serverless application, we need to use an external storage solution.

## Option 1: Cloudflare KV (Recommended)

Cloudflare KV provides low-latency, high-throughput global storage for your application.

### Setup Steps:

1. **Install the Cloudflare Wrangler CLI** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Create a KV namespace**:
   ```bash
   npx wrangler kv namespace create NEOARTIFEX_KV
   ```
   
   This will output something like:
   ```
   🌀 Creating namespace with title <project-name>-NEOARTIFEX_KV
   ✨ Success!
   Add the following to your wrangler.toml:
   [[kv_namespaces]]
   binding = "NEOARTIFEX_KV"
   id = "<your-namespace-id>"
   ```

4. **Create a wrangler.toml file** in your project root:
   ```toml
   name = "neoartifex"
   main = "src/worker.ts"
   compatibility_date = "2023-01-01"

   [[kv_namespaces]]
   binding = "NEOARTIFEX_KV"
   id = "<your-namespace-id>"
   ```

5. **Install the Cloudflare Workers SDK**:
   ```bash
   npm install @cloudflare/workers-types
   ```

6. **Update the KV implementation** to use Cloudflare KV:
   Create a new file at `src/lib/cloudflare-kv.ts`:

   ```typescript
   // Implementation for Cloudflare KV
   
   export interface Env {
     NEOARTIFEX_KV: KVNamespace;
   }
   
   let kvNamespace: KVNamespace;
   
   export const initializeKV = (env: Env) => {
     kvNamespace = env.NEOARTIFEX_KV;
   };
   
   export const kv = {
     async get(key: string) {
       try {
         if (!kvNamespace) {
           throw new Error('KV namespace not initialized');
         }
         const value = await kvNamespace.get(key);
         return value ? JSON.parse(value) : null;
       } catch (error) {
         console.error('Error reading from Cloudflare KV:', error);
         return null;
       }
     },
     
     async set(key: string, value: any) {
       try {
         if (!kvNamespace) {
           throw new Error('KV namespace not initialized');
         }
         await kvNamespace.put(key, JSON.stringify(value));
         return true;
       } catch (error) {
         console.error('Error writing to Cloudflare KV:', error);
         return false;
       }
     },
     
     // Additional Redis-like methods
     async incr(key: string) {
       const value = await this.get(key) || 0;
       const newValue = typeof value === 'number' ? value + 1 : 1;
       await this.set(key, newValue);
       return newValue;
     },
     
     async del(key: string) {
       try {
         if (!kvNamespace) {
           throw new Error('KV namespace not initialized');
         }
         await kvNamespace.delete(key);
         return true;
       } catch (error) {
         console.error('Error deleting from Cloudflare KV:', error);
         return false;
       }
     }
   };
   ```

7. **Create a Cloudflare Worker** at `src/worker.ts`:
   ```typescript
   import { initializeKV } from './lib/cloudflare-kv';
   
   export interface Env {
     NEOARTIFEX_KV: KVNamespace;
   }
   
   export default {
     async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
       // Initialize the KV namespace
       initializeKV(env);
       
       // Handle your API requests here
       // You can forward them to your Next.js API routes or implement directly here
       
       return new Response('Worker is running!', { status: 200 });
     },
   };
   ```

8. **Deploy your worker**:
   ```bash
   npx wrangler deploy
   ```

## Local Development

For local development, you can continue using the mock KV implementation:

```typescript
// src/lib/kv.ts
import { kv as mockKV } from './mock-kv';
import { kv as cloudflareKV, initializeKV } from './cloudflare-kv';

// Use mock KV for local development, Cloudflare KV for production
export const kv = process.env.NODE_ENV === 'production' ? cloudflareKV : mockKV;
export { initializeKV };
```

Then update your API routes to use this unified interface:

```typescript
import { kv } from '@/lib/kv';
```

## Integrating with Next.js API Routes

To use Cloudflare KV with your Next.js API routes:

1. **Update the ratings API** to use the unified KV interface:
   In `src/app/api/ratings/route.ts`, replace the import:
   ```typescript
   import { kv } from '@/lib/kv';
   ```

2. **For local development with Cloudflare KV**, you can use:
   ```bash
   npx wrangler dev
   ```

This setup allows you to use Cloudflare KV in production while maintaining a simple development experience.