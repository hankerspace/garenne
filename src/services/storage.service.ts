import * as LZString from 'lz-string';
import { AppState, AppSettings } from '../models/types';
import { I18nService } from './i18n.service';

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
  locale: I18nService.detectBrowserLocale(), // Use browser locale as default
  schemaVersion: 2,
  gestationDuration: 31,
  weaningDuration: 28,
  reproductionReadyDuration: 90,
  slaughterReadyDuration: 70,
  exportFormat: 'json',
  includeImages: false,
};

const defaultState: AppState = {
  animals: [],
  breedings: [],
  litters: [],
  weights: [],
  treatments: [],
  mortalities: [],
  cages: [],
  tags: [],
  performanceMetrics: [],
  goals: [],
  goalAchievements: [],
  settings: defaultSettings,
};

export class LocalStorageService implements StorageService {
  load(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // New user - use browser locale detection
        return {
          ...defaultState,
          settings: {
            ...defaultSettings,
            locale: I18nService.detectBrowserLocale(),
          }
        };
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
      const parsedState = parsed as Record<string, any>;
      return {
        ...defaultState,
        ...(parsedState && typeof parsedState === 'object' ? parsedState : {}),
        settings: {
          ...defaultSettings,
          ...(parsedState?.settings && typeof parsedState.settings === 'object' ? parsedState.settings : {}),
        },
      };
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return {
        ...defaultState,
        settings: {
          ...defaultSettings,
          locale: I18nService.detectBrowserLocale(),
        }
      };
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
    const stateObj = state as Record<string, any>;
    
    // Handle migrations from older schema versions
    if (!stateObj?.settings?.schemaVersion || stateObj.settings.schemaVersion < 2) {
      // Migration from v0/v1 to v2 - add new arrays and settings
      const migratedState = {
        ...defaultState,
        ...(stateObj && typeof stateObj === 'object' ? stateObj : {}),
        // Ensure new arrays exist
        cages: stateObj?.cages || [],
        tags: stateObj?.tags || [],
        performanceMetrics: stateObj?.performanceMetrics || [],
        settings: {
          ...defaultSettings,
          ...(stateObj?.settings && typeof stateObj.settings === 'object' ? stateObj.settings : {}),
          schemaVersion: 2,
          // Ensure new settings have defaults
          locale: stateObj?.settings?.locale || I18nService.detectBrowserLocale(), // Use browser locale if no locale is set
          gestationDuration: stateObj?.settings?.gestationDuration || 31,
          weaningDuration: stateObj?.settings?.weaningDuration || 28,
          reproductionReadyDuration: stateObj?.settings?.reproductionReadyDuration || 90,
          slaughterReadyDuration: stateObj?.settings?.slaughterReadyDuration || 70,
          exportFormat: stateObj?.settings?.exportFormat || 'json',
          includeImages: stateObj?.settings?.includeImages || false,
        },
      };
      return migratedState;
    }
    
    return stateObj as AppState;
  }
}

// Singleton instance
export const storageService = new LocalStorageService();