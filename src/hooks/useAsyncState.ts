import { useState, useCallback } from 'react';
import { LoadingState, AsyncState } from '../types/events';

/**
 * Hook pour gérer les états de chargement asynchrone
 */
export const useAsyncState = <T = any>(
  initialData?: T
): AsyncState<T> & {
  setLoading: (loading: boolean) => void;
  setData: (data: T) => void;
  setError: (error: string | null) => void;
  reset: () => void;
} => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>();

  const setDataWithTimestamp = useCallback((newData: T) => {
    setData(newData);
    setLastUpdated(new Date());
    setError(null);
  }, []);

  const setErrorWithClearData = useCallback((newError: string | null) => {
    setError(newError);
    if (newError) {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setData(initialData);
    setError(null);
    setLastUpdated(undefined);
  }, [initialData]);

  return {
    loading,
    data,
    error,
    lastUpdated,
    setLoading,
    setData: setDataWithTimestamp,
    setError: setErrorWithClearData,
    reset,
  };
};

/**
 * Hook pour exécuter des fonctions asynchrones avec gestion d'état
 */
export const useAsyncCallback = <TArgs extends any[], TReturn>(
  asyncFunction: (...args: TArgs) => Promise<TReturn>
): {
  execute: (...args: TArgs) => Promise<TReturn | undefined>;
  loading: boolean;
  error: string | null;
  data: TReturn | undefined;
  reset: () => void;
} => {
  const asyncState = useAsyncState<TReturn>();

  const execute = useCallback(
    async (...args: TArgs): Promise<TReturn | undefined> => {
      try {
        asyncState.setLoading(true);
        asyncState.setError(null);
        
        const result = await asyncFunction(...args);
        asyncState.setData(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
        asyncState.setError(errorMessage);
        return undefined;
      } finally {
        asyncState.setLoading(false);
      }
    },
    [asyncFunction, asyncState]
  );

  return {
    execute,
    loading: asyncState.loading,
    error: asyncState.error ?? null,
    data: asyncState.data,
    reset: asyncState.reset,
  };
};

/**
 * Hook pour gérer plusieurs opérations asynchrones concurrentes
 */
export const useConcurrentAsync = () => {
  const [operations, setOperations] = useState<Map<string, LoadingState>>(new Map());

  const startOperation = useCallback((id: string) => {
    setOperations(prev => new Map(prev).set(id, { loading: true, error: null }));
  }, []);

  const completeOperation = useCallback((id: string) => {
    setOperations(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const failOperation = useCallback((id: string, error: string) => {
    setOperations(prev => new Map(prev).set(id, { loading: false, error }));
  }, []);

  const isLoading = useCallback((id?: string) => {
    if (id) {
      return operations.get(id)?.loading ?? false;
    }
    return Array.from(operations.values()).some(op => op.loading);
  }, [operations]);

  const getError = useCallback((id: string) => {
    return operations.get(id)?.error ?? null;
  }, [operations]);

  const executeWithTracking = useCallback(
    async <T>(id: string, asyncFunction: () => Promise<T>): Promise<T | undefined> => {
      try {
        startOperation(id);
        const result = await asyncFunction();
        completeOperation(id);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
        failOperation(id, errorMessage);
        return undefined;
      }
    },
    [startOperation, completeOperation, failOperation]
  );

  return {
    operations: Array.from(operations.entries()).map(([id, state]) => ({ id, ...state })),
    isLoading,
    getError,
    executeWithTracking,
    startOperation,
    completeOperation,
    failOperation,
  };
};