/**
 * Interface for KV storage operations
 * This ensures that all KV implementations (mock, Cloudflare API, etc.)
 * provide the same methods and return types
 */
export interface KVInterface {
  /**
   * Get a value from storage
   * @param key The key to retrieve
   */
  get(key: string): Promise<any>;
  
  /**
   * Set a value in storage
   * @param key The key to set
   * @param value The value to store
   * @param options Optional settings
   */
  set(key: string, value: any, options?: any): Promise<boolean>;
  
  /**
   * Delete a key from storage
   * @param key The key to delete
   */
  del(key: string): Promise<boolean>;
  
  /**
   * Increment a numeric value
   * @param key The key to increment
   * @param by Amount to increment by (default: 1)
   */
  incr(key: string, by?: number): Promise<number>;
  
  /**
   * List keys with a prefix
   * @param prefix Optional prefix to filter keys
   * @param limit Maximum number of keys to return
   */
  listKeys?(prefix?: string, limit?: number): Promise<string[]>;
}