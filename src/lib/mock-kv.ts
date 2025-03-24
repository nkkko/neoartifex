// Mock implementation of KV for development
// This file provides a fallback when Cloudflare KV is not available
import { KVInterface } from '@/types/kv';

// Create an in-memory store for development
const inMemoryStore: Record<string, any> = {};

// Extended interface with the listKeys method
export interface ExtendedKVInterface extends KVInterface {
  listKeys(prefix?: string, limit?: number): Promise<string[]>;
}

export const kv: ExtendedKVInterface = {
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

  // Increment a numeric value
  async incr(key: string, by = 1) {
    const value = await this.get(key) || 0;
    const newValue = typeof value === 'number' ? value + by : by;
    await this.set(key, newValue);
    return newValue;
  },

  // Delete a key
  async del(key: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(`kv:${key}`);
    }
    delete inMemoryStore[key];
    return true;
  },
  
  // List all keys with an optional prefix
  async listKeys(prefix?: string, limit = 1000) {
    // For client-side development (browser environment)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('kv:')) {
            const actualKey = key.substring(3); // Remove 'kv:' prefix
            if (!prefix || actualKey.startsWith(prefix)) {
              keys.push(actualKey);
              if (keys.length >= limit) break;
            }
          }
        }
        return keys;
      } catch (error) {
        console.error('Error listing keys from localStorage:', error);
        return [];
      }
    }
    
    // For server-side development (Node.js environment)
    const keys = Object.keys(inMemoryStore)
      .filter(key => !prefix || key.startsWith(prefix))
      .slice(0, limit);
      
    return keys;
  }
};