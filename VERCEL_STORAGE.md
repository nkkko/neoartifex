# Configuring Storage for Vercel Deployment

This application uses a ratings system that requires persistent storage. Since Vercel deployments are serverless and stateless, we need to use an external storage solution.

## Option 1: Vercel KV (Recommended)

Vercel KV is a Redis-compatible key-value database that's fully managed and integrated with Vercel.

### Setup Steps:

1. **Install the Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Add Vercel KV to your project**:
   ```bash
   vercel kv:add
   ```

3. **Follow the prompts** to create a new KV database or select an existing one.

4. **Update the API code** to use Vercel KV:
   In `src/app/api/ratings/route.ts`, replace the simulated KV store with the actual Vercel KV implementation:

   ```typescript
   import { kv } from '@vercel/kv';

   // Then replace the simulated KV.get and KV.set methods with:
   
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
   ```

5. **Install the Vercel KV package**:
   ```bash
   npm install @vercel/kv
   ```

## Option 2: Upstash Redis

If you prefer to use Upstash Redis directly:

1. **Create an Upstash Redis database** at [console.upstash.com](https://console.upstash.com)

2. **Get your REST API credentials** from the Upstash console

3. **Add environment variables** to your Vercel project:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

4. **Install the Upstash Redis client**:
   ```bash
   npm install @upstash/redis
   ```

5. **Update the API code** to use Upstash Redis:
   ```typescript
   import { Redis } from '@upstash/redis';

   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_REST_URL!,
     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
   });

   // Then replace the simulated KV.get and KV.set methods with:
   
   // Get a value from Redis
   async get(key: string): Promise<KVOperation> {
     try {
       const value = await redis.get(key);
       return { success: true, data: value };
     } catch (error) {
       console.error('Error reading from Redis:', error);
       return { success: false, error: 'Failed to read from Redis' };
     }
   },
   
   // Set a value in Redis
   async set(key: string, value: any): Promise<KVOperation> {
     try {
       await redis.set(key, value);
       return { success: true };
     } catch (error) {
       console.error('Error writing to Redis:', error);
       return { success: false, error: 'Failed to write to Redis' };
     }
   }
   ```

## Option 3: Planetscale or Other Database

For more complex data storage needs, you might want to use a full database like Planetscale (MySQL):

1. **Create a Planetscale database** at [planetscale.com](https://planetscale.com)

2. **Get your connection string** from the Planetscale dashboard

3. **Add the connection string as an environment variable** in Vercel:
   - `DATABASE_URL`

4. **Install Prisma or another ORM**:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

5. **Define your schema** in `prisma/schema.prisma`

6. **Update your API code** to use the database via Prisma or another method

## Local Development

The current implementation uses localStorage as a fallback for local development. This works for testing but won't persist data between server restarts or deployments.

For a more consistent development experience, you might want to:

1. Use a local Redis instance
2. Connect to your production database from your development environment
3. Use a development instance of your database