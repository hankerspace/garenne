/**
 * Strict types for UI components and states
 */

import { ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { Animal, Cage, Tag, Litter, Treatment } from '../models/types';

// Base component props
export interface BaseComponentProps {
  /** Unique identifier for testing and accessibility */
  id?: string;
  /** CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA described by for accessibility */
  'aria-describedby'?: string;
}

// Button component props
export interface StrictButtonProps extends BaseComponentProps {
  /** Button text or content */
  children: ReactNode;
  /** Click handler */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Button variant */
  variant?: 'contained' | 'outlined' | 'text';
  /** Button color */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Start icon */
  startIcon?: ReactNode;
  /** End icon */
  endIcon?: ReactNode;
  /** Full width */
  fullWidth?: boolean;
  /** Keyboard shortcut for accessibility */
  keyboardShortcut?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Whether this is a destructive action */
  isDestructive?: boolean;
}

// Card component props
export interface StrictCardProps extends BaseComponentProps {
  /** Card content */
  children: ReactNode;
  /** Whether card is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Key handler */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  /** Card elevation */
  elevation?: number;
  /** Card variant */
  variant?: 'elevation' | 'outlined';
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Index for grid navigation */
  index?: number;
}

// Input component props
export interface StrictInputProps extends BaseComponentProps {
  /** Input value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** Placeholder text */
  placeholder?: string;
  /** Whether input is required */
  required?: boolean;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Helper text */
  helperText?: string;
  /** Input label */
  label?: string;
  /** Autocomplete attribute */
  autoComplete?: string;
  /** Keyboard shortcut */
  keyboardShortcut?: string;
}

// Search component props
export interface StrictSearchProps extends StrictInputProps {
  /** Search suggestions */
  suggestions?: string[];
  /** Result count for accessibility */
  resultCount?: number;
  /** Custom result announcement */
  resultAnnouncement?: string;
  /** Whether to show clear button */
  showClearButton?: boolean;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
}

// Modal/Dialog props
export interface StrictModalProps extends BaseComponentProps {
  /** Whether modal is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal content */
  children: ReactNode;
  /** Maximum width */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes modal */
  disableBackdropClick?: boolean;
  /** Whether pressing escape closes modal */
  disableEscapeKeyDown?: boolean;
}

// Data grid/table props
export interface StrictDataGridProps<T = any> extends BaseComponentProps {
  /** Data to display */
  data: T[];
  /** Column definitions */
  columns: GridColumn<T>[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Selection mode */
  selectionMode?: 'single' | 'multiple' | 'none';
  /** Selected rows */
  selectedRows?: T[];
  /** Selection change handler */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Pagination */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  /** Sorting */
  sorting?: {
    sortBy?: keyof T;
    sortDirection?: 'asc' | 'desc';
    onSortChange: (sortBy: keyof T, direction: 'asc' | 'desc') => void;
  };
}

export interface GridColumn<T = any> {
  /** Column key */
  key: keyof T;
  /** Column header */
  header: string;
  /** Column width */
  width?: number | string;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Custom cell renderer */
  render?: (value: T[keyof T], row: T, index: number) => ReactNode;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether column is hidden on mobile */
  hiddenOnMobile?: boolean;
}

// Form component props
export interface StrictFormProps extends BaseComponentProps {
  /** Form children */
  children: ReactNode;
  /** Submit handler */
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  /** Whether form is loading */
  loading?: boolean;
  /** Form validation errors */
  errors?: Record<string, string>;
  /** Whether form is disabled */
  disabled?: boolean;
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
}

// Specific entity props
export interface AnimalCardProps extends BaseComponentProps {
  /** Animal data */
  animal: Animal;
  /** Card index for navigation */
  index: number;
  /** Available cages */
  cages: Cage[];
  /** Available tags */
  tags: Tag[];
  /** Consumption handler */
  onMarkConsumed: (animalId: string) => void;
  /** Click handler */
  onClick?: (animal: Animal) => void;
}

export interface LitterCardProps extends BaseComponentProps {
  /** Litter data */
  litter: Litter;
  /** Card index */
  index: number;
  /** Parent animals */
  parents: Animal[];
  /** Click handler */
  onClick?: (litter: Litter) => void;
}

export interface CageCardProps extends BaseComponentProps {
  /** Cage data */
  cage: Cage;
  /** Card index */
  index: number;
  /** Animals in cage */
  animals: Animal[];
  /** Click handler */
  onClick?: (cage: Cage) => void;
}

// Event handlers with strict typing
export type StrictEventHandler<T extends HTMLElement, E = MouseEvent<T>> = (event: E) => void;
export type StrictKeyboardHandler<T extends HTMLElement> = (event: KeyboardEvent<T>) => void;
export type StrictFormHandler = (event: React.FormEvent<HTMLFormElement>) => void;

// UI State types
export interface UILoadingState {
  /** Whether data is loading */
  loading: boolean;
  /** Loading message */
  message?: string;
  /** Progress percentage (0-100) */
  progress?: number;
}

export interface UIErrorState {
  /** Whether there's an error */
  hasError: boolean;
  /** Error message */
  message?: string;
  /** Error details */
  details?: string;
  /** Error code */
  code?: string | number;
  /** Whether error is retryable */
  retryable?: boolean;
}

export interface UISuccessState {
  /** Whether operation was successful */
  success: boolean;
  /** Success message */
  message?: string;
  /** Additional data */
  data?: any;
}

// Combined UI state
export interface UIState {
  /** Loading state */
  loading: UILoadingState;
  /** Error state */
  error: UIErrorState;
  /** Success state */
  success: UISuccessState;
}

// Page state types
export interface PageState<T = any> extends UIState {
  /** Page data */
  data: T[];
  /** Current page */
  page: number;
  /** Page size */
  pageSize: number;
  /** Total items */
  total: number;
  /** Search query */
  searchQuery: string;
  /** Filters */
  filters: Record<string, any>;
  /** Selected items */
  selectedItems: T[];
}

// Navigation types
export interface NavigationItem {
  /** Route path */
  path: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon?: ReactNode;
  /** Whether item is active */
  active?: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Badge count */
  badge?: number;
  /** Keyboard shortcut */
  shortcut?: string;
}

// Theme types
export interface UITheme {
  /** Primary color */
  primary: string;
  /** Secondary color */
  secondary: string;
  /** Background colors */
  background: {
    default: string;
    paper: string;
  };
  /** Text colors */
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  /** Border radius */
  borderRadius: number;
  /** Spacing unit */
  spacing: number;
  /** Breakpoints */
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Animation types
export interface UIAnimation {
  /** Animation duration */
  duration: number;
  /** Easing function */
  easing: string;
  /** Animation delay */
  delay?: number;
}

// Accessibility types
export interface AccessibilityProps {
  /** ARIA role */
  role?: string;
  /** ARIA label */
  'aria-label'?: string;
  /** ARIA labelledby */
  'aria-labelledby'?: string;
  /** ARIA describedby */
  'aria-describedby'?: string;
  /** ARIA expanded */
  'aria-expanded'?: boolean;
  /** ARIA hidden */
  'aria-hidden'?: boolean;
  /** Tab index */
  tabIndex?: number;
}

// Export all types - interfaces and types are automatically exported when declared with export