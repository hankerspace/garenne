import { lazy } from 'react';

/**
 * Lazy-loaded chart components for better code splitting
 * These components are loaded only when needed, reducing initial bundle size
 */

// Chart components - loaded when statistics/dashboard pages are accessed
export const PopulationChart = lazy(() => 
  import('./charts/PopulationChart.tsx').then(module => ({ default: module.PopulationChart }))
);

export const WeightChart = lazy(() => 
  import('./charts/WeightChart.tsx').then(module => ({ default: module.WeightChart }))
);

// Modal components - loaded when user interactions trigger them
export const LitterModal = lazy(() => 
  import('./modals/LitterModal.tsx').then(module => ({ default: module.LitterModal }))
);

export const BreedingModal = lazy(() => 
  import('./modals/BreedingModal.tsx').then(module => ({ default: module.BreedingModal }))
);

export const QuickTreatmentModal = lazy(() => 
  import('./modals/QuickTreatmentModal.tsx').then(module => ({ default: module.QuickTreatmentModal }))
);

// Advanced components - loaded when specific features are used
export const GenealogyTree = lazy(() => 
  import('./GenealogyTree.tsx').then(module => ({ default: module.GenealogyTree }))
);

export const PrintableRabbitSheet = lazy(() => import('./PrintableRabbitSheet.tsx'));

export const AdvancedSearchFilters = lazy(() => 
  import('./AdvancedSearchFilters.tsx').then(module => ({ default: module.AdvancedSearchFilters }))
);

// QR Code component - loaded when QR features are enabled
export const QRCodeDisplay = lazy(() => import('./QRCodeDisplay.tsx'));

/**
 * Re-export all lazy components for easy consumption
 */
export const LazyComponents = {
  // Charts
  PopulationChart,
  WeightChart,
  
  // Modals
  LitterModal,
  BreedingModal,
  QuickTreatmentModal,
  
  // Advanced components
  GenealogyTree,
  PrintableRabbitSheet,
  AdvancedSearchFilters,
  QRCodeDisplay,
} as const;

export default LazyComponents;