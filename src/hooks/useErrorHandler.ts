import { useCallback, useEffect } from 'react';
import { errorInterceptorService, ErrorContext } from '../services/error-interceptor.service';

/**
 * Hook pour gérer les erreurs dans les composants React
 * 
 * Fournit des méthodes pour capturer et traiter les erreurs
 * avec le contexte du composant automatiquement ajouté
 */
export function useErrorHandler(componentName: string) {
  useEffect(() => {
    // Enregistrer un intercepteur spécifique au composant si nécessaire
    return () => {
      // Nettoyage si nécessaire
    };
  }, [componentName]);

  /**
   * Capture une erreur avec le contexte du composant
   */
  const captureError = useCallback(
    (error: Error, action?: string, additionalContext?: Partial<ErrorContext>) => {
      return errorInterceptorService.captureError(error, {
        component: componentName,
        action,
        ...additionalContext
      });
    },
    [componentName]
  );

  /**
   * Exécute une opération avec gestion d'erreur automatique
   */
  const withErrorHandler = useCallback(
    async <T>(
      operation: () => Promise<T>,
      action: string,
      options?: {
        showToUser?: boolean;
        retries?: number;
        fallback?: T;
      }
    ): Promise<T | undefined> => {
      try {
        if (options?.retries) {
          return await errorInterceptorService.captureWithRetry(
            operation,
            options.retries,
            { component: componentName, action }
          );
        } else {
          return await operation();
        }
      } catch (error) {
        await captureError(error as Error, action, {
          showToUser: options?.showToUser
        });
        
        return options?.fallback;
      }
    },
    [componentName, captureError]
  );

  /**
   * Wrapper pour les handlers d'événements
   */
  const wrapHandler = useCallback(
    <T extends (...args: any[]) => any>(
      handler: T,
      action: string
    ): T => {
      return ((...args: any[]) => {
        try {
          return handler(...args);
        } catch (error) {
          captureError(error as Error, action);
          throw error; // Re-throw pour maintenir le comportement original
        }
      }) as T;
    },
    [captureError]
  );

  return {
    captureError,
    withErrorHandler,
    wrapHandler
  };
}

/**
 * Hook pour obtenir les statistiques d'erreurs
 */
export function useErrorStats() {
  const getStats = useCallback(() => {
    return errorInterceptorService.getErrorStats();
  }, []);

  const getHistory = useCallback(() => {
    return errorInterceptorService.getErrorHistory();
  }, []);

  const clearHistory = useCallback(() => {
    errorInterceptorService.clearHistory();
  }, []);

  return {
    getStats,
    getHistory,
    clearHistory
  };
}