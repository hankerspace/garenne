import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ErrorInterceptorService, errorInterceptorService } from '../services/error-interceptor.service';

describe('ErrorInterceptorService', () => {
  let service: ErrorInterceptorService;

  beforeEach(() => {
    service = new ErrorInterceptorService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Interceptor registration', () => {
    it('should register an interceptor', () => {
      const handler = vi.fn();
      service.register({
        id: 'test',
        name: 'Test Interceptor',
        priority: 1,
        handler
      });

      // Vérifier que l'intercepteur est enregistré en capturant une erreur
      const error = new Error('test error');
      service.captureError(error);

      expect(handler).toHaveBeenCalledWith(error, expect.any(Object));
    });

    it('should update existing interceptor with same id', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      service.register({
        id: 'test',
        name: 'Test 1',
        priority: 1,
        handler: handler1
      });

      service.register({
        id: 'test',
        name: 'Test 2',
        priority: 1,
        handler: handler2
      });

      const error = new Error('test error');
      service.captureError(error);

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should sort interceptors by priority', async () => {
      const callOrder: string[] = [];
      
      service.register({
        id: 'low',
        name: 'Low Priority',
        priority: 3,
        handler: () => { callOrder.push('low'); }
      });

      service.register({
        id: 'high',
        name: 'High Priority',
        priority: 1,
        handler: () => { callOrder.push('high'); }
      });

      service.register({
        id: 'medium',
        name: 'Medium Priority',
        priority: 2,
        handler: () => { callOrder.push('medium'); }
      });

      await service.captureError(new Error('test'));

      expect(callOrder).toEqual(['high', 'medium', 'low']);
    });

    it('should unregister interceptors', () => {
      const handler = vi.fn();
      service.register({
        id: 'test',
        name: 'Test',
        priority: 1,
        handler
      });

      const removed = service.unregister('test');
      expect(removed).toBe(true);

      service.captureError(new Error('test'));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should return false when unregistering non-existent interceptor', () => {
      const removed = service.unregister('nonexistent');
      expect(removed).toBe(false);
    });
  });

  describe('Error capture', () => {
    it('should capture errors with context', async () => {
      const handler = vi.fn();
      service.register({
        id: 'test',
        name: 'Test',
        priority: 1,
        handler
      });

      const error = new Error('test error');
      const context = { component: 'TestComponent', action: 'save' };

      await service.captureError(error, context);

      expect(handler).toHaveBeenCalledWith(error, expect.objectContaining({
        component: 'TestComponent',
        action: 'save',
        timestamp: expect.any(Number),
        userAgent: expect.any(String),
        url: expect.any(String)
      }));
    });

    it('should handle interceptor errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      service.register({
        id: 'failing',
        name: 'Failing Interceptor',
        priority: 1,
        handler: () => { throw new Error('Interceptor failed'); }
      });

      const workingHandler = vi.fn();
      service.register({
        id: 'working',
        name: 'Working Interceptor',
        priority: 2,
        handler: workingHandler
      });

      await service.captureError(new Error('test'));

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in interceptor Failing Interceptor:',
        expect.any(Error)
      );
      expect(workingHandler).toHaveBeenCalled();
    });

    it('should maintain error history', async () => {
      const error1 = new Error('error 1');
      const error2 = new Error('error 2');

      await service.captureError(error1, { component: 'Component1' });
      await service.captureError(error2, { component: 'Component2' });

      const history = service.getErrorHistory();
      expect(history).toHaveLength(2);
      expect(history[0].error.message).toBe('error 2'); // Plus récent en premier
      expect(history[1].error.message).toBe('error 1');
    });

    it('should limit history size', async () => {
      // Créer une instance avec une taille d'historique limitée pour le test
      const limitedService = new ErrorInterceptorService();
      
      // Ajouter plus d'erreurs que la limite
      for (let i = 0; i < 150; i++) {
        await limitedService.captureError(new Error(`error ${i}`));
      }

      const history = limitedService.getErrorHistory();
      expect(history.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Retry mechanism', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const operation = vi.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Operation failed');
        }
        return 'success';
      });

      const result = await service.captureWithRetry(operation, 3);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      const operation = vi.fn(() => {
        throw new Error('Persistent failure');
      });

      await expect(service.captureWithRetry(operation, 2)).rejects.toThrow('Persistent failure');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should capture error on each retry attempt', async () => {
      const handler = vi.fn();
      service.register({
        id: 'test',
        name: 'Test',
        priority: 1,
        handler
      });

      const operation = vi.fn(() => {
        throw new Error('Test error');
      });

      try {
        await service.captureWithRetry(operation, 2, { component: 'Test' });
      } catch (error) {
        // Expected to fail
      }

      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      service.register({
        id: 'test',
        name: 'Test',
        priority: 1,
        handler: () => {} // Intercepteur qui marque l'erreur comme gérée
      });
    });

    it('should track error statistics', async () => {
      await service.captureError(new Error('error 1'), { component: 'Component1' });
      await service.captureError(new Error('error 2'), { component: 'Component1' });
      await service.captureError(new Error('error 3'), { component: 'Component2' });

      const stats = service.getErrorStats();

      expect(stats.total).toBe(3);
      expect(stats.handled).toBe(3);
      expect(stats.unhandled).toBe(0);
      expect(stats.byComponent.Component1).toBe(2);
      expect(stats.byComponent.Component2).toBe(1);
    });

    it('should track recent errors', async () => {
      // Mock Date.now pour contrôler le temps
      const now = 1000000000000; // Fixed timestamp
      const oneHourAgo = now - 60 * 60 * 1000;
      const twoHoursAgo = now - 2 * 60 * 60 * 1000;

      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(twoHoursAgo) // Première erreur (ancienne)
        .mockReturnValueOnce(twoHoursAgo) // Context timestamp pour première erreur
        .mockReturnValueOnce(now)         // Deuxième erreur (récente)
        .mockReturnValueOnce(now)         // Context timestamp pour deuxième erreur
        .mockReturnValue(now);            // Appel de getErrorStats

      await service.captureError(new Error('old error'));
      await service.captureError(new Error('recent error'));

      const stats = service.getErrorStats();
      expect(stats.recent).toBe(1);
    });

    it('should clear history', async () => {
      await service.captureError(new Error('error'));
      expect(service.getErrorHistory()).toHaveLength(1);

      service.clearHistory();
      expect(service.getErrorHistory()).toHaveLength(0);
    });
  });

  describe('Global error handlers', () => {
    it('should be set up during construction', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      
      new ErrorInterceptorService();

      expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });
  });

  describe('Global service instance', () => {
    it('should provide a working global instance', async () => {
      const handler = vi.fn();
      errorInterceptorService.register({
        id: 'global-test',
        name: 'Global Test',
        priority: 1,
        handler
      });

      await errorInterceptorService.captureError(new Error('global test'));

      expect(handler).toHaveBeenCalled();

      // Nettoyage
      errorInterceptorService.unregister('global-test');
    });
  });
});