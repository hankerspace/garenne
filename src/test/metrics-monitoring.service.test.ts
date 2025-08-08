import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetricsMonitoringService, MetricChange, PeriodComparison } from '../services/metrics-monitoring.service';
import { Animal, Litter, WeightRecord, Treatment, Status, Sex } from '../models/types';

// Mock date-fns functions
vi.mock('date-fns', () => ({
  differenceInDays: vi.fn((end, start) => {
    const endTime = new Date(end).getTime();
    const startTime = new Date(start).getTime();
    return Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
  }),
  addDays: vi.fn((date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }),
  format: vi.fn((date, formatStr) => {
    if (formatStr === 'MMMM yyyy') return 'January 2024';
    if (formatStr === 'MMM yyyy') return 'Jan 2024';
    return '2024-01-01';
  }),
  subMonths: vi.fn((date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
  }),
  startOfMonth: vi.fn((date) => {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
  }),
  endOfMonth: vi.fn((date) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1, 0);
    result.setHours(23, 59, 59, 999);
    return result;
  })
}));

describe('MetricsMonitoringService', () => {
  let mockAnimals: Animal[];
  let mockLitters: Litter[];
  let mockWeights: WeightRecord[];
  let mockTreatments: Treatment[];

  beforeEach(() => {
    // Create mock data
    mockAnimals = [
      {
        id: '1',
        name: 'Bunny1',
        sex: Sex.Female,
        status: Status.Reproducer,
        birthDate: '2023-01-01',
        identifier: 'B001',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Bunny2',
        sex: Sex.Male,
        status: Status.Reproducer,
        birthDate: '2023-02-01',
        identifier: 'B002',
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2023-02-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'Bunny3',
        sex: Sex.Female,
        status: Status.Grow,
        birthDate: '2023-06-01',
        identifier: 'B003',
        createdAt: '2023-06-01T00:00:00Z',
        updatedAt: '2023-06-01T00:00:00Z'
      }
    ];

    mockLitters = [
      {
        id: '1',
        motherId: '1',
        fatherId: '2',
        kindlingDate: '2023-07-01',
        bornAlive: 6,
        stillborn: 1,
        weanedCount: 5,
        createdAt: '2023-07-01T00:00:00Z',
        updatedAt: '2023-07-01T00:00:00Z'
      },
      {
        id: '2',
        motherId: '1',
        fatherId: '2',
        kindlingDate: '2023-10-01',
        bornAlive: 8,
        stillborn: 0,
        weanedCount: 7,
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2023-10-01T00:00:00Z'
      }
    ];

    mockWeights = [
      {
        id: '1',
        animalId: '1',
        date: '2023-07-01',
        weightGrams: 2500,
        createdAt: '2023-07-01T00:00:00Z',
        updatedAt: '2023-07-01T00:00:00Z'
      },
      {
        id: '2',
        animalId: '1',
        date: '2023-08-01',
        weightGrams: 2600,
        createdAt: '2023-08-01T00:00:00Z',
        updatedAt: '2023-08-01T00:00:00Z'
      },
      {
        id: '3',
        animalId: '3',
        date: '2023-06-15',
        weightGrams: 500,
        createdAt: '2023-06-15T00:00:00Z',
        updatedAt: '2023-06-15T00:00:00Z'
      },
      {
        id: '4',
        animalId: '3',
        date: '2023-07-15',
        weightGrams: 800,
        createdAt: '2023-07-15T00:00:00Z',
        updatedAt: '2023-07-15T00:00:00Z'
      }
    ];

    mockTreatments = [
      {
        id: '1',
        animalId: '1',
        date: '2023-07-15',
        product: 'Antibiotic',
        dose: '1ml',
        withdrawalUntil: '2023-07-29', // 14 days later
        createdAt: '2023-07-15T00:00:00Z',
        updatedAt: '2023-07-15T00:00:00Z'
      },
      {
        id: '2',
        animalId: '2',
        date: '2023-08-01',
        product: 'Vitamin',
        dose: '0.5ml',
        // No withdrawal period for vitamins
        createdAt: '2023-08-01T00:00:00Z',
        updatedAt: '2023-08-01T00:00:00Z'
      }
    ];
  });

  describe('calculateRealTimeMetrics', () => {
    it('should calculate real-time metrics with period comparisons', () => {
      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        []
      );

      expect(metrics).toBeDefined();
      expect(metrics.totalAnimals).toBeDefined();
      expect(metrics.reproductionRate).toBeDefined();
      expect(metrics.survivalRate).toBeDefined();
      expect(metrics.averageWeight).toBeDefined();
      expect(metrics.treatmentCount).toBeDefined();
      expect(metrics.consumptionRate).toBeDefined();
      expect(metrics.lastUpdated).toBeInstanceOf(Date);
    });

    it('should calculate metric changes correctly', () => {
      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        []
      );

      // Each metric should have current, previous, change, percentageChange, and trend
      const checkMetricChange = (metricChange: MetricChange) => {
        expect(typeof metricChange.current).toBe('number');
        expect(typeof metricChange.previous).toBe('number');
        expect(typeof metricChange.change).toBe('number');
        expect(typeof metricChange.percentageChange).toBe('number');
        expect(['up', 'down', 'stable']).toContain(metricChange.trend);
      };

      checkMetricChange(metrics.totalAnimals);
      checkMetricChange(metrics.reproductionRate);
      checkMetricChange(metrics.survivalRate);
      checkMetricChange(metrics.averageWeight);
      checkMetricChange(metrics.treatmentCount);
      checkMetricChange(metrics.consumptionRate);
    });

    it('should handle empty data gracefully', () => {
      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        [],
        [],
        [],
        [],
        []
      );

      expect(metrics.totalAnimals.current).toBe(0);
      expect(metrics.reproductionRate.current).toBe(0);
      expect(metrics.survivalRate.current).toBe(0);
      expect(metrics.averageWeight.current).toBe(0);
      expect(metrics.treatmentCount.current).toBe(0);
      expect(metrics.consumptionRate.current).toBe(0);
    });
  });

  describe('generatePeriodComparison', () => {
    it('should generate monthly period comparison', () => {
      const comparison = MetricsMonitoringService.generatePeriodComparison(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        'month'
      );

      expect(comparison).toBeDefined();
      expect(comparison.currentPeriod).toBeDefined();
      expect(comparison.previousPeriod).toBeDefined();
      expect(comparison.metrics).toBeDefined();
      
      expect(comparison.currentPeriod.start).toBeInstanceOf(Date);
      expect(comparison.currentPeriod.end).toBeInstanceOf(Date);
      expect(typeof comparison.currentPeriod.label).toBe('string');
      
      expect(comparison.previousPeriod.start).toBeInstanceOf(Date);
      expect(comparison.previousPeriod.end).toBeInstanceOf(Date);
      expect(typeof comparison.previousPeriod.label).toBe('string');
    });

    it('should generate quarterly period comparison', () => {
      const comparison = MetricsMonitoringService.generatePeriodComparison(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        'quarter'
      );

      expect(comparison.currentPeriod.label).toContain('Q');
      expect(comparison.previousPeriod.label).toContain('Q');
    });

    it('should generate yearly period comparison', () => {
      const comparison = MetricsMonitoringService.generatePeriodComparison(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        'year'
      );

      expect(comparison.currentPeriod.label).toMatch(/^\d{4}$/);
      expect(comparison.previousPeriod.label).toMatch(/^\d{4}$/);
    });

    it('should include all expected metrics in comparison', () => {
      const comparison = MetricsMonitoringService.generatePeriodComparison(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        'month'
      );

      const expectedMetrics = [
        'totalAnimals',
        'reproductionRate',
        'survivalRate',
        'averageWeight',
        'totalLitters',
        'treatmentCount'
      ];

      expectedMetrics.forEach(metric => {
        expect(comparison.metrics[metric]).toBeDefined();
        expect(typeof comparison.metrics[metric].current).toBe('number');
        expect(typeof comparison.metrics[metric].previous).toBe('number');
        expect(typeof comparison.metrics[metric].change).toBe('number');
        expect(typeof comparison.metrics[metric].percentageChange).toBe('number');
        expect(['up', 'down', 'stable']).toContain(comparison.metrics[metric].trend);
      });
    });
  });

  describe('checkAlerts', () => {
    it('should check alerts against default thresholds', () => {
      const realTimeMetrics = MetricsMonitoringService.calculateRealTimeMetrics(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        []
      );

      const alerts = MetricsMonitoringService.checkAlerts(realTimeMetrics);
      
      expect(Array.isArray(alerts)).toBe(true);
      alerts.forEach(alert => {
        expect(typeof alert.id).toBe('string');
        expect(typeof alert.metric).toBe('string');
        expect(typeof alert.message).toBe('string');
        expect(['low', 'medium', 'high']).toContain(alert.severity);
        expect(alert.timestamp).toBeInstanceOf(Date);
        expect(typeof alert.acknowledged).toBe('boolean');
        expect(typeof alert.currentValue).toBe('number');
        expect(typeof alert.threshold).toBe('number');
      });
    });

    it('should use custom thresholds when provided', () => {
      const realTimeMetrics = MetricsMonitoringService.calculateRealTimeMetrics(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        []
      );

      const customThresholds = [
        {
          metric: 'totalAnimals',
          minValue: 100,
          enabled: true,
          message: 'Too few animals'
        }
      ];

      const alerts = MetricsMonitoringService.checkAlerts(realTimeMetrics, customThresholds);
      
      // Should potentially generate an alert for total animals being below 100
      const totalAnimalsAlert = alerts.find(a => a.metric === 'totalAnimals');
      if (realTimeMetrics.totalAnimals.current < 100) {
        expect(totalAnimalsAlert).toBeDefined();
        expect(totalAnimalsAlert?.message).toBe('Too few animals');
      }
    });

    it('should not generate alerts for disabled thresholds', () => {
      const realTimeMetrics = MetricsMonitoringService.calculateRealTimeMetrics(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        []
      );

      const disabledThresholds = [
        {
          metric: 'totalAnimals',
          minValue: 1000, // Very high threshold
          enabled: false, // But disabled
          message: 'Should not trigger'
        }
      ];

      const alerts = MetricsMonitoringService.checkAlerts(realTimeMetrics, disabledThresholds);
      
      // Should not find any alerts with the disabled threshold message
      const disabledAlert = alerts.find(a => a.message === 'Should not trigger');
      expect(disabledAlert).toBeUndefined();
    });
  });

  describe('calculateBenchmarks', () => {
    it('should calculate benchmarks against historical performance', () => {
      const benchmarks = MetricsMonitoringService.calculateBenchmarks(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments
      );

      expect(benchmarks).toBeDefined();
      expect(benchmarks.reproductionRate).toBeDefined();
      expect(benchmarks.survivalRate).toBeDefined();
      expect(benchmarks.averageWeight).toBeDefined();

      // Check structure of each benchmark
      const checkBenchmark = (benchmark: any) => {
        expect(typeof benchmark.current).toBe('number');
        expect(typeof benchmark.best).toBe('number');
        expect(typeof benchmark.average).toBe('number');
        expect(typeof benchmark.percentile).toBe('number');
        expect(benchmark.percentile).toBeGreaterThanOrEqual(0);
        expect(benchmark.percentile).toBeLessThanOrEqual(100);
      };

      checkBenchmark(benchmarks.reproductionRate);
      checkBenchmark(benchmarks.survivalRate);
      checkBenchmark(benchmarks.averageWeight);
    });

    it('should handle empty historical data', () => {
      const benchmarks = MetricsMonitoringService.calculateBenchmarks(
        [],
        [],
        [],
        []
      );

      expect(benchmarks.reproductionRate.current).toBe(0);
      expect(benchmarks.reproductionRate.best).toBe(0);
      expect(benchmarks.reproductionRate.average).toBe(0);
      expect(benchmarks.reproductionRate.percentile).toBe(50);
    });
  });

  describe('private helper methods', () => {
    it('should calculate metric change correctly', () => {
      // Test via the public method that uses the private helper
      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        []
      );

      const totalAnimalsChange = metrics.totalAnimals;
      
      // Verify the calculation logic
      expect(totalAnimalsChange.change).toBe(totalAnimalsChange.current - totalAnimalsChange.previous);
      
      if (totalAnimalsChange.previous !== 0) {
        const expectedPercentage = (totalAnimalsChange.change / totalAnimalsChange.previous) * 100;
        expect(Math.abs(totalAnimalsChange.percentageChange - expectedPercentage)).toBeLessThan(0.01);
      }

      // Verify trend logic
      if (Math.abs(totalAnimalsChange.percentageChange) <= 2) {
        expect(totalAnimalsChange.trend).toBe('stable');
      } else if (totalAnimalsChange.percentageChange > 0) {
        expect(totalAnimalsChange.trend).toBe('up');
      } else {
        expect(totalAnimalsChange.trend).toBe('down');
      }
    });

    it('should filter data by period correctly', () => {
      const comparison = MetricsMonitoringService.generatePeriodComparison(
        mockAnimals,
        mockLitters,
        mockWeights,
        mockTreatments,
        'month'
      );

      // The comparison should have different periods
      expect(comparison.currentPeriod.start).not.toEqual(comparison.previousPeriod.start);
      expect(comparison.currentPeriod.end).not.toEqual(comparison.previousPeriod.end);
      
      // Current period should be more recent than previous
      expect(comparison.currentPeriod.start.getTime()).toBeGreaterThan(comparison.previousPeriod.start.getTime());
    });
  });

  describe('edge cases', () => {
    it('should handle animals with missing dates', () => {
      const animalsWithMissingDates = [
        {
          id: '1',
          name: 'Bunny1',
          sex: Sex.Female,
          status: Status.Reproducer,
          // No birthDate
          identifier: 'B001',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ];

      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        animalsWithMissingDates,
        [],
        [],
        [],
        []
      );

      expect(metrics.totalAnimals.current).toBe(1);
    });

    it('should handle zero division in percentage calculations', () => {
      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        [],
        [],
        [],
        [],
        []
      );

      // When previous is 0, percentage change should be 0
      expect(metrics.totalAnimals.percentageChange).toBe(0);
      expect(metrics.totalAnimals.trend).toBe('stable');
    });

    it('should handle large datasets efficiently', () => {
      // Create a large dataset
      const largeAnimals = Array.from({ length: 1000 }, (_, i) => ({
        id: `animal-${i}`,
        name: `Bunny${i}`,
        sex: i % 2 === 0 ? Sex.Female : Sex.Male,
        status: Status.Grow,
        birthDate: `2023-${(i % 12) + 1}-01`,
        identifier: `B${i.toString().padStart(3, '0')}`,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }));

      const start = performance.now();
      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        largeAnimals,
        [],
        [],
        [],
        []
      );
      const end = performance.now();

      expect(metrics.totalAnimals.current).toBe(1000);
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });
  });
});