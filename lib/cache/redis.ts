// Redis caching layer for Dimsure
// This provides a caching interface that can be implemented with Redis or fall back to memory cache

export interface CacheInterface {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  flush(): Promise<void>;
}

class MemoryCache implements CacheInterface {
  private cache = new Map<string, { value: any; expires: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    this.cache.set(key, {
      value,
      expires: Date.now() + (ttlSeconds * 1000)
    });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async flush(): Promise<void> {
    this.cache.clear();
  }
}

// Redis implementation (when Redis is available)
class RedisCache implements CacheInterface {
  // TODO: Implement Redis client when Redis is set up
  // This would use a Redis client like ioredis or redis
  
  async get<T>(key: string): Promise<T | null> {
    // TODO: Implement Redis get
    console.warn('Redis not implemented, falling back to memory cache');
    return null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    // TODO: Implement Redis set with TTL
    console.warn('Redis not implemented, falling back to memory cache');
  }

  async del(key: string): Promise<void> {
    // TODO: Implement Redis delete
    console.warn('Redis not implemented, falling back to memory cache');
  }

  async flush(): Promise<void> {
    // TODO: Implement Redis flush
    console.warn('Redis not implemented, falling back to memory cache');
  }
}

// Cache factory - automatically uses Redis if available, otherwise memory cache
function createCache(): CacheInterface {
  // For now, always use memory cache
  // TODO: Detect Redis availability and use it when possible
  return new MemoryCache();
}

// Singleton cache instance
export const cache = createCache();

// Cache key generators
export const CacheKeys = {
  // Database stats - cached for 5 minutes
  DATABASE_STATS: 'db:stats',
  
  // Recent products - cached for 2 minutes  
  RECENT_PRODUCTS: (limit: number) => `products:recent:${limit}`,
  
  // Product by slug - cached for 10 minutes
  PRODUCT_BY_SLUG: (slug: string) => `product:slug:${slug}`,
  
  // User products - cached for 5 minutes
  USER_PRODUCTS: (userId: string, limit: number) => `user:${userId}:products:${limit}`,
  
  // Search results - cached for 1 minute (short due to dynamic nature)
  SEARCH_RESULTS: (query: string, limit: number) => `search:${query}:${limit}`,
  
  // Category products - cached for 5 minutes
  CATEGORY_PRODUCTS: (category: string, limit: number) => `category:${category}:${limit}`,
  
  // Brand products - cached for 5 minutes  
  BRAND_PRODUCTS: (brand: string, limit: number) => `brand:${brand}:${limit}`,
} as const;

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 60,        // 1 minute - for dynamic data
  MEDIUM: 300,      // 5 minutes - for semi-static data  
  LONG: 600,        // 10 minutes - for static data
  VERY_LONG: 3600,  // 1 hour - for very static data
} as const;

// Utility functions for common caching patterns
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = CacheTTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // If not in cache, fetch data
  const data = await fetcher();
  
  // Store in cache for future requests
  await cache.set(key, data, ttlSeconds);
  
  return data;
}

export async function invalidateCache(pattern: string): Promise<void> {
  // TODO: Implement pattern-based cache invalidation
  // For now, this is a placeholder
  console.log(`Would invalidate cache keys matching: ${pattern}`);
}

// Cache warming functions for critical data
export async function warmCache(): Promise<void> {
  console.log('Starting cache warm-up...');
  
  try {
    // Pre-load critical data that's likely to be requested
    // This could be called on app startup or periodically
    
    // Note: Actual implementation would dynamically import the firestore module
    // to avoid circular dependencies. For now, this is disabled to prevent build issues.
    
    console.log('Cache warm-up completed');
  } catch (error) {
    console.error('Cache warm-up failed:', error);
  }
}