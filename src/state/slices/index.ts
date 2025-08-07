/**
 * Modular slices for Zustand store
 * 
 * This file exports all the slices that can be combined to create the main store.
 * Each slice is focused on a specific domain and can be developed and tested independently.
 */

export { createAnimalsSlice, type AnimalsSlice } from './animals.slice';
export { createBreedingSlice, type BreedingSlice } from './breeding.slice';
export { createSettingsSlice, type SettingsSlice } from './settings.slice';
export { createDataSlice, type DataSlice } from './data.slice';

// Re-export types for convenience
export type {
  Animal,
  Breeding,
  Litter,
  WeightRecord,
  Treatment,
  Mortality,
  Cage,
  Tag,
  PerformanceMetrics,
  Goal,
  GoalAchievement,
  AppState
} from '../../models/types';