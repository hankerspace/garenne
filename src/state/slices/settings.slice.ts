import { StateCreator } from 'zustand';
import { AppState } from '../../models/types';

export interface SettingsSlice {
  settings: AppState['settings'];
  
  // Settings actions
  updateSettings: (updates: Partial<AppState['settings']>) => void;
  resetSettings: () => void;
  getSettingValue: <T extends keyof AppState['settings']>(key: T) => AppState['settings'][T];
}

const defaultSettings: AppState['settings'] = {
  theme: 'light',
  weightUnit: 'g',
  enableQR: false,
  locale: 'fr-FR',
  schemaVersion: 2,
  gestationDuration: 31,
  weaningDuration: 28,
  reproductionReadyDuration: 90,
  slaughterReadyDuration: 70,
  exportFormat: 'json',
  includeImages: false,
};

export const createSettingsSlice: StateCreator<
  SettingsSlice & { saveData: () => void },
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  settings: defaultSettings,

  // Settings actions
  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
    get().saveData();
  },

  resetSettings: () => {
    set({
      settings: defaultSettings,
    });
    get().saveData();
  },

  // Selector helper
  getSettingValue: (key) => {
    const state = get();
    return state.settings[key];
  },
});