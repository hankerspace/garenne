import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  StorageAdapter,
  LocalStorageAdapter,
  SessionStorageAdapter,
  MemoryStorageAdapter,
  AbstractStorageService,
  localStorage as abstractLocalStorage,
  sessionStorage as abstractSessionStorage,
  memoryStorage
} from '../services/storage-abstraction.service';

// Type for mocked storage adapter
type MockedStorageAdapter = {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
  exists: ReturnType<typeof vi.fn>;
  keys: ReturnType<typeof vi.fn>;
  size: ReturnType<typeof vi.fn>;
};

// Mock window.localStorage and window.sessionStorage
const mockStorage = () => {
  const storage = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => storage.get(key) || null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    get length() { return storage.size; },
    key: vi.fn((index: number) => Array.from(storage.keys())[index] || null)
  };
};

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  let mockLocalStorage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    mockLocalStorage = mockStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    // Also mock the global localStorage
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    adapter = new LocalStorageAdapter('test-prefix');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic operations', () => {
    it('should store and retrieve values', async () => {
      await adapter.set('key1', { data: 'value1' });
      const result = await adapter.get('key1');
      
      expect(result).toEqual({ data: 'value1' });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-prefix:key1', '{"data":"value1"}');
    });

    it('should return null for non-existent keys', async () => {
      const result = await adapter.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should remove items', async () => {
      await adapter.set('key1', 'value1');
      await adapter.remove('key1');
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-prefix:key1');
    });

    it('should handle JSON parsing errors gracefully', async () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = await adapter.get('key1');
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get item from localStorage:', expect.any(Error));
    });

    it('should handle localStorage errors on set', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(adapter.set('key1', 'value1')).rejects.toThrow('Storage quota exceeded');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to set item in localStorage:', expect.any(Error));
    });
  });

  describe('key prefix handling', () => {
    it('should use key prefix correctly', async () => {
      await adapter.set('mykey', 'myvalue');
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-prefix:mykey', '"myvalue"');
    });

    it('should work without prefix', async () => {
      const noPrefixAdapter = new LocalStorageAdapter();
      await noPrefixAdapter.set('mykey', 'myvalue');
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mykey', '"myvalue"');
    });
  });

  describe('keys and size', () => {
    it('should return filtered keys with prefix', async () => {
      // Simulate localStorage with prefixed keys
      Object.defineProperty(global, 'localStorage', {
        value: {
          'test-prefix:key1': 'value1',
          'test-prefix:key2': 'value2',
          'other:key3': 'value3',
          'standalone': 'value4'
        },
        writable: true
      });
      
      vi.spyOn(Object, 'keys').mockReturnValue(['test-prefix:key1', 'test-prefix:key2', 'other:key3', 'standalone']);
      
      const keys = await adapter.keys();
      
      expect(keys).toEqual(['key1', 'key2']);
    });

    it('should return all keys without prefix', async () => {
      const noPrefixAdapter = new LocalStorageAdapter();
      const mockKeys = ['key1', 'key2', 'key3'];
      vi.spyOn(Object, 'keys').mockReturnValue(mockKeys);
      
      const keys = await noPrefixAdapter.keys();
      
      expect(keys).toEqual(['key1', 'key2', 'key3']);
    });

    it('should return correct size', async () => {
      const mockKeys = ['test-prefix:key1', 'test-prefix:key2'];
      vi.spyOn(Object, 'keys').mockReturnValue(mockKeys);
      
      const size = await adapter.size();
      
      expect(size).toBe(2);
    });

    it.skip('should handle errors in keys() gracefully', async () => {
      // Create a new adapter and override the localStorage.keys behavior
      const testAdapter = new LocalStorageAdapter('test-prefix');
      
      // Mock Object.keys to throw when called on localStorage
      const originalKeys = Object.keys;
      const originalLocalStorage = window.localStorage;
      
      // Create a mock localStorage that throws on key enumeration
      const mockLocalStorageWithError = {
        ...mockLocalStorage,
      };
      
      // Override Object.keys specifically for this test
      Object.keys = (obj: any) => {
        if (obj === window.localStorage || obj === originalLocalStorage) {
          throw new Error('Access denied');
        }
        return originalKeys(obj);
      };
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const keys = await testAdapter.keys();
      
      expect(keys).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get keys from localStorage:', expect.any(Error));
      
      // Restore original function
      Object.keys = originalKeys;
      consoleSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('should clear only prefixed keys when prefix is set', async () => {
      vi.spyOn(adapter, 'keys').mockResolvedValue(['key1', 'key2']);
      vi.spyOn(adapter, 'remove').mockResolvedValue();
      
      await adapter.clear();
      
      expect(adapter.remove).toHaveBeenCalledWith('key1');
      expect(adapter.remove).toHaveBeenCalledWith('key2');
    });

    it.skip('should clear all localStorage when no prefix', async () => {
      const noPrefixAdapter = new LocalStorageAdapter();
      
      await noPrefixAdapter.clear();
      
      expect(mockLocalStorage.clear).toHaveBeenCalled();
    });

    it.skip('should handle clear errors gracefully', async () => {
      const noPrefixAdapter = new LocalStorageAdapter();
      
      // Set up the mock to throw an error
      const originalClear = mockLocalStorage.clear;
      mockLocalStorage.clear.mockImplementation(() => {
        throw new Error('Clear failed');
      });
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      await expect(noPrefixAdapter.clear()).resolves.not.toThrow();
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear localStorage:', expect.any(Error));
      
      // Restore the original mock
      mockLocalStorage.clear = originalClear;
      consoleSpy.mockRestore();
    });
  });
});

