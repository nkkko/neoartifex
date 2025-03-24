/**
 * Cloudflare KV API Client
 * 
 * This module provides a client for interacting with Cloudflare KV via the REST API.
 * It can be used in any environment, including Next.js API routes and Vercel functions.
 */

// Check if required environment variables are available
const accountID = process.env.CLOUDFLARE_ACCOUNT_ID;
const namespaceID = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
const apiToken = process.env.CLOUDFLARE_KV_API_TOKEN;

// Base URL for Cloudflare KV API
const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountID}/storage/kv/namespaces/${namespaceID}/values`;

// Helper to build endpoint URL for a specific key
const endpoint = (key: string) => `${baseUrl}/${encodeURIComponent(key)}`;

// Helper to check if all required configuration is present
const isConfigured = () => !!(accountID && namespaceID && apiToken);

// CloudflareKV API client
export const cloudflareKV = {
  /**
   * Check if the Cloudflare KV API client is configured
   */
  isConfigured,

  /**
   * Get a value from Cloudflare KV
   * @param key The key to retrieve
   * @returns The value or null if not found
   */
  async get(key: string): Promise<any> {
    if (!isConfigured()) {
      console.warn('Cloudflare KV API is not configured');
      return null;
    }

    try {
      const response = await fetch(endpoint(key), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      // If the key doesn't exist, Cloudflare returns a 404
      if (response.status === 404) {
        return null;
      }

      // For successful responses, try to parse as JSON
      if (response.ok) {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          // Return raw text if not valid JSON
          return text;
        }
      }

      // Handle error cases
      const error = await response.json();
      console.error('Error fetching from Cloudflare KV:', error);
      return null;
    } catch (error) {
      console.error('Exception fetching from Cloudflare KV:', error);
      return null;
    }
  },

  /**
   * Set a value in Cloudflare KV
   * @param key The key to set
   * @param value The value to store
   * @param options Optional settings (expiration, expiration_ttl)
   * @returns Success status
   */
  async set(key: string, value: any, options: { expiration?: number; expiration_ttl?: number } = {}): Promise<boolean> {
    if (!isConfigured()) {
      console.warn('Cloudflare KV API is not configured');
      return false;
    }

    try {
      // Convert value to string if it's not already
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      // Build URL with optional parameters
      let url = endpoint(key);
      const params = new URLSearchParams();
      if (options.expiration) params.append('expiration', options.expiration.toString());
      if (options.expiration_ttl) params.append('expiration_ttl', options.expiration_ttl.toString());
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: stringValue,
      });

      if (response.ok) {
        return true;
      }

      const error = await response.json();
      console.error('Error writing to Cloudflare KV:', error);
      return false;
    } catch (error) {
      console.error('Exception writing to Cloudflare KV:', error);
      return false;
    }
  },

  /**
   * Delete a key from Cloudflare KV
   * @param key The key to delete
   * @returns Success status
   */
  async del(key: string): Promise<boolean> {
    if (!isConfigured()) {
      console.warn('Cloudflare KV API is not configured');
      return false;
    }

    try {
      const response = await fetch(endpoint(key), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      }

      const error = await response.json();
      console.error('Error deleting from Cloudflare KV:', error);
      return false;
    } catch (error) {
      console.error('Exception deleting from Cloudflare KV:', error);
      return false;
    }
  },

  /**
   * List all keys in Cloudflare KV with an optional prefix
   * @param prefix Optional key prefix to filter by
   * @param limit Optional maximum number of keys to return (default 1000)
   * @returns Array of keys or empty array if error
   */
  async listKeys(prefix?: string, limit = 1000): Promise<string[]> {
    if (!isConfigured()) {
      console.warn('Cloudflare KV API is not configured');
      return [];
    }

    try {
      // Build the list keys URL
      const listUrl = `https://api.cloudflare.com/client/v4/accounts/${accountID}/storage/kv/namespaces/${namespaceID}/keys`;
      const params = new URLSearchParams();
      if (prefix) params.append('prefix', prefix);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`${listUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.result)) {
          return data.result.map((item: any) => item.name);
        }
      }

      return [];
    } catch (error) {
      console.error('Exception listing Cloudflare KV keys:', error);
      return [];
    }
  },

  /**
   * Increment a numeric value in KV (emulates Redis INCR)
   * @param key The key to increment
   * @param by Amount to increment by (default 1)
   * @returns The new value or null on error
   */
  async incr(key: string, by = 1): Promise<number | null> {
    if (!isConfigured()) {
      console.warn('Cloudflare KV API is not configured');
      return null;
    }

    try {
      // Get current value
      const currentValue = await this.get(key);
      const numValue = typeof currentValue === 'number' ? currentValue : 
                      currentValue === null ? 0 : 
                      parseInt(currentValue, 10) || 0;
      
      // Increment and store
      const newValue = numValue + by;
      const success = await this.set(key, newValue);
      
      return success ? newValue : null;
    } catch (error) {
      console.error('Exception incrementing value in Cloudflare KV:', error);
      return null;
    }
  }
};