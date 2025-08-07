import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CacheService, cacheService } from '../services/cache.service';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService({
      maxSize: 3,
      defaultTTL: 1000, // 1 second for tests
      enableMetrics: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic operations', () => {
    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should delete values', () => {
      cache.set('key1', 'value1');
      cache.delete('key1');
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should check if key exists', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.size()).toBe(0);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire entries after TTL', async () => {
      cache.set('key1', 'value1', 50); // 50ms TTL
      expect(cache.get('key1')).toBe('value1');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 60));
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should use default TTL when not specified', () => {
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(0)      // set time
        .mockReturnValueOnce(1500);  // get time (after default TTL)
      
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should not expire entries within TTL', () => {
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(0)     // set time
        .mockReturnValueOnce(500);  // get time (within TTL)
      
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });
  });

  describe('LRU Eviction', () => {
    it('should evict least recently used items when maxSize is reached', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Access key1 to make it more recently used
      cache.get('key1');
      
      // Add key4, should evict key2 (least recently used)
      cache.set('key4', 'value4');
      
      expect(cache.get('key1')).toBe('value1'); // Still exists
      expect(cache.get('key2')).toBeUndefined(); // Evicted
      expect(cache.get('key3')).toBe('value3'); // Still exists
      expect(cache.get('key4')).toBe('value4'); // New entry
    });

    it('should update access order when items are retrieved', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Access key1 to make it most recently used
      cache.get('key1');
      
      // Add key4, should evict key2
      cache.set('key4', 'value4');
      
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key1')).toBe('value1');
    });
  });

  describe('getOrSet method', () => {
    it('should return cached value if exists', async () => {
      cache.set('key1', 'cached');
      const factory = vi.fn().mockResolvedValue('new');
      
      const result = await cache.getOrSet('key1', factory);
      
      expect(result).toBe('cached');
      expect(factory).not.toHaveBeenCalled();
    });

    it('should call factory and cache result if not exists', async () => {
      const factory = vi.fn().mockResolvedValue('new');
      
      const result = await cache.getOrSet('key1', factory);
      
      expect(result).toBe('new');
      expect(factory).toHaveBeenCalledOnce();
      expect(cache.get('key1')).toBe('new');
    });

    it('should work with synchronous factory', async () => {
      const factory = vi.fn().mockReturnValue('sync');
      
      const result = await cache.getOrSet('key1', factory);
      
      expect(result).toBe('sync');
      expect(cache.get('key1')).toBe('sync');
    });
  });

  describe('Prefix operations', () => {
    it('should invalidate entries by prefix', () => {
      cache.set('user:1', 'data1');
      cache.set('user:2', 'data2');
      cache.set('post:1', 'post1');
      
      const invalidated = cache.invalidatePrefix('user:');
      
      expect(invalidated).toBe(2);
      expect(cache.get('user:1')).toBeUndefined();
      expect(cache.get('user:2')).toBeUndefined();
      expect(cache.get('post:1')).toBe('post1');
    });
  });

  describe('Cleanup', () => {
    it('should remove expired entries during cleanup', async () => {
      cache.set('key1', 'value1', 50); // Short TTL
      cache.set('key2', 'value2', 10000); // Long TTL
      
      // Wait for first entry to expire
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const cleaned = cache.cleanup();
      
      expect(cleaned).toBe(1);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBe('value2');
    });
  });

  describe('Metrics', () => {
    it('should track hits and misses', () => {
      cache.set('key1', 'value1');
      
      cache.get('key1'); // hit
      cache.get('key2'); // miss
      cache.get('key1'); // hit
      
      const metrics = cache.getMetrics();
      expect(metrics.hits).toBe(2);
      expect(metrics.misses).toBe(1);
      expect(metrics.hitRatio).toBe(2/3);
    });

    it('should track evictions', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Should evict key1
      
      const metrics = cache.getMetrics();
      expect(metrics.evictions).toBe(1);
    });

    it('should track cache size', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      const metrics = cache.getMetrics();
      expect(metrics.size).toBe(2);
    });
  });

  describe('Key creation utility', () => {
    it('should create composite keys', () => {
      const key = CacheService.createKey('user', 123, 'profile');
      expect(key).toBe('user:123:profile');
    });

    it('should handle different types', () => {
      const key = CacheService.createKey('flag', true, 'test', 42);
      expect(key).toBe('flag:true:test:42');
    });
  });

  describe('Global instances', () => {
    it('should provide working global cache instance', () => {
      cacheService.set('test', 'value');
      expect(cacheService.get('test')).toBe('value');
    });
  });
});