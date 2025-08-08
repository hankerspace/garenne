/**
 * Application Constants
 * 
 * Centralized location for all application constants to ensure consistency
 * and easy maintenance across the codebase.
 */

// Component Size Constants
export const QR_CODE_SIZES = {
  small: 80,
  medium: 120,
  large: 200,
} as const;

// Retry and Error Handling Constants
export const ERROR_CONSTANTS = {
  MAX_RETRIES: 3,
  DEFAULT_RETRY_DELAY: 1000,
  MAX_RETRY_DELAY: 5000,
} as const;

// Animation and Transition Constants
export const ANIMATION_CONSTANTS = {
  COLLAPSE_TIMEOUT: 300,
  DEBOUNCE_DELAY: 300,
  SEARCH_DEBOUNCE_DELAY: 500,
  ANNOUNCEMENT_TIMEOUT: 3000,
} as const;

// Storage and Cache Constants
export const STORAGE_CONSTANTS = {
  VERSION_KEY: 'garenne_version',
  SETTINGS_KEY: 'garenne_settings',
  ANIMALS_KEY: 'garenne_animals',
  LITTERS_KEY: 'garenne_litters',
  CAGES_KEY: 'garenne_cages',
  TAGS_KEY: 'garenne_tags',
} as const;

// Performance Constants
export const PERFORMANCE_CONSTANTS = {
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100,
  LAZY_LOADING_THRESHOLD: 300,
} as const;

// Accessibility Constants
export const A11Y_CONSTANTS = {
  ARIA_LIVE_REGIONS: {
    POLITE: 'polite',
    ASSERTIVE: 'assertive',
  },
  FOCUS_TIMEOUT: 100,
  KEYBOARD_NAVIGATION_DELAY: 50,
} as const;

// Navigation Constants
export const NAVIGATION_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  BOTTOM_NAV_HEIGHT: 56,
  BREADCRUMB_MAX_ITEMS: 5,
} as const;

// Form Validation Constants
export const VALIDATION_CONSTANTS = {
  MIN_WEIGHT: 0.1,
  MAX_WEIGHT: 10,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 8,
} as const;

// Export all constants as a single object for organized imports
export const CONSTANTS = {
  QR_CODE_SIZES,
  ERROR_CONSTANTS,
  ANIMATION_CONSTANTS,
  STORAGE_CONSTANTS,
  PERFORMANCE_CONSTANTS,
  A11Y_CONSTANTS,
  NAVIGATION_CONSTANTS,
  VALIDATION_CONSTANTS,
} as const;

export default CONSTANTS;