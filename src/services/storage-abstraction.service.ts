/**
 * Couche d'abstraction pour les services de stockage
 * 
 * Permet de standardiser l'interface entre différents types de stockage
 * (localStorage, sessionStorage, IndexedDB, etc.) et facilite les tests
 */

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
  size(): Promise<number>;
}

/**
 * Adaptateur pour localStorage
 */
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private keyPrefix: string = '') {}

  private getFullKey(key: string): string {
    return this.keyPrefix ? `${this.keyPrefix}:${key}` : key;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key);
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to get item from localStorage:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item in localStorage:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.warn(`Failed to remove item from localStorage:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.keyPrefix) {
        // Supprimer seulement les clés avec le préfixe
        const keys = await this.keys();
        for (const key of keys) {
          await this.remove(key);
        }
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.warn(`Failed to clear localStorage:`, error);
    }
  }

  async keys(): Promise<string[]> {
    try {
      const allKeys = Object.keys(localStorage);
      if (this.keyPrefix) {
        const prefixWithSeparator = `${this.keyPrefix}:`;
        return allKeys
          .filter(key => key.startsWith(prefixWithSeparator))
          .map(key => key.substring(prefixWithSeparator.length));
      }
      return allKeys;
    } catch (error) {
      console.warn(`Failed to get keys from localStorage:`, error);
      return [];
    }
  }

  async size(): Promise<number> {
    const keys = await this.keys();
    return keys.length;
  }
}

/**
 * Adaptateur pour sessionStorage
 */
export class SessionStorageAdapter implements StorageAdapter {
  constructor(private keyPrefix: string = '') {}

  private getFullKey(key: string): string {
    return this.keyPrefix ? `${this.keyPrefix}:${key}` : key;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key);
      const item = sessionStorage.getItem(fullKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to get item from sessionStorage:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      sessionStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item in sessionStorage:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      sessionStorage.removeItem(fullKey);
    } catch (error) {
      console.warn(`Failed to remove item from sessionStorage:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.keyPrefix) {
        const keys = await this.keys();
        for (const key of keys) {
          await this.remove(key);
        }
      } else {
        sessionStorage.clear();
      }
    } catch (error) {
      console.warn(`Failed to clear sessionStorage:`, error);
    }
  }

  async keys(): Promise<string[]> {
    try {
      const allKeys = Object.keys(sessionStorage);
      if (this.keyPrefix) {
        const prefixWithSeparator = `${this.keyPrefix}:`;
        return allKeys
          .filter(key => key.startsWith(prefixWithSeparator))
          .map(key => key.substring(prefixWithSeparator.length));
      }
      return allKeys;
    } catch (error) {
      console.warn(`Failed to get keys from sessionStorage:`, error);
      return [];
    }
  }

  async size(): Promise<number> {
    const keys = await this.keys();
    return keys.length;
  }
}

/**
 * Adaptateur en mémoire pour les tests
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, any>();

  async get<T>(key: string): Promise<T | null> {
    return this.storage.get(key) || null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async size(): Promise<number> {
    return this.storage.size;
  }
}

/**
 * Service de stockage unifié avec couche d'abstraction
 */
export class AbstractStorageService {
  constructor(private adapter: StorageAdapter) {}

  /**
   * Récupère une valeur stockée
   */
  async get<T>(key: string): Promise<T | null> {
    return this.adapter.get<T>(key);
  }

  /**
   * Stocke une valeur
   */
  async set<T>(key: string, value: T): Promise<void> {
    return this.adapter.set(key, value);
  }

  /**
   * Supprime une valeur
   */
  async remove(key: string): Promise<void> {
    return this.adapter.remove(key);
  }

  /**
   * Vide le stockage
   */
  async clear(): Promise<void> {
    return this.adapter.clear();
  }

  /**
   * Récupère toutes les clés
   */
  async keys(): Promise<string[]> {
    return this.adapter.keys();
  }

  /**
   * Récupère le nombre d'éléments stockés
   */
  async size(): Promise<number> {
    return this.adapter.size();
  }

  /**
   * Récupère ou stocke une valeur (pattern cache-aside)
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T> | T
  ): Promise<T> {
    const existing = await this.get<T>(key);
    if (existing !== null) {
      return existing;
    }

    const value = await factory();
    await this.set(key, value);
    return value;
  }

  /**
   * Vérifie si une clé existe
   */
  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  /**
   * Met à jour une valeur existante
   */
  async update<T>(
    key: string, 
    updater: (current: T | null) => T
  ): Promise<T> {
    const current = await this.get<T>(key);
    const updated = updater(current);
    await this.set(key, updated);
    return updated;
  }
}

// Instances par défaut
export const localStorage = new AbstractStorageService(
  new LocalStorageAdapter('garenne')
);

export const sessionStorage = new AbstractStorageService(
  new SessionStorageAdapter('garenne')
);

export const memoryStorage = new AbstractStorageService(
  new MemoryStorageAdapter()
);