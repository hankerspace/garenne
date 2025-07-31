import * as LZString from 'lz-string';
import { AppState, AppSettings } from '../models/types';

const STORAGE_KEY = 'rabbit-app-v1';
const COMPRESSION_THRESHOLD = 1024 * 1024; // 1MB

export interface StorageService {
  load(): AppState;
  save(state: AppState): void;
  clear(): void;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  weightUnit: 'g',
  enableQR: false,
  locale: 'fr-FR',
  schemaVersion: 1,
};

const defaultState: AppState = {
  animals: [],
  breedings: [],
  litters: [],
  weights: [],
  treatments: [],
  mortalities: [],
  settings: defaultSettings,
};

export class LocalStorageService implements StorageService {
  load(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return defaultState;
      }

      let parsed: unknown;
      
      // Try to parse as compressed data first
      try {
        const decompressed = LZString.decompressFromUTF16(stored);
        if (decompressed) {
          parsed = JSON.parse(decompressed);
        } else {
          // Not compressed, parse directly
          parsed = JSON.parse(stored);
        }
      } catch {
        // Fallback to direct parsing
        parsed = JSON.parse(stored);
      }

      // Merge with default state to handle schema changes
      return {
        ...defaultState,
        ...parsed,
        settings: {
          ...defaultSettings,
          ...parsed.settings,
        },
      };
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultState;
    }
  }

  save(state: AppState): void {
    try {
      // Save to temporary key first for atomic operation
      const tempKey = `${STORAGE_KEY}_temp`;
      const data = JSON.stringify(state);
      
      let toStore: string;
      
      // Compress if data is large
      if (data.length > COMPRESSION_THRESHOLD) {
        toStore = LZString.compressToUTF16(data);
      } else {
        toStore = data;
      }
      
      localStorage.setItem(tempKey, toStore);
      
      // Atomic swap
      localStorage.setItem(STORAGE_KEY, toStore);
      localStorage.removeItem(tempKey);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw new Error('Échec de la sauvegarde des données');
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Migration service for handling schema changes
export class MigrationService {
  static migrate(state: unknown): AppState {
    // Handle migrations from older schema versions
    if (!state.settings?.schemaVersion) {
      // Migration from v0 to v1
      state = {
        ...defaultState,
        ...state,
        settings: {
          ...defaultSettings,
          ...state.settings,
          schemaVersion: 1,
        },
      };
    }
    
    return state;
  }
}

// Singleton instance
export const storageService = new LocalStorageService();