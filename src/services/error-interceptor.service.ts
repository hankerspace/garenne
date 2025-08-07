/**
 * Service d'intercepteurs pour la gestion d'erreurs globale
 * 
 * Centralise la capture et le traitement des erreurs dans l'application
 * avec possibilité de logging, notifications et récupération automatique
 */

interface ErrorContext {
  component?: string;
  action?: string;
  user?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  showToUser?: boolean;
}

interface ErrorInterceptor {
  id: string;
  name: string;
  handler: (error: Error, context: ErrorContext) => Promise<void> | void;
  priority: number; // Plus bas = plus prioritaire
}

interface ErrorReport {
  error: Error;
  context: ErrorContext;
  handled: boolean;
  timestamp: number;
}

class ErrorInterceptorService {
  private interceptors: ErrorInterceptor[] = [];
  private errorHistory: ErrorReport[] = [];
  private readonly maxHistorySize: number = 100;

  constructor() {
    // Intercepter les erreurs globales non capturées
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  /**
   * Enregistre un intercepteur d'erreur
   */
  register(interceptor: ErrorInterceptor): void {
    // Vérifier si l'intercepteur existe déjà
    const existingIndex = this.interceptors.findIndex(i => i.id === interceptor.id);
    if (existingIndex >= 0) {
      this.interceptors[existingIndex] = interceptor;
    } else {
      this.interceptors.push(interceptor);
    }

    // Trier par priorité
    this.interceptors.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Désenregistre un intercepteur d'erreur
   */
  unregister(id: string): boolean {
    const index = this.interceptors.findIndex(i => i.id === id);
    if (index >= 0) {
      this.interceptors.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Capture et traite une erreur avec tous les intercepteurs
   */
  async captureError(
    error: Error, 
    context: Partial<ErrorContext> = {}
  ): Promise<void> {
    const fullContext: ErrorContext = {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context
    };

    const report: ErrorReport = {
      error,
      context: fullContext,
      handled: false,
      timestamp: Date.now()
    };

    // Traiter avec tous les intercepteurs
    for (const interceptor of this.interceptors) {
      try {
        await interceptor.handler(error, fullContext);
        report.handled = true;
      } catch (interceptorError) {
        console.error(`Error in interceptor ${interceptor.name}:`, interceptorError);
      }
    }

    // Ajouter à l'historique
    this.addToHistory(report);
  }

  /**
   * Capture une erreur avec retry automatique
   */
  async captureWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    context?: Partial<ErrorContext>
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        await this.captureError(lastError, {
          ...context,
          action: `${context?.action || 'operation'} (attempt ${attempt}/${maxRetries})`
        });

        // Attendre avant le prochain essai (backoff exponentiel)
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Retourne l'historique des erreurs
   */
  getErrorHistory(): ErrorReport[] {
    return [...this.errorHistory];
  }

  /**
   * Vide l'historique des erreurs
   */
  clearHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Retourne les statistiques d'erreurs
   */
  getErrorStats(): {
    total: number;
    handled: number;
    unhandled: number;
    byComponent: Record<string, number>;
    recent: number; // Dernière heure
  } {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const byComponent: Record<string, number> = {};

    let handled = 0;
    let recent = 0;

    for (const report of this.errorHistory) {
      if (report.handled) handled++;
      if (report.timestamp > oneHourAgo) recent++;
      
      const component = report.context.component || 'unknown';
      byComponent[component] = (byComponent[component] || 0) + 1;
    }

    return {
      total: this.errorHistory.length,
      handled,
      unhandled: this.errorHistory.length - handled,
      byComponent,
      recent
    };
  }

  // Méthodes privées

  private handleGlobalError(event: ErrorEvent): void {
    this.captureError(event.error || new Error(event.message), {
      component: 'global',
      action: 'uncaught-error'
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    this.captureError(error, {
      component: 'global',
      action: 'unhandled-promise-rejection'
    });
  }

  private addToHistory(report: ErrorReport): void {
    this.errorHistory.unshift(report);
    
    // Limiter la taille de l'historique
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }
  }
}

// Instance singleton
export const errorInterceptorService = new ErrorInterceptorService();

// Intercepteurs prédéfinis

// Intercepteur pour les logs console
errorInterceptorService.register({
  id: 'console-logger',
  name: 'Console Logger',
  priority: 1,
  handler: (error: Error, context: ErrorContext) => {
    const prefix = `[${context.component || 'Unknown'}] ${context.action || 'Error'}:`;
    console.error(prefix, error, context);
  }
});

// Intercepteur pour les notifications utilisateur (nécessite NotificationProvider)
errorInterceptorService.register({
  id: 'user-notification',
  name: 'User Notification',
  priority: 2,
  handler: (error: Error, context: ErrorContext) => {
    // Vérifier si c'est une erreur critique qui doit être montrée à l'utilisateur
    const isCritical = context.action?.includes('save') || 
                      context.action?.includes('load') ||
                      context.action?.includes('delete');

    if (isCritical) {
      // Note: Ceci nécessiterait l'intégration avec le NotificationProvider
      console.warn('Critical error that should be shown to user:', error.message);
    }
  }
});

// Intercepteur pour les métriques de performance
errorInterceptorService.register({
  id: 'performance-tracker',
  name: 'Performance Tracker',
  priority: 3,
  handler: (error: Error, context: ErrorContext) => {
    // Collecter des métriques sur les erreurs fréquentes
    if (performance.mark) {
      performance.mark(`error-${context.component}-${context.action}`);
    }
  }
});

export { ErrorInterceptorService };
export type { ErrorInterceptor, ErrorContext, ErrorReport };