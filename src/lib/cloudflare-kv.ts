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
        // Fallback to mock KV when not in a Cloudflare Worker environment
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const value = localStorage.getItem(`kv:${key}`);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
          }
        }
        
        console.warn('KV namespace not initialized, using in-memory fallback');
        return null;
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
        // Fallback to mock KV when not in a Cloudflare Worker environment
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            localStorage.setItem(`kv:${key}`, JSON.stringify(value));
            return true;
          } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
          }
        }
        
        console.warn('KV namespace not initialized, using in-memory fallback');
        return false;
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
        // Fallback to mock KV when not in a Cloudflare Worker environment
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(`kv:${key}`);
          return true;
        }
        
        console.warn('KV namespace not initialized, using in-memory fallback');
        return false;
      }
      
      await kvNamespace.delete(key);
      return true;
    } catch (error) {
      console.error('Error deleting from Cloudflare KV:', error);
      return false;
    }
  }
};