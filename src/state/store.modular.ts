import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  createAnimalsSlice, 
  createBreedingSlice, 
  createSettingsSlice, 
  createDataSlice,
  type AnimalsSlice,
  type BreedingSlice, 
  type SettingsSlice,
  type DataSlice 
} from './slices';
import { AppState } from '../models/types';

// Combined store interface
type AppStore = AnimalsSlice & BreedingSlice & SettingsSlice & DataSlice & {
  // Additional state not in slices yet (for backward compatibility)
  litters: AppState['litters'];
  weights: AppState['weights'];
  treatments: AppState['treatments'];
  healthLogs: AppState['healthLogs'];
  mortalities: AppState['mortalities'];
  cages: AppState['cages'];
  tags: AppState['tags'];
  performanceMetrics: AppState['performanceMetrics'];
  goals: AppState['goals'];
  goalAchievements: AppState['goalAchievements'];
  
  // Legacy actions (to be moved to slices later)
  addLitter: (litter: Omit<AppState['litters'][0], 'id' | 'createdAt' | 'updatedAt'>) => AppState['litters'][0];
  updateLitter: (id: string, updates: Partial<AppState['litters'][0]>) => void;
  deleteLitter: (id: string) => void;
  addWeight: (weight: Omit<AppState['weights'][0], 'id' | 'createdAt' | 'updatedAt'>) => AppState['weights'][0];
  updateWeight: (id: string, updates: Partial<AppState['weights'][0]>) => void;
  deleteWeight: (id: string) => void;
  addTreatment: (treatment: Omit<AppState['treatments'][0], 'id' | 'createdAt' | 'updatedAt'>) => AppState['treatments'][0];
  updateTreatment: (id: string, updates: Partial<AppState['treatments'][0]>) => void;
  deleteTreatment: (id: string) => void;
  addMortality: (mortality: Omit<AppState['mortalities'][0], 'id' | 'createdAt' | 'updatedAt'>) => AppState['mortalities'][0];
  updateMortality: (id: string, updates: Partial<AppState['mortalities'][0]>) => void;
  deleteMortality: (id: string) => void;
  addCage: (cage: Omit<AppState['cages'][0], 'id' | 'createdAt' | 'updatedAt'>) => AppState['cages'][0];
  updateCage: (id: string, updates: Partial<AppState['cages'][0]>) => void;
  deleteCage: (id: string) => void;
  addTag: (tag: Omit<AppState['tags'][0], 'id' | 'createdAt' | 'updatedAt'>) => AppState['tags'][0];
  updateTag: (id: string, updates: Partial<AppState['tags'][0]>) => void;
  deleteTag: (id: string) => void;
  addPerformanceMetrics: (metrics: Omit<AppState['performanceMetrics'][0], 'id' | 'createdAt' | 'updatedAt'>) => AppState['performanceMetrics'][0];
  updatePerformanceMetrics: (id: string, updates: Partial<AppState['performanceMetrics'][0]>) => void;
  deletePerformanceMetrics: (id: string) => void;
  calculatePerformanceMetrics: (animalId: string, period: string) => void;
  addGoal: (goal: Omit<AppState['goals'][0], 'id' | 'createdAt' | 'updatedAt'>) => AppState['goals'][0];
  updateGoal: (id: string, updates: Partial<AppState['goals'][0]>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, currentValue: number) => void;
  completeGoal: (id: string, actualValue: number, notes?: string) => void;
  addGoalAchievement: (achievement: Omit<AppState['goalAchievements'][0], 'id' | 'createdAt'>) => AppState['goalAchievements'][0];
};

/**
 * Modular Zustand store using slices pattern
 * 
 * This store combines multiple slices for better organization and maintainability.
 * Each slice is responsible for a specific domain of the application state.
 */
export const useAppStoreModular = create<AppStore>()(
  subscribeWithSelector((set, get, api) => ({
    // Combine all slices
    ...createAnimalsSlice(set, get, api),
    ...createBreedingSlice(set, get, api),
    ...createSettingsSlice(set, get, api),
    ...createDataSlice(set, get, api),
    
    // Temporary state for backward compatibility
    // TODO: Move these to their own slices
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
    
    // Placeholder implementations for legacy actions
    // TODO: Implement these in their respective slices
    addLitter: () => ({ id: '', createdAt: '', updatedAt: '' } as any),
    updateLitter: () => {},
    deleteLitter: () => {},
    addWeight: () => ({ id: '', createdAt: '', updatedAt: '' } as any),
    updateWeight: () => {},
    deleteWeight: () => {},
    addTreatment: () => ({ id: '', createdAt: '', updatedAt: '' } as any),
    updateTreatment: () => {},
    deleteTreatment: () => {},
    addMortality: () => ({ id: '', createdAt: '', updatedAt: '' } as any),
    updateMortality: () => {},
    deleteMortality: () => {},
    addCage: () => ({ id: '', createdAt: '', updatedAt: '' } as any),
    updateCage: () => {},
    deleteCage: () => {},
    addTag: () => ({ id: '', createdAt: '', updatedAt: '' } as any),
    updateTag: () => {},
    deleteTag: () => {},
    addPerformanceMetrics: () => ({ id: '', createdAt: '', updatedAt: '' } as any),
    updatePerformanceMetrics: () => {},
    deletePerformanceMetrics: () => {},
    calculatePerformanceMetrics: () => {},
    addGoal: () => ({ id: '', createdAt: '', updatedAt: '' } as any),
    updateGoal: () => {},
    deleteGoal: () => {},
    updateGoalProgress: () => {},
    completeGoal: () => {},
    addGoalAchievement: () => ({ id: '', createdAt: '' } as any),
  }))
);