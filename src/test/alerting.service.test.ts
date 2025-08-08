import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AlertingService, AlertNotification, AlertSettings } from '../services/alerting.service';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock AudioContext
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    frequency: {
      setValueAtTime: vi.fn()
    },
    start: vi.fn(),
    stop: vi.fn()
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn()
    }
  })),
  destination: {},
  currentTime: 0
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window, 'AudioContext', {
  value: class MockAudioContext {
    constructor() {
      return mockAudioContext;
    }
  }
});

describe('AlertingService', () => {
  let alertingService: AlertingService;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Clear intervals
    vi.clearAllTimers();
    vi.useFakeTimers();
    
    // Reset singleton to ensure fresh state
    AlertingService.resetInstance();
    
    // Get fresh instance
    alertingService = AlertingService.getInstance();
  });

  afterEach(() => {
    vi.useRealTimers();
    alertingService.stopMonitoring();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AlertingService.getInstance();
      const instance2 = AlertingService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Custom Alerts', () => {
    it('should add custom alert', () => {
      const alertId = alertingService.addCustomAlert(
        'Test Alert',
        'This is a test message',
        'medium'
      );

      expect(typeof alertId).toBe('string');
      expect(alertId).toContain('custom-');

      const alerts = alertingService.getAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].title).toBe('Test Alert');
      expect(alerts[0].message).toBe('This is a test message');
      expect(alerts[0].severity).toBe('medium');
      expect(alerts[0].acknowledged).toBe(false);
    });

    it('should add custom alert with actions', () => {
      const mockAction = vi.fn();
      const alertId = alertingService.addCustomAlert(
        'Test Alert',
        'Message with actions',
        'high',
        [
          {
            label: 'Test Action',
            action: mockAction,
            color: 'primary'
          }
        ]
      );

      const alerts = alertingService.getAlerts();
      expect(alerts[0].actions).toHaveLength(1);
      expect(alerts[0].actions![0].label).toBe('Test Action');
      expect(alerts[0].actions![0].color).toBe('primary');
      
      // Test action execution
      alerts[0].actions![0].action();
      expect(mockAction).toHaveBeenCalledOnce();
    });

    it('should handle alert without severity (defaults to medium)', () => {
      alertingService.addCustomAlert('Default Severity', 'Test message');
      
      const alerts = alertingService.getAlerts();
      expect(alerts[0].severity).toBe('medium');
    });
  });

  describe('Alert Management', () => {
    beforeEach(() => {
      // Add some test alerts
      alertingService.addCustomAlert('Alert 1', 'First alert', 'low');
      alertingService.addCustomAlert('Alert 2', 'Second alert', 'high');
      alertingService.addCustomAlert('Alert 3', 'Third alert', 'medium');
    });

    it('should acknowledge alert', () => {
      const alerts = alertingService.getAlerts();
      const alertId = alerts[0].id;
      
      expect(alerts[0].acknowledged).toBe(false);
      
      alertingService.acknowledgeAlert(alertId);
      
      const updatedAlerts = alertingService.getAlerts();
      const acknowledgedAlert = updatedAlerts.find(a => a.id === alertId);
      expect(acknowledgedAlert?.acknowledged).toBe(true);
    });

    it('should dismiss alert', () => {
      const alerts = alertingService.getAlerts();
      const alertId = alerts[0].id;
      
      expect(alerts).toHaveLength(3);
      
      alertingService.dismissAlert(alertId);
      
      const updatedAlerts = alertingService.getAlerts();
      expect(updatedAlerts).toHaveLength(2);
      expect(updatedAlerts.find(a => a.id === alertId)).toBeUndefined();
    });

    it('should dismiss all alerts', () => {
      expect(alertingService.getAlerts()).toHaveLength(3);
      
      alertingService.dismissAllAlerts();
      
      expect(alertingService.getAlerts()).toHaveLength(0);
    });

    it('should get unacknowledged alerts only', () => {
      const alerts = alertingService.getAlerts();
      alertingService.acknowledgeAlert(alerts[0].id);
      
      const unacknowledged = alertingService.getUnacknowledgedAlerts();
      expect(unacknowledged).toHaveLength(2);
      expect(unacknowledged.every(a => !a.acknowledged)).toBe(true);
    });

    it('should filter alerts by severity', () => {
      const highSeverityAlerts = alertingService.getAlertsBySeverity('high');
      const lowSeverityAlerts = alertingService.getAlertsBySeverity('low');
      const mediumSeverityAlerts = alertingService.getAlertsBySeverity('medium');
      
      expect(highSeverityAlerts).toHaveLength(1);
      expect(lowSeverityAlerts).toHaveLength(1);
      expect(mediumSeverityAlerts).toHaveLength(1);
      
      expect(highSeverityAlerts[0].severity).toBe('high');
      expect(lowSeverityAlerts[0].severity).toBe('low');
      expect(mediumSeverityAlerts[0].severity).toBe('medium');
    });
  });

  describe('Subscriptions', () => {
    it('should subscribe to alert updates', () => {
      const mockCallback = vi.fn();
      const unsubscribe = alertingService.subscribe(mockCallback);
      
      alertingService.addCustomAlert('Test', 'Message');
      
      expect(mockCallback).toHaveBeenCalledOnce();
      expect(mockCallback).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          title: 'Test',
          message: 'Message'
        })
      ]));
      
      // Test unsubscribe
      unsubscribe();
      alertingService.addCustomAlert('Test 2', 'Message 2');
      expect(mockCallback).toHaveBeenCalledOnce(); // Should not be called again
    });

    it('should handle subscriber errors gracefully', () => {
      const mockCallback = vi.fn().mockImplementation(() => {
        throw new Error('Subscriber error');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      alertingService.subscribe(mockCallback);
      alertingService.addCustomAlert('Test', 'Message');
      
      expect(consoleSpy).toHaveBeenCalledWith('Error notifying alert subscriber:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Settings Management', () => {
    it('should get default settings', () => {
      const settings = alertingService.getSettings();
      
      expect(settings.notificationEnabled).toBe(true);
      expect(settings.soundEnabled).toBe(true);
      expect(settings.emailNotifications).toBe(false);
      expect(settings.checkInterval).toBe(30);
      expect(Array.isArray(settings.thresholds)).toBe(true);
      expect(settings.thresholds.length).toBeGreaterThan(0);
    });

    it('should update settings', () => {
      const newSettings = {
        notificationEnabled: false,
        soundEnabled: false,
        checkInterval: 60
      };
      
      alertingService.updateSettings(newSettings);
      
      const updatedSettings = alertingService.getSettings();
      expect(updatedSettings.notificationEnabled).toBe(false);
      expect(updatedSettings.soundEnabled).toBe(false);
      expect(updatedSettings.checkInterval).toBe(60);
      expect(updatedSettings.emailNotifications).toBe(false); // Should preserve other settings
    });

    it('should save and load settings from localStorage', () => {
      const newSettings = {
        notificationEnabled: false,
        checkInterval: 120
      };
      
      alertingService.updateSettings(newSettings);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'garenne-alert-settings',
        expect.stringContaining('"notificationEnabled":false')
      );
    });
  });

  describe('Monitoring', () => {
    it('should start monitoring when notifications are enabled', () => {
      const checkSpy = vi.spyOn(alertingService, 'checkAllMetrics');
      
      alertingService.updateSettings({ notificationEnabled: true, checkInterval: 1 });
      
      // Fast forward 1 minute
      vi.advanceTimersByTime(60 * 1000);
      
      expect(checkSpy).toHaveBeenCalled();
    });

    it('should stop monitoring', () => {
      alertingService.startMonitoring();
      alertingService.stopMonitoring();
      
      const checkSpy = vi.spyOn(alertingService, 'checkAllMetrics');
      
      // Fast forward should not trigger checks
      vi.advanceTimersByTime(60 * 1000);
      expect(checkSpy).not.toHaveBeenCalled();
    });

    it('should not start monitoring when notifications are disabled', () => {
      alertingService.updateSettings({ notificationEnabled: false });
      
      const checkSpy = vi.spyOn(alertingService, 'checkAllMetrics');
      
      vi.advanceTimersByTime(60 * 1000);
      expect(checkSpy).not.toHaveBeenCalled();
    });
  });

  describe('Predefined Alert Types', () => {
    it('should add health alert', () => {
      alertingService.addHealthAlert('Bunny1', 'Respiratory infection', 'high');
      
      const alerts = alertingService.getAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].title).toBe('Alerte santé');
      expect(alerts[0].message).toBe('Bunny1: Respiratory infection');
      expect(alerts[0].severity).toBe('high');
      expect(alerts[0].actions).toHaveLength(2);
      expect(alerts[0].actions![0].label).toBe('Voir l\'animal');
      expect(alerts[0].actions![1].label).toBe('Ajouter traitement');
    });

    it('should add reproduction alert', () => {
      alertingService.addReproductionAlert('Low fertility rate detected', 'medium', 'animal-123');
      
      const alerts = alertingService.getAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].title).toBe('Alerte reproduction');
      expect(alerts[0].message).toBe('Low fertility rate detected');
      expect(alerts[0].severity).toBe('medium');
      expect(alerts[0].actions).toHaveLength(2);
      expect(alerts[0].actions![0].label).toBe('Voir l\'animal');
      expect(alerts[0].actions![1].label).toBe('Planifier reproduction');
    });

    it('should add reproduction alert without animal ID', () => {
      alertingService.addReproductionAlert('General reproduction issue');
      
      const alerts = alertingService.getAlerts();
      expect(alerts[0].actions).toHaveLength(1);
      expect(alerts[0].actions![0].label).toBe('Planifier reproduction');
    });

    it('should add performance alert', () => {
      alertingService.addPerformanceAlert('Survival Rate', 75, 85);
      
      const alerts = alertingService.getAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].title).toBe('Alerte performance');
      expect(alerts[0].message).toBe('Survival Rate: 75.0 (seuil: 85.0)');
      expect(alerts[0].actions).toHaveLength(2);
      expect(alerts[0].actions![0].label).toBe('Voir statistiques');
      expect(alerts[0].actions![1].label).toBe('Ajuster seuils');
    });
  });

  describe('Sound Notifications', () => {
    it('should play notification sound for high severity alerts', () => {
      const createOscillatorSpy = vi.spyOn(mockAudioContext, 'createOscillator');
      const createGainSpy = vi.spyOn(mockAudioContext, 'createGain');
      
      alertingService.addCustomAlert('High Priority', 'Critical issue', 'high');
      
      expect(createOscillatorSpy).toHaveBeenCalled();
      expect(createGainSpy).toHaveBeenCalled();
    });

    it('should not play sound when disabled', () => {
      alertingService.updateSettings({ soundEnabled: false });
      
      const createOscillatorSpy = vi.spyOn(mockAudioContext, 'createOscillator');
      
      alertingService.addCustomAlert('High Priority', 'Critical issue', 'high');
      
      expect(createOscillatorSpy).not.toHaveBeenCalled();
    });

  });

  describe('Data Persistence', () => {
    it('should save alerts to localStorage', () => {
      alertingService.addCustomAlert('Test Alert', 'Test message');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'garenne-alerts',
        expect.stringContaining('"title":"Test Alert"')
      );
    });

    it('should limit saved alerts to 50', () => {
      // Add 60 alerts
      for (let i = 0; i < 60; i++) {
        alertingService.addCustomAlert(`Alert ${i}`, `Message ${i}`);
      }
      
      const saveCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'garenne-alerts'
      );
      
      expect(saveCall).toBeDefined();
      const savedData = JSON.parse(saveCall![1]);
      expect(savedData.length).toBeLessThanOrEqual(50);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      alertingService.addCustomAlert('Test', 'Message');
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Could not save alerts:', expect.any(Error));
      
      consoleWarnSpy.mockRestore();
    });

    it('should load settings from localStorage on initialization', () => {
      const mockSettings = {
        notificationEnabled: false,
        soundEnabled: false,
        checkInterval: 120,
        thresholds: []
      };
      
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'garenne-alert-settings') {
          return JSON.stringify(mockSettings);
        }
        return null;
      });
      
      // Reset and create new instance to trigger loading
      AlertingService.resetInstance();
      const newService = AlertingService.getInstance();
      const settings = newService.getSettings();
      
      expect(settings.notificationEnabled).toBe(false);
      expect(settings.soundEnabled).toBe(false);
      expect(settings.checkInterval).toBe(120);
    });
  });

  describe('Edge Cases', () => {
    it('should handle acknowledging non-existent alert', () => {
      alertingService.acknowledgeAlert('non-existent-id');
      
      // Should not throw error
      expect(alertingService.getAlerts()).toHaveLength(0);
    });

    it('should handle dismissing non-existent alert', () => {
      alertingService.dismissAlert('non-existent-id');
      
      // Should not throw error
      expect(alertingService.getAlerts()).toHaveLength(0);
    });

    it('should maintain alert order (newest first)', () => {
      alertingService.addCustomAlert('First', 'Message 1');
      alertingService.addCustomAlert('Second', 'Message 2');
      alertingService.addCustomAlert('Third', 'Message 3');
      
      const alerts = alertingService.getAlerts();
      expect(alerts[0].title).toBe('Third');
      expect(alerts[1].title).toBe('Second');
      expect(alerts[2].title).toBe('First');
    });

    it('should limit total alerts to 100', () => {
      // Add 110 alerts
      for (let i = 0; i < 110; i++) {
        alertingService.addCustomAlert(`Alert ${i}`, `Message ${i}`);
      }
      
      const alerts = alertingService.getAlerts();
      expect(alerts.length).toBe(100);
      
      // Should keep the most recent ones
      expect(alerts[0].title).toBe('Alert 109');
      expect(alerts[99].title).toBe('Alert 10');
    });
  });
});