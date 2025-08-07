/**
 * Runtime type guards for validation
 * Provides type-safe runtime checks for data validation
 */

import { Animal, Cage, Tag, Litter, Treatment, Sex, Status } from '../models/types';

// Base type guard helpers
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isArray<T>(value: unknown, itemGuard?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false;
  if (!itemGuard) return true;
  return value.every(itemGuard);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Enum type guards
export function isSex(value: unknown): value is Sex {
  return Object.values(Sex).includes(value as Sex);
}

export function isStatus(value: unknown): value is Status {
  return Object.values(Status).includes(value as Status);
}

// Entity type guards
export function isAnimal(value: unknown): value is Animal {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isString(obj.id) &&
    isString(obj.identifier) &&
    isSex(obj.sex) &&
    isStatus(obj.status) &&
    (obj.name === undefined || isString(obj.name)) &&
    (obj.breed === undefined || isString(obj.breed)) &&
    (obj.birthDate === undefined || isString(obj.birthDate)) &&
    (obj.notes === undefined || isString(obj.notes)) &&
    (obj.cage === undefined || isString(obj.cage)) &&
    (obj.father === undefined || isString(obj.father)) &&
    (obj.mother === undefined || isString(obj.mother)) &&
    (obj.tags === undefined || isArray(obj.tags, isString)) &&
    (obj.photos === undefined || isArray(obj.photos, isString))
  );
}

export function isCage(value: unknown): value is Cage {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isString(obj.id) &&
    isString(obj.name) &&
    (obj.description === undefined || isString(obj.description)) &&
    (obj.capacity === undefined || isNumber(obj.capacity)) &&
    (obj.location === undefined || isString(obj.location))
  );
}

export function isTag(value: unknown): value is Tag {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isString(obj.id) &&
    isString(obj.name) &&
    (obj.color === undefined || isString(obj.color)) &&
    (obj.description === undefined || isString(obj.description))
  );
}

export function isLitter(value: unknown): value is Litter {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isString(obj.id) &&
    isString(obj.father) &&
    isString(obj.mother) &&
    isString(obj.birthDate) &&
    (obj.weaningDate === undefined || isString(obj.weaningDate)) &&
    isNumber(obj.totalBorn) &&
    isNumber(obj.totalAlive) &&
    (obj.notes === undefined || isString(obj.notes))
  );
}

export function isTreatment(value: unknown): value is Treatment {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isString(obj.id) &&
    isString(obj.animalId) &&
    isString(obj.type) &&
    isString(obj.date) &&
    (obj.product === undefined || isString(obj.product)) &&
    (obj.dosage === undefined || isString(obj.dosage)) &&
    (obj.withdrawalPeriod === undefined || isNumber(obj.withdrawalPeriod)) &&
    (obj.notes === undefined || isString(obj.notes)) &&
    (obj.veterinarian === undefined || isString(obj.veterinarian))
  );
}

// Collection type guards
export function isAnimalArray(value: unknown): value is Animal[] {
  return isArray(value, isAnimal);
}

export function isCageArray(value: unknown): value is Cage[] {
  return isArray(value, isCage);
}

export function isTagArray(value: unknown): value is Tag[] {
  return isArray(value, isTag);
}

export function isLitterArray(value: unknown): value is Litter[] {
  return isArray(value, isLitter);
}

export function isTreatmentArray(value: unknown): value is Treatment[] {
  return isArray(value, isTreatment);
}

// UI state type guards
export function isUILoadingState(value: unknown): value is { loading: boolean; message?: string; progress?: number } {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isBoolean(obj.loading) &&
    (obj.message === undefined || isString(obj.message)) &&
    (obj.progress === undefined || isNumber(obj.progress))
  );
}

export function isUIErrorState(value: unknown): value is { hasError: boolean; message?: string; details?: string; code?: string | number; retryable?: boolean } {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isBoolean(obj.hasError) &&
    (obj.message === undefined || isString(obj.message)) &&
    (obj.details === undefined || isString(obj.details)) &&
    (obj.code === undefined || isString(obj.code) || isNumber(obj.code)) &&
    (obj.retryable === undefined || isBoolean(obj.retryable))
  );
}

// Generic validation helpers
export function validateRequired<T>(value: T, name: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`${name} is required`);
  }
}

export function validateString(value: unknown, name: string): asserts value is string {
  if (!isString(value)) {
    throw new Error(`${name} must be a string`);
  }
}

export function validateNumber(value: unknown, name: string): asserts value is number {
  if (!isNumber(value)) {
    throw new Error(`${name} must be a number`);
  }
}

export function validatePositiveNumber(value: unknown, name: string): asserts value is number {
  validateNumber(value, name);
  if (value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
}

export function validateDateString(value: unknown, name: string): asserts value is string {
  validateString(value, name);
  if (isNaN(Date.parse(value))) {
    throw new Error(`${name} must be a valid date string`);
  }
}

export function validateEmail(value: unknown, name: string): asserts value is string {
  validateString(value, name);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error(`${name} must be a valid email address`);
  }
}

export function validateLength(value: string, min: number, max: number, name: string): asserts value is string {
  if (value.length < min || value.length > max) {
    throw new Error(`${name} must be between ${min} and ${max} characters`);
  }
}

export function validateRange(value: number, min: number, max: number, name: string): asserts value is number {
  if (value < min || value > max) {
    throw new Error(`${name} must be between ${min} and ${max}`);
  }
}

// Validation wrapper for safe data access
export function safeAccess<T>(
  data: unknown, 
  guard: (value: unknown) => value is T, 
  fallback: T,
  errorMessage?: string
): T {
  try {
    if (guard(data)) {
      return data;
    }
    if (errorMessage) {
      console.warn(errorMessage);
    }
    return fallback;
  } catch (error) {
    console.error('Type validation error:', error);
    return fallback;
  }
}

// Runtime validation for API responses
export function validateAPIResponse<T>(
  response: unknown,
  guard: (value: unknown) => value is T,
  endpoint: string
): T {
  if (!guard(response)) {
    throw new Error(`Invalid response from ${endpoint}: response does not match expected type`);
  }
  return response;
}

// Type assertion with runtime checks
export function assertType<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  message: string
): asserts value is T {
  if (!guard(value)) {
    throw new Error(message);
  }
}

export default {
  // Basic type guards
  isString,
  isNumber,
  isBoolean,
  isDate,
  isArray,
  isObject,
  
  // Enum type guards
  isSex,
  isStatus,
  
  // Entity type guards
  isAnimal,
  isCage,
  isTag,
  isLitter,
  isTreatment,
  
  // Collection type guards
  isAnimalArray,
  isCageArray,
  isTagArray,
  isLitterArray,
  isTreatmentArray,
  
  // UI state type guards
  isUILoadingState,
  isUIErrorState,
  
  // Validation helpers
  validateRequired,
  validateString,
  validateNumber,
  validatePositiveNumber,
  validateDateString,
  validateEmail,
  validateLength,
  validateRange,
  
  // Safe access utilities
  safeAccess,
  validateAPIResponse,
  assertType,
};