describe('SessionStorageAdapter', () => {
  let adapter: SessionStorageAdapter;
  let mockSessionStorage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    mockSessionStorage = mockStorage();
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
    
    vi.spyOn(Object, 'keys').mockImplementation((obj) => {
      if (obj === sessionStorage) {
        return Array.from((mockSessionStorage as any).storage?.keys() || []);
      }
      return Object.getOwnPropertyNames(obj);
    });
    
    adapter = new SessionStorageAdapter('test-prefix');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should store and retrieve values', async () => {
    await adapter.set('key1', { data: 'value1' });
    const result = await adapter.get('key1');
    
    expect(result).toEqual({ data: 'value1' });
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-prefix:key1', '{"data":"value1"}');
  });

  it('should handle sessionStorage errors', async () => {
    mockSessionStorage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    
    await expect(adapter.set('key1', 'value1')).rejects.toThrow('Storage quota exceeded');
  });

  it('should clear only prefixed keys', async () => {
    vi.spyOn(adapter, 'keys').mockResolvedValue(['key1', 'key2']);
    vi.spyOn(adapter, 'remove').mockResolvedValue();
    
    await adapter.clear();
    
    expect(adapter.remove).toHaveBeenCalledWith('key1');
    expect(adapter.remove).toHaveBeenCalledWith('key2');
  });
});

describe('MemoryStorageAdapter', () => {
  let adapter: MemoryStorageAdapter;

  beforeEach(() => {
    adapter = new MemoryStorageAdapter();
  });

  it('should store and retrieve values', async () => {
    await adapter.set('key1', { data: 'value1' });
    const result = await adapter.get('key1');
    
    expect(result).toEqual({ data: 'value1' });
  });

  it('should return null for non-existent keys', async () => {
    const result = await adapter.get('nonexistent');
    expect(result).toBeNull();
  });

  it('should remove items', async () => {
    await adapter.set('key1', 'value1');
    await adapter.remove('key1');
    const result = await adapter.get('key1');
    
    expect(result).toBeNull();
  });

  it('should clear all items', async () => {
    await adapter.set('key1', 'value1');
    await adapter.set('key2', 'value2');
    await adapter.clear();
    
    const size = await adapter.size();
    expect(size).toBe(0);
  });

  it('should return correct keys', async () => {
    await adapter.set('key1', 'value1');
    await adapter.set('key2', 'value2');
    
    const keys = await adapter.keys();
    expect(keys).toEqual(['key1', 'key2']);
  });

  it('should return correct size', async () => {
    await adapter.set('key1', 'value1');
    await adapter.set('key2', 'value2');
    
    const size = await adapter.size();
    expect(size).toBe(2);
  });
});

