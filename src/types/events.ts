import { MouseEvent, KeyboardEvent, ChangeEvent } from 'react';

/**
 * Standard event callback types for consistent typing across the application
 */

// Basic event handlers
export type EventHandler<T = Element> = (event: MouseEvent<T>) => void;
export type KeyboardEventHandler<T = Element> = (event: KeyboardEvent<T>) => void;
export type ChangeEventHandler<T = Element> = (event: ChangeEvent<T>) => void;

// Form event handlers
export type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type InputChangeHandler = (value: string, name?: string) => void;
export type SelectChangeHandler<T = string> = (value: T, name?: string) => void;
export type CheckboxChangeHandler = (checked: boolean, name?: string) => void;

// Search and filter handlers
export type SearchHandler = (query: string) => void;
export type FilterChangeHandler<T = any> = (filters: T) => void;
export type SortHandler = (field: string, direction: 'asc' | 'desc') => void;

// Navigation handlers
export type NavigationHandler = (path: string) => void;
export type TabChangeHandler = (newValue: number | string) => void;

// Data manipulation handlers
export type CreateHandler<T = any> = (data: T) => void | Promise<void>;
export type UpdateHandler<T = any> = (id: string, data: Partial<T>) => void | Promise<void>;
export type DeleteHandler = (id: string) => void | Promise<void>;
export type BulkActionHandler = (ids: string[], action: string) => void | Promise<void>;

// Modal and dialog handlers
export type ModalOpenHandler = () => void;
export type ModalCloseHandler = () => void;
export type ConfirmHandler = () => void | Promise<void>;
export type CancelHandler = () => void;

// File handlers
export type FileSelectHandler = (files: FileList | File[]) => void;
export type FileUploadHandler = (file: File) => Promise<string>;
export type FileDownloadHandler = (filename: string, data: Blob | string) => void;

// Pagination handlers
export type PageChangeHandler = (page: number) => void;
export type PageSizeChangeHandler = (size: number) => void;

// Selection handlers
export type SelectionChangeHandler<T = string> = (selected: T[]) => void;
export type ItemSelectHandler<T = any> = (item: T) => void;

// Async handlers with loading states
export type AsyncHandler<T = void> = () => Promise<T>;
export type AsyncHandlerWithData<TData, TResult = void> = (data: TData) => Promise<TResult>;

// Error handlers
export type ErrorHandler = (error: Error) => void;
export type RetryHandler = () => void | Promise<void>;

// Notification handlers
export type NotificationHandler = (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;

// Generic callback types
export type Callback = () => void;
export type CallbackWithData<T> = (data: T) => void;
export type CallbackWithResult<T> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;
export type AsyncCallbackWithData<TData, TResult = void> = (data: TData) => Promise<TResult>;

// Ref callback types
export type RefCallback<T = HTMLElement> = (ref: T | null) => void;

// Animation and transition callbacks
export type AnimationStartHandler = () => void;
export type AnimationEndHandler = () => void;
export type TransitionHandler = () => void;

/**
 * Utility type for making all event handlers optional
 */
export type OptionalEventHandlers<T> = {
  [K in keyof T]?: T[K];
};

/**
 * Type for components that can handle loading states
 */
export interface LoadingState {
  loading: boolean;
  error?: string | null;
}

/**
 * Type for components with async actions
 */
export interface AsyncState<T = any> extends LoadingState {
  data?: T;
  lastUpdated?: Date;
}

/**
 * Common props for components that handle async operations
 */
export interface AsyncComponentProps<T = any> {
  loading?: boolean;
  error?: string | null;
  onRetry?: RetryHandler;
  onError?: ErrorHandler;
  data?: T;
}