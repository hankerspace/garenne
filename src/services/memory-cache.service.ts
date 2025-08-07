/**
 * In-memory cache service for expensive calculations
 * Provides caching for computed values to improve performance
 */

interface CacheItem<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheConfig {
  /** Maximum time in milliseconds before cache expires */
  ttl?: number;
  /** Maximum number of items to store */
  maxSize?: number;
  /** Whether to use LRU eviction when cache is full */
  useLRU?: boolean;
}

export class MemoryCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private readonly ttl: number;
  private readonly maxSize: number;
  private readonly useLRU: boolean;

  constructor(config: CacheConfig = {}) {
    this.ttl = config.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = config.maxSize || 100;
    this.useLRU = config.useLRU !== false;
  }

  /**
   * Get value from cache
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }

    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Update access statistics for LRU
    if (this.useLRU) {
      item.accessCount++;
      item.lastAccessed = Date.now();
    }

    return item.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }

    const now = Date.now();
    this.cache.set(key, {
      value,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now,
    });
  }

  /**
   * Get value or compute and cache it
   */
  getOrCompute(key: string, computeFn: () => T): T {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const computed = computeFn();
    this.set(key, computed);
    return computed;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Remove item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    hitRate: number;
    items: Array<{ key: string; accessCount: number; age: number }>;
  } {
    const now = Date.now();
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      accessCount: item.accessCount,
      age: now - item.timestamp,
    }));

    const totalAccesses = items.reduce((sum, item) => sum + item.accessCount, 0);
    const hitRate = totalAccesses > 0 ? (totalAccesses / (totalAccesses + this.cache.size)) : 0;

    return {
      size: this.cache.size,
      hitRate,
      items,
    };
  }

  /**
   * Evict oldest/least used items
   */
  private evictOldest(): void {
    if (this.cache.size === 0) return;

    if (this.useLRU) {
      // Find least recently used item
      let oldestKey: string | undefined;
      let oldestTime = Date.now();

      for (const [key, item] of this.cache) {
        if (item.lastAccessed < oldestTime) {
          oldestTime = item.lastAccessed;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    } else {
      // Simple FIFO - remove first item
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  /**
   * Clean up expired items
   */
  cleanup(): number {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, item] of this.cache) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    return removedCount;
  }
}

/**
 * Specialized caches for different types of calculations
 */

// Cache for animal statistics
export const animalStatsCache = new MemoryCache<any>({
  ttl: 2 * 60 * 1000, // 2 minutes
  maxSize: 50,
});

// Cache for breeding calculations
export const breedingCache = new MemoryCache<any>({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 30,
});

// Cache for chart data
export const chartDataCache = new MemoryCache<any>({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 20,
});

// Cache for search results
export const searchCache = new MemoryCache<any>({
  ttl: 1 * 60 * 1000, // 1 minute
  maxSize: 100,
});

/**
 * Cache decorator for methods
 */
export function cached(cacheKey: string, cache: MemoryCache = new MemoryCache()) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const key = `${cacheKey}:${JSON.stringify(args)}`;
      
      return cache.getOrCompute(key, () => {
        return method.apply(this, args);
      });
    };

    return descriptor;
  };
}

/**
 * Memoization utility for expensive functions
 */
export function memoize<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  cacheConfig?: CacheConfig
): (...args: TArgs) => TReturn {
  const cache = new MemoryCache<TReturn>(cacheConfig);

  return (...args: TArgs): TReturn => {
    const key = JSON.stringify(args);
    return cache.getOrCompute(key, () => fn(...args));
  };
}

/**
 * Cache utilities for common calculations
 */
export const CacheUtils = {
  /**
   * Cache animal calculations by ID
   */
  cacheAnimalCalc<T>(animalId: string, calcType: string, calc: () => T): T {
    const key = `animal:${animalId}:${calcType}`;
    return animalStatsCache.getOrCompute(key, calc);
  },

  /**
   * Cache breeding calculations
   */
  cacheBreedingCalc<T>(key: string, calc: () => T): T {
    return breedingCache.getOrCompute(key, calc);
  },

  /**
   * Cache chart data
   */
  cacheChartData<T>(chartType: string, params: any, calc: () => T): T {
    const key = `chart:${chartType}:${JSON.stringify(params)}`;
    return chartDataCache.getOrCompute(key, calc);
  },

  /**
   * Cache search results
   */
  cacheSearchResults<T>(query: string, filters: any, search: () => T): T {
    const key = `search:${query}:${JSON.stringify(filters)}`;
    return searchCache.getOrCompute(key, search);
  },

  /**
   * Clear all caches
   */
  clearAll(): void {
    animalStatsCache.clear();
    breedingCache.clear();
    chartDataCache.clear();
    searchCache.clear();
  },

  /**
   * Get combined cache statistics
   */
  getAllStats() {
    return {
      animalStats: animalStatsCache.getStats(),
      breeding: breedingCache.getStats(),
      chartData: chartDataCache.getStats(),
      search: searchCache.getStats(),
    };
  },

  /**
   * Cleanup expired items in all caches
   */
  cleanupAll(): number {
    return (
      animalStatsCache.cleanup() +
      breedingCache.cleanup() +
      chartDataCache.cleanup() +
      searchCache.cleanup()
    );
  },
};

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    CacheUtils.cleanupAll();
  }, 5 * 60 * 1000);
}

export default MemoryCache;