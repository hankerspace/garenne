import { MetricAlert, AlertThreshold, MetricsMonitoringService } from './metrics-monitoring.service';
import { Animal, Litter, WeightRecord, Treatment } from '../models/types';

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  acknowledged: boolean;
  actions?: AlertAction[];
  metadata?: any;
}

export interface AlertAction {
  label: string;
  action: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface AlertSettings {
  thresholds: AlertThreshold[];
  notificationEnabled: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  checkInterval: number; // in minutes
}

export class AlertingService {
  private static instance: AlertingService;
  private alerts: AlertNotification[] = [];
  private settings: AlertSettings;
  private checkInterval: NodeJS.Timeout | null = null;
  private subscribers: Array<(alerts: AlertNotification[]) => void> = [];

  private constructor() {
    this.settings = this.loadSettings();
    this.startMonitoring();
  }

  static getInstance(): AlertingService {
    if (!AlertingService.instance) {
      AlertingService.instance = new AlertingService();
    }
    return AlertingService.instance;
  }

  /**
   * Start automatic alert monitoring
   */
  startMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    if (this.settings.notificationEnabled) {
      this.checkInterval = setInterval(() => {
        this.checkAllMetrics();
      }, this.settings.checkInterval * 60 * 1000);
    }
  }

  /**
   * Stop automatic alert monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check all metrics for alerts
   */
  async checkAllMetrics(): Promise<void> {
    try {
      // Get current data from store (would need to be injected)
      const data = this.getCurrentData();
      if (!data) return;

      const realTimeMetrics = MetricsMonitoringService.calculateRealTimeMetrics(
        data.animals,
        data.litters,
        data.weights,
        data.treatments,
        data.cages
      );

      const metricAlerts = MetricsMonitoringService.checkAlerts(realTimeMetrics, this.settings.thresholds);

      // Convert metric alerts to notifications
      const newAlerts = metricAlerts.map(alert => this.createAlertNotification(alert));

      // Add new alerts and remove duplicates
      this.addAlerts(newAlerts);

    } catch (error) {
      console.error('Error checking metrics for alerts:', error);
    }
  }

  /**
   * Manually trigger alert check
   */
  async triggerManualCheck(
    animals: Animal[],
    litters: Litter[],
    weights: WeightRecord[],
    treatments: Treatment[],
    cages: any[] = []
  ): Promise<AlertNotification[]> {
    const realTimeMetrics = MetricsMonitoringService.calculateRealTimeMetrics(
      animals, litters, weights, treatments, cages
    );

    const metricAlerts = MetricsMonitoringService.checkAlerts(realTimeMetrics, this.settings.thresholds);
    const newAlerts = metricAlerts.map(alert => this.createAlertNotification(alert));

    this.addAlerts(newAlerts);
    return newAlerts;
  }

  /**
   * Add custom alert
   */
  addCustomAlert(
    title: string,
    message: string,
    severity: 'low' | 'medium' | 'high' = 'medium',
    actions?: AlertAction[]
  ): string {
    const alert: AlertNotification = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      severity,
      timestamp: new Date(),
      acknowledged: false,
      actions
    };

    this.alerts.unshift(alert);
    this.notifySubscribers();
    
    if (this.settings.soundEnabled) {
      this.playNotificationSound(severity);
    }

