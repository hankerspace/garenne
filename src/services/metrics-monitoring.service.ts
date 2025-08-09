import { Animal, Litter, WeightRecord, Treatment } from '../models/types';
import { StatisticsService } from './statistics.service';
import { differenceInDays, format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export interface MetricChange {
  current: number;
  previous: number;
  change: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PeriodComparison {
  currentPeriod: {
    start: Date;
    end: Date;
    label: string;
  };
  previousPeriod: {
    start: Date;
    end: Date;
    label: string;
  };
  metrics: {
    [key: string]: MetricChange;
  };
}

export interface RealTimeMetrics {
  totalAnimals: MetricChange;
  reproductionRate: MetricChange;
  survivalRate: MetricChange;
  averageWeight: MetricChange;
  treatmentCount: MetricChange;
  consumptionRate: MetricChange;
  lastUpdated: Date;
}

export interface AlertThreshold {
  metric: string;
  minValue?: number;
  maxValue?: number;
  changeThreshold?: number; // Percentage change that triggers alert
  enabled: boolean;
  message: string;
}

export interface MetricAlert {
  id: string;
  metric: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  acknowledged: boolean;
  currentValue: number;
  threshold: number;
}

export class MetricsMonitoringService {
  private static DEFAULT_THRESHOLDS: AlertThreshold[] = [
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
    },
    {
      metric: 'treatmentCount',
      changeThreshold: 50,
      enabled: true,
      message: 'Augmentation des traitements supérieure à 50%'
    }
  ];

  /**
   * Calculate real-time metrics with period comparisons
   */
  static calculateRealTimeMetrics(
    animals: Animal[],
    litters: Litter[],
    weights: WeightRecord[],
    treatments: Treatment[],
    cages: any[] = []
  ): RealTimeMetrics {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    // Current period stats
    const currentStats = StatisticsService.generatePerformanceReport(animals, litters, weights, treatments, cages);
    
    // Previous period data (filter by previous month)
    const previousAnimals = animals.filter(a => {
      const createdDate = new Date(a.birthDate || a.createdAt || now);
      return createdDate <= previousMonthEnd;
    });
    
    const previousLitters = litters.filter(l => {
      const litterDate = new Date(l.kindlingDate);
      return litterDate >= previousMonthStart && litterDate <= previousMonthEnd;
    });
    
    const previousWeights = weights.filter(w => {
      const weightDate = new Date(w.date);
      return weightDate >= previousMonthStart && weightDate <= previousMonthEnd;
    });
    
    const previousTreatments = treatments.filter(t => {
      const treatmentDate = new Date(t.date);
      return treatmentDate >= previousMonthStart && treatmentDate <= previousMonthEnd;
    });

    const previousStats = StatisticsService.generatePerformanceReport(
      previousAnimals, 
      previousLitters, 
      previousWeights, 
      previousTreatments, 
      cages
    );

    return {
      totalAnimals: this.calculateMetricChange(
        currentStats.overview.totalAnimals,
        previousStats.overview.totalAnimals
      ),
      reproductionRate: this.calculateMetricChange(
        currentStats.reproduction.reproductionRate,
        previousStats.reproduction.reproductionRate
      ),
      survivalRate: this.calculateMetricChange(
        currentStats.reproduction.survivalRate,
        previousStats.reproduction.survivalRate
      ),
      averageWeight: this.calculateMetricChange(
        currentStats.overview.averageWeight,
        previousStats.overview.averageWeight
      ),
      treatmentCount: this.calculateMetricChange(
        currentStats.health.totalTreatments,
        previousStats.health.totalTreatments
      ),
      consumptionRate: this.calculateMetricChange(
        currentStats.consumption.totalConsumed,
        previousStats.consumption.totalConsumed
      ),
      lastUpdated: now
    };
  }

  /**
   * Generate period comparison report
   */
  static generatePeriodComparison(
    animals: Animal[],
    litters: Litter[],
    weights: WeightRecord[],
    treatments: Treatment[],
    periodType: 'month' | 'quarter' | 'year' = 'month'
  ): PeriodComparison {
    const now = new Date();
    let currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date;
    let currentLabel: string, previousLabel: string;

    switch (periodType) {
      case 'month':
        currentStart = startOfMonth(now);
        currentEnd = endOfMonth(now);
        previousStart = startOfMonth(subMonths(now, 1));
        previousEnd = endOfMonth(subMonths(now, 1));
        currentLabel = format(now, 'MMMM yyyy');
        previousLabel = format(subMonths(now, 1), 'MMMM yyyy');
        break;
      case 'quarter': {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        currentStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
        currentEnd = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
        previousStart = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
        previousEnd = new Date(now.getFullYear(), currentQuarter * 3, 0);
        currentLabel = `Q${currentQuarter + 1} ${now.getFullYear()}`;
        previousLabel = `Q${currentQuarter} ${now.getFullYear()}`;
        break;
      }
      case 'year':
        currentStart = new Date(now.getFullYear(), 0, 1);
        currentEnd = new Date(now.getFullYear(), 11, 31);
        previousStart = new Date(now.getFullYear() - 1, 0, 1);
        previousEnd = new Date(now.getFullYear() - 1, 11, 31);
        currentLabel = now.getFullYear().toString();
        previousLabel = (now.getFullYear() - 1).toString();
        break;
    }

    // Filter data for current period
    const currentPeriodData = this.filterDataByPeriod(
      animals, litters, weights, treatments, currentStart, currentEnd
    );
    
    // Filter data for previous period
    const previousPeriodData = this.filterDataByPeriod(
      animals, litters, weights, treatments, previousStart, previousEnd
    );

    // Calculate stats for both periods
    const currentStats = StatisticsService.generatePerformanceReport(
      currentPeriodData.animals,
      currentPeriodData.litters,
      currentPeriodData.weights,
      currentPeriodData.treatments,
      []
    );

    const previousStats = StatisticsService.generatePerformanceReport(
      previousPeriodData.animals,
      previousPeriodData.litters,
      previousPeriodData.weights,
      previousPeriodData.treatments,
      []
    );

    // Generate metric comparisons
    const metrics = {
      totalAnimals: this.calculateMetricChange(
        currentStats.overview.totalAnimals,
        previousStats.overview.totalAnimals
      ),
      reproductionRate: this.calculateMetricChange(
        currentStats.reproduction.reproductionRate,
        previousStats.reproduction.reproductionRate
      ),
      survivalRate: this.calculateMetricChange(
        currentStats.reproduction.survivalRate,
        previousStats.reproduction.survivalRate
      ),
      averageWeight: this.calculateMetricChange(
        currentStats.overview.averageWeight,
        previousStats.overview.averageWeight
      ),
      totalLitters: this.calculateMetricChange(
        currentStats.reproduction.totalLitters,
        previousStats.reproduction.totalLitters
      ),
      treatmentCount: this.calculateMetricChange(
        currentStats.health.totalTreatments,
        previousStats.health.totalTreatments
      )
    };

    return {
      currentPeriod: {
        start: currentStart,
        end: currentEnd,
        label: currentLabel
      },
      previousPeriod: {
        start: previousStart,
        end: previousEnd,
        label: previousLabel
      },
      metrics
    };
  }

  /**
   * Check for metric alerts based on thresholds
   */
  static checkAlerts(
    realTimeMetrics: RealTimeMetrics,
    customThresholds: AlertThreshold[] = []
  ): MetricAlert[] {
    const thresholds = [...this.DEFAULT_THRESHOLDS, ...customThresholds];
    const alerts: MetricAlert[] = [];

    thresholds.forEach(threshold => {
      if (!threshold.enabled) return;

      const metricValue = this.getMetricValue(realTimeMetrics, threshold.metric);
      if (metricValue === null) return;

      let isAlert = false;
      let alertValue = metricValue;

      // Check absolute thresholds
      if (threshold.minValue !== undefined && metricValue < threshold.minValue) {
        isAlert = true;
        alertValue = threshold.minValue;
      }
      if (threshold.maxValue !== undefined && metricValue > threshold.maxValue) {
        isAlert = true;
        alertValue = threshold.maxValue;
      }

      // Check change thresholds
      if (threshold.changeThreshold !== undefined) {
        const change = this.getMetricChange(realTimeMetrics, threshold.metric);
        if (change !== null && Math.abs(change) > Math.abs(threshold.changeThreshold)) {
          isAlert = true;
          alertValue = threshold.changeThreshold;
        }
      }

      if (isAlert) {
        alerts.push({
          id: `${threshold.metric}-${Date.now()}`,
          metric: threshold.metric,
          message: threshold.message,
          severity: this.calculateSeverity(metricValue, threshold),
          timestamp: new Date(),
          acknowledged: false,
          currentValue: metricValue,
          threshold: alertValue
        });
      }
    });

    return alerts;
  }

  /**
   * Calculate benchmark comparisons against historical performance
   */
  static calculateBenchmarks(
    animals: Animal[],
    litters: Litter[],
    weights: WeightRecord[],
    treatments: Treatment[]
  ): { [key: string]: { current: number; best: number; average: number; percentile: number } } {
    // Calculate historical performance over last 12 months
    const now = new Date();
    const monthlyStats: any[] = [];

    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));
      
      const monthData = this.filterDataByPeriod(animals, litters, weights, treatments, monthStart, monthEnd);
      const stats = StatisticsService.generatePerformanceReport(
        monthData.animals,
        monthData.litters,
        monthData.weights,
        monthData.treatments,
        []
      );
      
      monthlyStats.push(stats);
    }

    const currentStats = monthlyStats[monthlyStats.length - 1] || StatisticsService.generatePerformanceReport(animals, litters, weights, treatments, []);

    return {
      reproductionRate: this.calculateBenchmark(
        currentStats.reproduction.reproductionRate,
        monthlyStats.map(s => s.reproduction.reproductionRate)
      ),
      survivalRate: this.calculateBenchmark(
        currentStats.reproduction.survivalRate,
        monthlyStats.map(s => s.reproduction.survivalRate)
      ),
      averageWeight: this.calculateBenchmark(
        currentStats.overview.averageWeight,
        monthlyStats.map(s => s.overview.averageWeight)
      )
    };
  }

  // Helper methods
  private static calculateMetricChange(current: number, previous: number): MetricChange {
    const change = current - previous;
    const percentageChange = previous !== 0 ? (change / previous) * 100 : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(percentageChange) > 2) {
      trend = percentageChange > 0 ? 'up' : 'down';
    }

    return {
      current,
      previous,
      change,
      percentageChange,
      trend
    };
  }

  private static filterDataByPeriod(
    animals: Animal[],
    litters: Litter[],
    weights: WeightRecord[],
    treatments: Treatment[],
    start: Date,
    end: Date
  ) {
    return {
      animals: animals.filter(a => {
        const date = new Date(a.birthDate || a.createdAt || new Date());
        return date >= start && date <= end;
      }),
      litters: litters.filter(l => {
        const date = new Date(l.kindlingDate);
        return date >= start && date <= end;
      }),
      weights: weights.filter(w => {
        const date = new Date(w.date);
        return date >= start && date <= end;
      }),
      treatments: treatments.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      })
    };
  }

  private static getMetricValue(metrics: RealTimeMetrics, metricName: string): number | null {
    const metricMap: { [key: string]: keyof RealTimeMetrics } = {
      totalAnimals: 'totalAnimals',
      reproductionRate: 'reproductionRate', 
      survivalRate: 'survivalRate',
      averageWeight: 'averageWeight',
      treatmentCount: 'treatmentCount',
      consumptionRate: 'consumptionRate'
    };

    const key = metricMap[metricName];
    if (!key || !metrics[key]) return null;
    
    return (metrics[key] as MetricChange).current;
  }

  private static getMetricChange(metrics: RealTimeMetrics, metricName: string): number | null {
    const metricMap: { [key: string]: keyof RealTimeMetrics } = {
      totalAnimals: 'totalAnimals',
      reproductionRate: 'reproductionRate',
      survivalRate: 'survivalRate', 
      averageWeight: 'averageWeight',
      treatmentCount: 'treatmentCount',
      consumptionRate: 'consumptionRate'
    };

    const key = metricMap[metricName];
    if (!key || !metrics[key]) return null;
    
    return (metrics[key] as MetricChange).percentageChange;
  }

  private static calculateSeverity(value: number, threshold: AlertThreshold): 'low' | 'medium' | 'high' {
    if (threshold.minValue !== undefined) {
      const diff = threshold.minValue - value;
      const percentage = (diff / threshold.minValue) * 100;
      if (percentage > 20) return 'high';
      if (percentage > 10) return 'medium';
      return 'low';
    }
    
    if (threshold.maxValue !== undefined) {
      const diff = value - threshold.maxValue;
      const percentage = (diff / threshold.maxValue) * 100;
      if (percentage > 20) return 'high';
      if (percentage > 10) return 'medium';
      return 'low';
    }

    return 'medium';
  }

  private static calculateBenchmark(
    current: number,
    historical: number[]
  ): { current: number; best: number; average: number; percentile: number } {
    const validValues = historical.filter(v => v > 0);
    if (validValues.length === 0) {
      return { current, best: current, average: current, percentile: 50 };
    }

    const best = Math.max(...validValues);
    const average = validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
    
    // Calculate percentile rank
    const sorted = [...validValues].sort((a, b) => a - b);
    const rank = sorted.findIndex(v => v >= current);
    const percentile = rank >= 0 ? (rank / sorted.length) * 100 : 0;

    return {
      current,
      best,
      average,
      percentile
    };
  }
}