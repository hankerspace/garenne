import React, { Suspense } from 'react';
import { Box, CircularProgress, Skeleton, Typography } from '@mui/material';
import { ErrorBoundary } from './ErrorBoundary';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  height?: number | string;
  width?: number | string;
  variant?: 'spinner' | 'skeleton' | 'custom';
}

/**
 * Default loading fallback with spinner
 */
const SpinnerFallback = ({ height = 200 }: { height?: number | string }) => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    height={height}
    width="100%"
  >
    <CircularProgress size={40} />
  </Box>
);

/**
 * Skeleton loading fallback
 */
const SkeletonFallback = ({ height = 200, width = '100%' }: { height?: number | string; width?: number | string }) => (
  <Box p={2}>
    <Skeleton variant="rectangular" width={width} height={height} sx={{ borderRadius: 1 }} />
    <Box mt={1}>
      <Skeleton width="60%" />
      <Skeleton width="40%" />
    </Box>
  </Box>
);

/**
 * Error fallback for lazy loaded components
 */
const LazyErrorFallback = ({ error }: { error?: Error }) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    p={3}
    textAlign="center"
  >
    <Typography variant="h6" color="error.main" gutterBottom>
      Erreur de chargement
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Impossible de charger ce composant. Veuillez rafraîchir la page.
    </Typography>
    {process.env.NODE_ENV === 'development' && error && (
      <Typography variant="caption" sx={{ mt: 1, fontFamily: 'monospace' }}>
        {error.message}
      </Typography>
    )}
  </Box>
);

/**
 * Lazy wrapper component with error boundary and loading states
 * 
 * Provides consistent loading and error handling for lazy-loaded components
 */
export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  height = 200,
  width = '100%',
  variant = 'spinner',
}) => {
  const LoadingComponent = fallback || (
    variant === 'skeleton' 
      ? <SkeletonFallback height={height} width={width} />
      : <SpinnerFallback height={height} />
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={LoadingComponent}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * Higher-order component for wrapping lazy components
 */
const withLazyWrapper = <P extends object>(
  options?: Omit<LazyWrapperProps, 'children'>
) => (Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <LazyWrapper {...options}>
      <Component {...props} />
    </LazyWrapper>
  );
  
  WrappedComponent.displayName = `LazyWrapper(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Hook for dynamically importing components with error handling
 */
const useLazyImport = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  deps: React.DependencyList = []
) => {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;
    
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const module = await importFunc();
        
        if (mounted) {
          setComponent(() => module.default);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load component'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      mounted = false;
    };
  }, deps);

  return { Component, loading, error };
};

export default LazyWrapper;