    return alert.id;
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.notifySubscribers();
      this.saveAlerts();
    }
  }

  /**
   * Dismiss alert
   */
  dismissAlert(alertId: string): void {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
    this.notifySubscribers();
    this.saveAlerts();
  }

  /**
   * Dismiss all alerts
   */
  dismissAllAlerts(): void {
    this.alerts = [];
    this.notifySubscribers();
    this.saveAlerts();
  }

  /**
   * Get all alerts
   */
  getAlerts(): AlertNotification[] {
    return [...this.alerts];
  }

  /**
   * Get unacknowledged alerts
   */
  getUnacknowledgedAlerts(): AlertNotification[] {
    return this.alerts.filter(a => !a.acknowledged);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: 'low' | 'medium' | 'high'): AlertNotification[] {
    return this.alerts.filter(a => a.severity === severity);
  }

  /**
   * Subscribe to alert updates
   */
  subscribe(callback: (alerts: AlertNotification[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  /**
   * Update alert settings
   */
  updateSettings(newSettings: Partial<AlertSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    
    // Restart monitoring with new settings
    this.startMonitoring();
  }

  /**
   * Get current settings
   */
  getSettings(): AlertSettings {
    return { ...this.settings };
  }

  /**
   * Add predefined health alerts
   */
  addHealthAlert(animalName: string, condition: string, severity: 'low' | 'medium' | 'high' = 'medium'): void {
    this.addCustomAlert(
      'Alerte santé',
      `${animalName}: ${condition}`,
      severity,
      [
        {
          label: 'Voir l\'animal',
          action: () => {
            // Navigate to animal detail
            console.log(`Navigate to animal: ${animalName}`);
          },
          color: 'primary'
        },
        {
          label: 'Ajouter traitement',
          action: () => {
            // Open treatment modal
            console.log(`Add treatment for: ${animalName}`);
          },
          color: 'secondary'
        }
      ]
    );
  }

  /**
   * Add reproduction alert
   */
  addReproductionAlert(
    message: string,
    severity: 'low' | 'medium' | 'high' = 'medium',
    animalId?: string
  ): void {
    const actions: AlertAction[] = [
      {
        label: 'Planifier reproduction',
        action: () => {
          console.log('Open reproduction planning');
        },
        color: 'primary'
      }
    ];

    if (animalId) {
      actions.unshift({
        label: 'Voir l\'animal',
        action: () => {
          console.log(`Navigate to animal: ${animalId}`);
        },
        color: 'info'
      });
    }

    this.addCustomAlert(
      'Alerte reproduction',
      message,
      severity,
      actions
    );
  }

  /**
   * Add performance alert
   */
  addPerformanceAlert(metricName: string, currentValue: number, threshold: number): void {
    const severity = this.calculatePerformanceSeverity(currentValue, threshold);
    
    this.addCustomAlert(
      'Alerte performance',
      `${metricName}: ${currentValue.toFixed(1)} (seuil: ${threshold.toFixed(1)})`,
      severity,
      [
        {
          label: 'Voir statistiques',
          action: () => {
            console.log('Navigate to statistics');
          },
          color: 'primary'
        },
        {
          label: 'Ajuster seuils',
          action: () => {
            console.log('Open threshold settings');
          },
          color: 'secondary'
        }
      ]
    );
  }

  // Private methods
  private createAlertNotification(metricAlert: MetricAlert): AlertNotification {
    const actions: AlertAction[] = [
      {
        label: 'Voir détails',
        action: () => {
          console.log(`View details for metric: ${metricAlert.metric}`);
        },
        color: 'primary'
      },
      {
        label: 'Ajuster seuil',
        action: () => {
          console.log(`Adjust threshold for metric: ${metricAlert.metric}`);
        },
        color: 'secondary'
      }
    ];

    return {
      id: metricAlert.id,
      title: 'Alerte métrique',
      message: metricAlert.message,
      severity: metricAlert.severity,
      timestamp: metricAlert.timestamp,
      acknowledged: metricAlert.acknowledged,
      actions,
      metadata: {
        metric: metricAlert.metric,
        currentValue: metricAlert.currentValue,
        threshold: metricAlert.threshold
      }
    };
  }

  private addAlerts(newAlerts: AlertNotification[]): void {
    // Check for duplicates (same metric in last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const filteredAlerts = newAlerts.filter(newAlert => {
      return !this.alerts.some(existingAlert => 
        existingAlert.metadata?.metric === newAlert.metadata?.metric &&
        existingAlert.timestamp > oneHourAgo
      );
    });

    if (filteredAlerts.length > 0) {
      this.alerts.unshift(...filteredAlerts);
      
      // Keep only last 100 alerts
      this.alerts = this.alerts.slice(0, 100);
      
      this.notifySubscribers();
      this.saveAlerts();

      // Play notification sound for new high severity alerts
      const highSeverityAlerts = filteredAlerts.filter(a => a.severity === 'high');
      if (highSeverityAlerts.length > 0 && this.settings.soundEnabled) {
        this.playNotificationSound('high');
      }
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback([...this.alerts]);
      } catch (error) {
        console.error('Error notifying alert subscriber:', error);
      }
    });
  }

  private playNotificationSound(severity: 'low' | 'medium' | 'high'): void {
    // Simple audio notification (can be enhanced with actual sound files)
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Different frequencies for different severities
        const frequencies = { low: 400, medium: 600, high: 800 };
        oscillator.frequency.setValueAtTime(frequencies[severity], audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }
  }

  private calculatePerformanceSeverity(
    currentValue: number, 
    threshold: number
  ): 'low' | 'medium' | 'high' {
    const difference = Math.abs(currentValue - threshold);
    const percentageDifference = (difference / threshold) * 100;

    if (percentageDifference > 30) return 'high';
    if (percentageDifference > 15) return 'medium';
    return 'low';
  }

  private getCurrentData(): {
    animals: Animal[];
    litters: Litter[];
    weights: WeightRecord[];
    treatments: Treatment[];
    cages: any[];
  } | null {
    // This would typically get data from the store
    // For now, return null - this would be injected in real implementation
    return null;
  }

  private loadSettings(): AlertSettings {
    try {
      const saved = localStorage.getItem('garenne-alert-settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Could not load alert settings:', error);
    }

    return {
      thresholds: [
        {
          metric: 'survivalRate',
          minValue: 80,
          enabled: true,
          message: 'Taux de survie inférieur à 80%'
        },
        {
          metric: 'reproductionRate',
          minValue: 6,
          enabled: true,
          message: 'Taux de reproduction inférieur à 6 portées/an'
        },
        {
          metric: 'averageWeight',
          changeThreshold: -15,
          enabled: true,
          message: 'Perte de poids moyenne supérieure à 15%'
        }
      ],
      notificationEnabled: true,
      emailNotifications: false,
      soundEnabled: true,
      checkInterval: 30 // 30 minutes
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('garenne-alert-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Could not save alert settings:', error);
    }
  }

  private saveAlerts(): void {
    try {
      // Only save last 50 alerts to localStorage
      const alertsToSave = this.alerts.slice(0, 50);
      localStorage.setItem('garenne-alerts', JSON.stringify(alertsToSave));
    } catch (error) {
      console.warn('Could not save alerts:', error);
    }
  }

  private loadAlerts(): void {
    try {
      const saved = localStorage.getItem('garenne-alerts');
      if (saved) {
        this.alerts = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Could not load alerts:', error);
    }
  }
}