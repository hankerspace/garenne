/**
 * Service de cache en mémoire pour optimiser les performances
 * 
 * Fonctionnalités :
 * - Cache LRU (Least Recently Used) avec taille limite
 * - TTL (Time To Live) configurable par entrée
 * - Invalidation manuelle et automatique
 * - Métriques de performance (hit/miss ratio)
 * - Support des clés composées et namespaces
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheOptions {
  /** Taille maximale du cache (nombre d'entrées) */
  maxSize?: number;
  /** TTL par défaut en millisecondes */
  defaultTTL?: number;
  /** Activer les métriques de performance */
  enableMetrics?: boolean;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  hitRatio: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private accessOrder: string[] = [];
  private readonly maxSize: number;
  private readonly defaultTTL: number;
  private readonly enableMetrics: boolean;
  
  // Métriques
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 minutes par défaut
    this.enableMetrics = options.enableMetrics ?? true;
  }

  /**
   * Récupère une valeur du cache
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      if (this.enableMetrics) this.misses++;
      return undefined;
    }

    // Vérifier l'expiration
    if (this.isExpired(entry)) {
      this.delete(key);
      if (this.enableMetrics) this.misses++;
      return undefined;
    }

    // Mettre à jour les statistiques d'accès
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    // Mettre à jour l'ordre d'accès pour LRU
    this.updateAccessOrder(key);
    
    if (this.enableMetrics) this.hits++;
    return entry.value;
  }

  /**
   * Stocke une valeur dans le cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      ttl: ttl || this.defaultTTL,
      accessCount: 1,
      lastAccessed: now
    };

    // Si la clé existe déjà, la mettre à jour
    if (this.cache.has(key)) {
      this.cache.set(key, entry);
      this.updateAccessOrder(key);
      return;
    }

    // Vérifier si le cache est plein
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.accessOrder.push(key);
  }

  /**
   * Supprime une entrée du cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.accessOrder = this.accessOrder.filter(k => k !== key);
    }
    return deleted;
  }

  /**
   * Vide complètement le cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    if (this.enableMetrics) {
      this.hits = 0;
      this.misses = 0;
      this.evictions = 0;
    }
  }

  /**
   * Vérifie si une clé existe dans le cache (sans compter comme un hit)
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  /**
   * Récupère une valeur ou l'exécute et la met en cache
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T> | T, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Invalide toutes les entrées qui commencent par le préfixe donné
   */
  invalidatePrefix(prefix: string): number {
    let invalidated = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.delete(key);
        invalidated++;
      }
    }
    return invalidated;
  }

  /**
   * Nettoie les entrées expirées
   */
  cleanup(): number {
    let cleaned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.delete(key);
        cleaned++;
      }
    }
    return cleaned;
  }

  /**
   * Retourne les métriques de performance
   */
  getMetrics(): CacheMetrics {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      size: this.cache.size,
      hitRatio: total > 0 ? this.hits / total : 0
    };
  }

  /**
   * Retourne la taille actuelle du cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Crée une clé composée à partir de plusieurs parties
   */
  static createKey(...parts: (string | number | boolean)[]): string {
    return parts.map(part => String(part)).join(':');
  }

  // Méthodes privées

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private updateAccessOrder(key: string): void {
    // Retirer la clé de sa position actuelle
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    // L'ajouter à la fin (plus récemment utilisée)
    this.accessOrder.push(key);
  }

  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;
    
    // Supprimer l'élément le moins récemment utilisé (premier dans la liste)
    const lruKey = this.accessOrder.shift();
    if (lruKey) {
      this.cache.delete(lruKey);
      if (this.enableMetrics) this.evictions++;
    }
  }
}

// Instance singleton pour utilisation globale
export const cacheService = new CacheService({
  maxSize: 200,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  enableMetrics: true
});

// Instances spécialisées pour différents types de données
export const searchCache = new CacheService({
  maxSize: 50,
  defaultTTL: 2 * 60 * 1000, // 2 minutes pour les recherches
  enableMetrics: true
});

export const statisticsCache = new CacheService({
  maxSize: 30,
  defaultTTL: 10 * 60 * 1000, // 10 minutes pour les statistiques
  enableMetrics: true
});

export const imageCache = new CacheService({
  maxSize: 100,
  defaultTTL: 30 * 60 * 1000, // 30 minutes pour les images
  enableMetrics: true
});

export { CacheService };
export type { CacheOptions, CacheMetrics };