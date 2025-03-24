# Using Cloudflare KV with Vercel Functions

This document explains how to use Cloudflare KV directly from Vercel Functions using the Cloudflare API.

## Overview

While Cloudflare KV is typically used with Cloudflare Workers, it can also be accessed from Vercel Functions or other serverless environments using the Cloudflare API. This approach allows us to:

1. Use Cloudflare KV as a global, low-latency key-value store
2. Deploy our application on Vercel
3. Keep our data storage on Cloudflare

## Setup

### 1. Create a Cloudflare KV Namespace

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Workers & Pages → KV
3. Create a new namespace (e.g., `NEOARTIFEX_KV`)
4. Note the Namespace ID for later

### 2. Create a Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Profile → API Tokens
2. Click "Create Token"
3. Select "Create Custom Token"
4. Set the following permissions:
   - Account / Workers KV Storage / Edit
   - Account / Workers KV Storage / Read
5. Under "Account Resources", select "Include" and choose your account
6. Create the token and save it securely

### 3. Add Environment Variables to Vercel

In your Vercel project settings, add the following environment variables:

- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (found in the dashboard URL)
- `CLOUDFLARE_KV_NAMESPACE_ID`: The ID of your KV namespace
- `CLOUDFLARE_KV_API_TOKEN`: Your Cloudflare API token

### 4. Integrate the API Client

Use the provided `cloudflare-kv-api.ts` client to interact with Cloudflare KV.

## Usage

### Basic Usage

```typescript
import { kv } from '@/lib/kv';

// Get a value
const value = await kv.get('my-key');

// Set a value
await kv.set('my-key', { hello: 'world' });

// Delete a value
await kv.del('my-key');

// Increment a counter
await kv.incr('counter');
```

### With Expiration

You can set values with an expiration time:

```typescript
// Set a value that expires in 1 hour (3600 seconds)
await kv.set('my-key', 'my-value', { expiration_ttl: 3600 });

// Set a value that expires at a specific timestamp
const expirationTimestamp = Math.floor(Date.now() / 1000) + 3600;
await kv.set('my-key', 'my-value', { expiration: expirationTimestamp });
```

## Performance Considerations

When using Cloudflare KV via the API:

1. **Higher Latency**: Accessing KV via the API has higher latency than from a Cloudflare Worker
2. **Rate Limits**: The Cloudflare API has rate limits
3. **Best Practices**:
   - Cache frequently accessed values when possible
   - Use batch operations where appropriate
   - Consider moving to Cloudflare Workers for latency-sensitive operations

## Testing

You can verify your Cloudflare KV API integration by visiting:

```
/test-kv
```

This page will test reading and writing to your Cloudflare KV namespace using the API.

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify your API token has the correct permissions
2. **403 Forbidden**: Check that your account has access to the KV namespace
3. **Incorrect Namespace**: Ensure you're using the correct namespace ID

### Debugging

For debugging Cloudflare KV API issues:

1. Check the API response for error messages
2. Verify environment variables are set correctly
3. Try a simple read/write test using the test page
4. Check Vercel function logs for error details

## Migration from Vercel KV

If you're migrating from Vercel KV to Cloudflare KV, ensure that:

1. All keys are migrated to the new system
2. Your application uses the correct KV client
3. You've tested the migration thoroughly
4. You have a rollback plan if needed