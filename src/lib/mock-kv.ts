// Mock implementation of Vercel KV for development
// This file provides a fallback when @vercel/kv is not available

// Create an in-memory store for development
const inMemoryStore: Record<string, any> = {};

export const kv = {
  // Get a value from KV store
  async get(key: string) {
    // For client-side development (browser environment)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const value = localStorage.getItem(`kv:${key}`);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
    
    // For server-side development (Node.js environment)
    return inMemoryStore[key] || null;
  },
  
  // Set a value in KV store
  async set(key: string, value: any) {
    // For client-side development (browser environment)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`kv:${key}`, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
      }
    }
    
    // For server-side development (Node.js environment)
    inMemoryStore[key] = value;
    return true;
  },

  // Other common Redis operations
  async incr(key: string) {
    const value = await this.get(key) || 0;
    const newValue = typeof value === 'number' ? value + 1 : 1;
    await this.set(key, newValue);
    return newValue;
  },

  async del(key: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(`kv:${key}`);
    }
    delete inMemoryStore[key];
    return true;
  }
};