import React, { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Performance optimization utilities and hooks
 */

/**
 * Hook for debouncing values to reduce re-renders
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttleRef = useRef<boolean>(false);
  
  return useCallback((...args: Parameters<T>) => {
    if (!throttleRef.current) {
      callback(...args);
      throttleRef.current = true;
      
      setTimeout(() => {
        throttleRef.current = false;
      }, delay);
    }
  }, [callback, delay]) as T;
}

/**
 * Hook for memoizing expensive calculations
 */
export function useExpensiveMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  isExpensive = true
): T {
  // For expensive calculations, use deeper comparison
  const memoizedValue = useMemo(() => {
    const startTime = performance.now();
    const result = factory();
    const endTime = performance.now();
    
    if (process.env.NODE_ENV === 'development' && isExpensive) {
      const duration = endTime - startTime;
      if (duration > 5) {
        console.warn(`Expensive calculation took ${duration.toFixed(2)}ms`);
      }
    }
    
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factory, isExpensive, ...deps]);
  
  return memoizedValue;
}

/**
 * Hook for monitoring component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(0);
  
  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      const timeSinceLastRender = currentTime - lastRenderTime.current;
      
      console.debug(
        `${componentName} rendered #${renderCount.current}` +
        (lastRenderTime.current > 0 ? ` (${timeSinceLastRender.toFixed(2)}ms since last)` : '')
      );
    }
    
    lastRenderTime.current = currentTime;
  });
  
  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current,
  };
}

/**
 * Hook for lazy state initialization with expensive computations
 */
export function useLazyState<T>(initializer: () => T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(initializer);
  return [state, setState];
}

/**
 * Hook for stable callback references to prevent unnecessary re-renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const ref = useRef<T>(callback);
  
  useEffect(() => {
    ref.current = callback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps]);
  
  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []) as T;
}

/**
 * HOC for optimizing components with React.memo and custom comparison
 */
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = React.memo(Component, propsAreEqual);
  MemoizedComponent.displayName = `Optimized(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

/**
 * Shallow comparison function for React.memo
 */
export function shallowEqual<T extends Record<string, any>>(
  objA: T,
  objB: T
): boolean {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  if (keysA.length !== keysB.length) {
    return false;
  }
  
  for (const key of keysA) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Deep comparison function for complex props
 */
export function deepEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true;
  
  if (objA == null || objB == null) return false;
  
  if (typeof objA !== typeof objB) return false;
  
  if (typeof objA !== 'object') return objA === objB;
  
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }
  
  return true;
}

export default {
  useDebounce,
  useThrottle,
  useExpensiveMemo,
  useRenderPerformance,
  useLazyState,
  useStableCallback,
  withPerformanceOptimization,
  shallowEqual,
  deepEqual,
};