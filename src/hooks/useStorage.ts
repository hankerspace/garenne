import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer localStorage avec sérialisation JSON automatique
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook pour gérer sessionStorage avec sérialisation JSON automatique
 */
export const useSessionStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook pour détecter si localStorage/sessionStorage est disponible
 */
export const useStorageSupport = () => {
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const [hasSessionStorage, setHasSessionStorage] = useState(false);

  useEffect(() => {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      setHasLocalStorage(true);
    } catch {
      setHasLocalStorage(false);
    }

    try {
      const testKey = '__storage_test__';
      window.sessionStorage.setItem(testKey, 'test');
      window.sessionStorage.removeItem(testKey);
      setHasSessionStorage(true);
    } catch {
      setHasSessionStorage(false);
    }
  }, []);

  return { hasLocalStorage, hasSessionStorage };
};