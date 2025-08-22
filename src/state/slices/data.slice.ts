import { StateCreator } from 'zustand';
import { AppState } from '../../models/types';
import { storageService } from '../../services/storage.service';
import { createSeedData } from '../../utils/seedData';

export interface DataSlice {
  // Data management actions
  loadData: () => void;
  saveData: () => void;
  loadSeedData: () => void;
  exportData: (format?: 'json' | 'csv' | 'excel') => string | Blob;
  importData: (data: AppState) => void;
  clearAllData: () => void;
}

export const createDataSlice: StateCreator<
  DataSlice & AppState,
  [],
  [],
  DataSlice
> = (set, get) => ({
  // Load data from storage
  loadData: () => {
    const data = storageService.load();
    set(data);
  },

  // Save data to storage
  saveData: () => {
    const state = get();
    // Extract only the data, not the functions
    const { 
      loadData: _loadData, 
      saveData: _saveData, 
      loadSeedData: _loadSeedData, 
      exportData: _exportData,
      importData: _importData,
      clearAllData: _clearAllData,
      ...dataToSave 
    } = state;
    storageService.save(dataToSave as AppState);
  },

  // Load seed data for testing
  loadSeedData: () => {
    const seedData = createSeedData();
    set(seedData);
    get().saveData();
  },

  // Export data (simplified implementation)
  exportData: (format = 'json') => {
    const state = get();
    const dataToExport = {
      animals: state.animals,
      breedings: state.breedings,
      litters: state.litters,
      weights: state.weights,
      treatments: state.treatments,
      healthLogs: state.healthLogs,
      mortalities: state.mortalities,
      cages: state.cages,
      tags: state.tags,
      performanceMetrics: state.performanceMetrics,
      goals: state.goals,
      goalAchievements: state.goalAchievements,
      settings: state.settings,
    };

    if (format === 'json') {
      return JSON.stringify(dataToExport, null, 2);
    }
    
    // For CSV/Excel, would need additional implementation
    return JSON.stringify(dataToExport, null, 2);
  },

  // Import data
  importData: (data) => {
    set(data);
    get().saveData();
  },

  // Clear all data
  clearAllData: () => {
    set({
      animals: [],
      breedings: [],
      litters: [],
      weights: [],
      treatments: [],
      healthLogs: [],
      mortalities: [],
      cages: [],
      tags: [],
      performanceMetrics: [],
      goals: [],
      goalAchievements: [],
    });
    get().saveData();
  },
});