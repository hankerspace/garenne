/**
 * Custom hooks for application state management
 * 
 * These hooks provide clean, reusable interfaces for accessing
 * complex state selectors and derived data.
 */

export * from './useAnimals';
export * from './useBreeding';

// Settings hooks
export { useAppStore as useSettings } from '../store';

// Re-export the main store hook for direct access when needed
export { useAppStore } from '../store';