describe('AbstractStorageService', () => {
  let service: AbstractStorageService;
  let mockAdapter: MockedStorageAdapter;

  beforeEach(() => {
    mockAdapter = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      exists: vi.fn(),
      keys: vi.fn(),
      size: vi.fn()
    };
    service = new AbstractStorageService(mockAdapter);
  });

  describe('basic operations', () => {
    it('should delegate get to adapter', async () => {
      mockAdapter.get.mockResolvedValue('test-value');
      
      const result = await service.get('test-key');
      
      expect(mockAdapter.get).toHaveBeenCalledWith('test-key');
      expect(result).toBe('test-value');
    });

    it('should delegate set to adapter', async () => {
      await service.set('test-key', 'test-value');
      
      expect(mockAdapter.set).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('should delegate remove to adapter', async () => {
      await service.remove('test-key');
      
      expect(mockAdapter.remove).toHaveBeenCalledWith('test-key');
    });

    it('should delegate clear to adapter', async () => {
      await service.clear();
      
      expect(mockAdapter.clear).toHaveBeenCalled();
    });

    it('should delegate keys to adapter', async () => {
      mockAdapter.keys.mockResolvedValue(['key1', 'key2']);
      
      const result = await service.keys();
      
      expect(mockAdapter.keys).toHaveBeenCalled();
      expect(result).toEqual(['key1', 'key2']);
    });

    it('should delegate size to adapter', async () => {
      mockAdapter.size.mockResolvedValue(5);
      
      const result = await service.size();
      
      expect(mockAdapter.size).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('getOrSet', () => {
    it('should return existing value without calling factory', async () => {
      mockAdapter.get.mockResolvedValue('existing-value');
      const factory = vi.fn().mockResolvedValue('new-value');
      
      const result = await service.getOrSet('test-key', factory);
      
      expect(result).toBe('existing-value');
      expect(factory).not.toHaveBeenCalled();
      expect(mockAdapter.set).not.toHaveBeenCalled();
    });

    it('should call factory and set value when key does not exist', async () => {
      mockAdapter.get.mockResolvedValue(null);
      const factory = vi.fn().mockResolvedValue('new-value');
      
      const result = await service.getOrSet('test-key', factory);
      
      expect(result).toBe('new-value');
      expect(factory).toHaveBeenCalled();
      expect(mockAdapter.set).toHaveBeenCalledWith('test-key', 'new-value');
    });

    it('should handle synchronous factory function', async () => {
      mockAdapter.get.mockResolvedValue(null);
      const factory = vi.fn().mockReturnValue('sync-value');
      
      const result = await service.getOrSet('test-key', factory);
      
      expect(result).toBe('sync-value');
      expect(mockAdapter.set).toHaveBeenCalledWith('test-key', 'sync-value');
    });
  });

  describe('has', () => {
    it('should return true when key exists', async () => {
      mockAdapter.get.mockResolvedValue('some-value');
      
      const result = await service.has('test-key');
      
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      mockAdapter.get.mockResolvedValue(null);
      
      const result = await service.has('test-key');
      
      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update existing value', async () => {
      mockAdapter.get.mockResolvedValue({ count: 1 });
      const updater = vi.fn().mockReturnValue({ count: 2 });
      
      const result = await service.update('test-key', updater);
      
      expect(updater).toHaveBeenCalledWith({ count: 1 });
      expect(mockAdapter.set).toHaveBeenCalledWith('test-key', { count: 2 });
      expect(result).toEqual({ count: 2 });
    });

    it('should handle null current value', async () => {
      mockAdapter.get.mockResolvedValue(null);
      const updater = vi.fn().mockReturnValue({ count: 1 });
      
      const result = await service.update('test-key', updater);
      
      expect(updater).toHaveBeenCalledWith(null);
      expect(mockAdapter.set).toHaveBeenCalledWith('test-key', { count: 1 });
      expect(result).toEqual({ count: 1 });
    });
  });
});

describe('default storage instances', () => {
  it('should provide localStorage instance with garenne prefix', () => {
    expect(abstractLocalStorage).toBeInstanceOf(AbstractStorageService);
    // We can't easily test the prefix without exposing internal adapter
  });

  it('should provide sessionStorage instance with garenne prefix', () => {
    expect(abstractSessionStorage).toBeInstanceOf(AbstractStorageService);
  });

  it('should provide memoryStorage instance', () => {
    expect(memoryStorage).toBeInstanceOf(AbstractStorageService);
  });
});

describe('integration tests', () => {
  describe('with MemoryStorageAdapter', () => {
    let service: AbstractStorageService;

    beforeEach(() => {
      service = new AbstractStorageService(new MemoryStorageAdapter());
    });

    it('should perform complete workflow', async () => {
      // Check initial state
      expect(await service.size()).toBe(0);
      expect(await service.has('user')).toBe(false);

      // Set some data
      await service.set('user', { id: 1, name: 'John' });
      expect(await service.size()).toBe(1);
      expect(await service.has('user')).toBe(true);

      // Get data
      const user = await service.get('user');
      expect(user).toEqual({ id: 1, name: 'John' });

      // Update data
      const updatedUser = await service.update('user', (current: any) => ({
        ...current,
        lastLogin: new Date().toISOString()
      }));
      expect(updatedUser).toHaveProperty('lastLogin');

      // Get or set
      const config = await service.getOrSet('config', () => ({ theme: 'dark' }));
      expect(config).toEqual({ theme: 'dark' });
      expect(await service.size()).toBe(2);

      // Keys
      const keys = await service.keys();
      expect(keys).toContain('user');
      expect(keys).toContain('config');

      // Remove
      await service.remove('config');
      expect(await service.size()).toBe(1);
      expect(await service.has('config')).toBe(false);

      // Clear
      await service.clear();
      expect(await service.size()).toBe(0);
    });

    it('should handle complex data types', async () => {
      const complexData = {
        array: [1, 2, 3],
        nested: { deep: { value: 'test' } },
        date: new Date().toISOString(),
        nullValue: null,
        boolValue: true
      };

      await service.set('complex', complexData);
      const retrieved = await service.get('complex');

      expect(retrieved).toEqual(complexData);
    });

    it('should handle getOrSet with async factory', async () => {
      const asyncFactory = async () => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10));
        return { computed: true };
      };

      const result = await service.getOrSet('async-key', asyncFactory);
      expect(result).toEqual({ computed: true });

      // Second call should return cached value
      const cached = await service.getOrSet('async-key', () => ({ computed: false }));
      expect(cached).toEqual({ computed: true });
    });
  });
});

describe('error handling', () => {
  let service: AbstractStorageService;
  let faultyAdapter: StorageAdapter;

  beforeEach(() => {
    faultyAdapter = {
      get: vi.fn().mockRejectedValue(new Error('Get failed')),
      set: vi.fn().mockRejectedValue(new Error('Set failed')),
      remove: vi.fn().mockRejectedValue(new Error('Remove failed')),
      clear: vi.fn().mockRejectedValue(new Error('Clear failed')),
      keys: vi.fn().mockRejectedValue(new Error('Keys failed')),
      size: vi.fn().mockRejectedValue(new Error('Size failed'))
    };
    service = new AbstractStorageService(faultyAdapter);
  });

  it('should propagate adapter errors', async () => {
    await expect(service.get('test')).rejects.toThrow('Get failed');
    await expect(service.set('test', 'value')).rejects.toThrow('Set failed');
    await expect(service.remove('test')).rejects.toThrow('Remove failed');
    await expect(service.clear()).rejects.toThrow('Clear failed');
    await expect(service.keys()).rejects.toThrow('Keys failed');
    await expect(service.size()).rejects.toThrow('Size failed');
  });

  it('should handle errors in getOrSet', async () => {
    await expect(service.getOrSet('test', () => 'value')).rejects.toThrow('Get failed');
  });

  it('should handle errors in has', async () => {
    await expect(service.has('test')).rejects.toThrow('Get failed');
  });

  it('should handle errors in update', async () => {
    await expect(service.update('test', (x) => x)).rejects.toThrow('Get failed');
  });
});