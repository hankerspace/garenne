import { describe, it, expect, beforeEach } from 'vitest';
import { PerformanceReportService } from '../services/performance-report.service';
import { Animal, Litter, WeightRecord, Treatment, Status, Sex, Route } from '../models/types';

describe('PerformanceReportService', () => {
  let animals: Animal[];
  let litters: Litter[];
  let weights: WeightRecord[];
  let treatments: Treatment[];

  beforeEach(() => {
    // Create sample animals
    animals = [
      {
        id: 'animal-1',
        name: 'Bella',
        sex: Sex.Female,
        status: Status.Reproducer,
        birthDate: '2023-01-15',
        breed: 'New Zealand White',
        cage: 'A1',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 'animal-2',
        name: 'Max',
        sex: Sex.Male,
        status: Status.Reproducer,
        birthDate: '2023-02-01',
        breed: 'New Zealand White',
        cage: 'A2',
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 'animal-3',
        name: 'Junior',
        sex: Sex.Male,
        status: Status.Grow,
        birthDate: '2024-01-01', // This year
        breed: 'New Zealand White',
        cage: 'B1',
        motherId: 'animal-1',
        fatherId: 'animal-2',
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      }
    ];

    // Create sample litters
    litters = [
      {
        id: 'litter-1',
        motherId: 'animal-1',
        fatherId: 'animal-2',
        kindlingDate: '2024-06-01',
        bornAlive: 8,
        stillborn: 0,
        createdAt: '2024-05-01T00:00:00Z',
        updatedAt: '2024-06-01T00:00:00Z'
      },
      {
        id: 'litter-2',
        motherId: 'animal-1',
        fatherId: 'animal-2',
        kindlingDate: '2024-04-01',
        bornAlive: 7,
        stillborn: 0,
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-04-01T00:00:00Z'
      }
    ];

    // Create sample weight records
    weights = [
      // Bella (female reproducer) weights
      { id: 'w1', animalId: 'animal-1', weightGrams: 3000, date: '2024-01-01', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
      { id: 'w2', animalId: 'animal-1', weightGrams: 3200, date: '2024-06-01', createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
      { id: 'w3', animalId: 'animal-1', weightGrams: 3400, date: '2024-09-01', createdAt: '2024-09-01T00:00:00Z', updatedAt: '2024-09-01T00:00:00Z' },
      
      // Max (male reproducer) weights
      { id: 'w4', animalId: 'animal-2', weightGrams: 3500, date: '2023-06-01', createdAt: '2023-06-01T00:00:00Z', updatedAt: '2023-06-01T00:00:00Z' },
      { id: 'w5', animalId: 'animal-2', weightGrams: 3700, date: '2023-12-01', createdAt: '2023-12-01T00:00:00Z', updatedAt: '2023-12-01T00:00:00Z' },
      { id: 'w6', animalId: 'animal-2', weightGrams: 3800, date: '2024-06-01', createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
      
      // Junior (growing animal) weights
      { id: 'w7', animalId: 'animal-3', weightGrams: 100, date: '2024-08-01', createdAt: '2024-08-01T00:00:00Z', updatedAt: '2024-08-01T00:00:00Z' },
      { id: 'w8', animalId: 'animal-3', weightGrams: 700, date: '2024-08-15', createdAt: '2024-08-15T00:00:00Z', updatedAt: '2024-08-15T00:00:00Z' },
      { id: 'w9', animalId: 'animal-3', weightGrams: 1400, date: '2024-09-01', createdAt: '2024-09-01T00:00:00Z', updatedAt: '2024-09-01T00:00:00Z' },
      { id: 'w10', animalId: 'animal-3', weightGrams: 2000, date: '2024-09-15', createdAt: '2024-09-15T00:00:00Z', updatedAt: '2024-09-15T00:00:00Z' }
    ];

    // Create sample treatments
    treatments = [
      {
        id: 't1',
        animalId: 'animal-1',
        date: '2024-01-15',
        product: 'Antibiotics',
        dose: '5ml',
        route: Route.IM,
        withdrawalUntil: '2024-01-29', // 14 days from treatment date
        notes: 'Respiratory infection treatment',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 't2',
        animalId: 'animal-3',
        date: '2024-08-15',
        product: 'Vitamins',
        dose: '2ml',
        route: Route.Oral,
        notes: 'Growth supplement',
        createdAt: '2024-08-15T00:00:00Z',
        updatedAt: '2024-08-15T00:00:00Z'
      }
    ];
  });

  describe('generateIndividualReport', () => {
    it('should generate a complete report for a female reproducer', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0], // Bella
        animals,
        litters,
        weights,
        treatments
      );

      expect(report.animal.id).toBe('animal-1');
      expect(report.basicInfo.age).toBeGreaterThan(300); // Over 300 days old
      expect(report.basicInfo.ageDescription).toContain('year');
      
      // Should have reproduction performance
      expect(report.reproductionPerformance).toBeDefined();
      expect(report.reproductionPerformance!.totalLitters).toBe(2);
      expect(report.reproductionPerformance!.totalOffspring).toBe(15);
      expect(report.reproductionPerformance!.averageLitterSize).toBe(7.5);

      // Should not have growth performance (not growing)
      expect(report.growthPerformance).toBeUndefined();

      // Should have health status
      expect(report.healthStatus).toBeDefined();
      expect(report.healthStatus.totalTreatments).toBe(1);

      // Should have overall performance
      expect(report.performance).toBeDefined();
      expect(report.performance.overallScore).toBeGreaterThan(0);
      expect(report.performance.ranking).toBeDefined();
    });

    it('should generate a complete report for a growing animal', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[2], // Junior
        animals,
        litters,
        weights,
        treatments
      );

      expect(report.animal.id).toBe('animal-3');
      expect(report.basicInfo.age).toBeGreaterThan(0); // Has valid age
      
      // Should not have reproduction performance (growing animal)
      expect(report.reproductionPerformance).toBeUndefined();

      // Should have growth performance
      expect(report.growthPerformance).toBeDefined();
      expect(report.growthPerformance!.currentWeight).toBe(2000);
      expect(report.growthPerformance!.weightGain).toBe(1900); // 2000 - 100
      expect(report.growthPerformance!.dailyWeightGain).toBeGreaterThan(0);
      expect(report.growthPerformance!.growthRate).toBeDefined();

      // Should have health status
      expect(report.healthStatus).toBeDefined();
      expect(report.healthStatus.totalTreatments).toBe(1);
    });

    it('should calculate correct basic info', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        litters,
        weights,
        treatments
      );

      expect(report.basicInfo.breed).toBe('New Zealand White');
      expect(report.basicInfo.cage).toBe('A1');
      expect(report.basicInfo.status).toBe(Status.Reproducer);
      expect(report.basicInfo.ageDescription).toMatch(/year/);
    });

    it('should calculate reproduction performance correctly', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0], // Bella - female with litters
        animals,
        litters,
        weights,
        treatments
      );

      const repro = report.reproductionPerformance!;
      expect(repro.totalLitters).toBe(2);
      expect(repro.totalOffspring).toBe(15);
      expect(repro.averageLitterSize).toBe(7.5);
      expect(repro.reproductionEfficiency).toBeGreaterThan(0);
      expect(repro.pregnancySuccess).toBeGreaterThan(0);
    });

    it('should calculate growth performance correctly', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[2], // Junior - growing animal
        animals,
        litters,
        weights,
        treatments
      );

      const growth = report.growthPerformance!;
      expect(growth.currentWeight).toBe(2000);
      expect(growth.weightGain).toBe(1900);
      expect(growth.dailyWeightGain).toBeGreaterThan(30); // Excellent growth rate
      expect(growth.growthRate).toBe('excellent');
      expect(growth.targetWeight).toBe(2500);
      expect(growth.daysToTarget).toBeGreaterThan(0);
    });

    it('should calculate health status correctly', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0], // Bella with one treatment
        animals,
        litters,
        weights,
        treatments
      );

      const health = report.healthStatus;
      expect(health.totalTreatments).toBe(1);
      expect(health.recentTreatments).toBe(0); // Treatment was not recent
      expect(health.withdrawalStatus).toBe('none'); // Withdrawal period expired
      expect(health.healthScore).toBeLessThan(100); // Reduced due to treatment
      expect(health.healthScore).toBeGreaterThan(70); // But still good
    });

    it('should calculate overall performance score', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        litters,
        weights,
        treatments
      );

      const performance = report.performance;
      expect(performance.overallScore).toBeGreaterThan(0);
      expect(performance.overallScore).toBeLessThanOrEqual(100);
      expect(['excellent', 'good', 'average', 'needs_improvement']).toContain(performance.ranking);
      expect(Array.isArray(performance.strengths)).toBe(true);
      expect(Array.isArray(performance.recommendations)).toBe(true);
    });

    it('should include trends when requested', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        litters,
        weights,
        treatments,
        { includeTrends: true }
      );

      expect(report.trends).toBeDefined();
      expect(Array.isArray(report.trends.weightTrend)).toBe(true);
      expect(report.trends.weightTrend.length).toBeGreaterThan(0);
      
      // Female should have reproduction trend
      expect(report.trends.reproductionTrend).toBeDefined();
      expect(Array.isArray(report.trends.reproductionTrend)).toBe(true);
    });

    it('should include comparisons when requested', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        litters,
        weights,
        treatments,
        { includeComparisons: true }
      );

      expect(report.comparisons).toBeDefined();
      expect(report.comparisons.comparedToAverage).toBeDefined();
      expect(typeof report.comparisons.comparedToAverage.weight).toBe('number');
      
      expect(report.comparisons.comparedToPeers).toBeDefined();
      expect(report.comparisons.comparedToPeers.rank).toBeGreaterThan(0);
      expect(report.comparisons.comparedToPeers.totalPeers).toBeGreaterThan(0);
      expect(report.comparisons.comparedToPeers.percentile).toBeGreaterThanOrEqual(0);
      expect(report.comparisons.comparedToPeers.percentile).toBeLessThanOrEqual(100);
    });

    it('should handle animals with no weight records', () => {
      const animalWithoutWeights = {
        ...animals[0],
        id: 'animal-no-weights'
      };

      const report = PerformanceReportService.generateIndividualReport(
        animalWithoutWeights,
        animals,
        litters,
        [], // No weights
        treatments
      );

      expect(report).toBeDefined();
      expect(report.basicInfo).toBeDefined();
      expect(report.performance.overallScore).toBeGreaterThan(0);
    });

    it('should handle animals with no treatments', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        litters,
        weights,
        [] // No treatments
      );

      expect(report.healthStatus.totalTreatments).toBe(0);
      expect(report.healthStatus.recentTreatments).toBe(0);
      expect(report.healthStatus.withdrawalStatus).toBe('none');
      expect(report.healthStatus.healthScore).toBe(100);
    });

    it('should handle male animals without reproduction data', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[1], // Max - male
        animals,
        litters,
        weights,
        treatments
      );

      // Male reproducer should still get reproduction performance since he's a reproducer
      expect(report.reproductionPerformance).toBeDefined();
      expect(report.reproductionPerformance!.totalLitters).toBe(2); // He's the father
    });
  });

  describe('generateBatchReports', () => {
    it('should generate reports for multiple animals', () => {
      const reports = PerformanceReportService.generateBatchReports(
        animals,
        litters,
        weights,
        treatments
      );

      expect(reports).toHaveLength(3);
      expect(reports[0].animal.id).toBe('animal-1');
      expect(reports[1].animal.id).toBe('animal-2');
      expect(reports[2].animal.id).toBe('animal-3');

      // Each report should be complete
      reports.forEach(report => {
        expect(report.basicInfo).toBeDefined();
        expect(report.healthStatus).toBeDefined();
        expect(report.performance).toBeDefined();
      });
    });

    it('should handle empty animal list', () => {
      const reports = PerformanceReportService.generateBatchReports(
        [],
        litters,
        weights,
        treatments
      );

      expect(reports).toHaveLength(0);
    });
  });

  describe('exportToPDF', () => {
    it('should export report to PDF format', async () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        litters,
        weights,
        treatments
      );

      const pdfBlob = await PerformanceReportService.exportToPDF(report);
      
      expect(pdfBlob).toBeInstanceOf(Blob);
      expect(pdfBlob.type).toBe('text/plain'); // Placeholder implementation
      expect(pdfBlob.size).toBeGreaterThan(0);
    });
  });

  describe('formatReportAsText', () => {
    it('should format report as readable text', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        litters,
        weights,
        treatments
      );

      const text = PerformanceReportService.formatReportAsText(report);
      
      expect(text).toContain('PERFORMANCE REPORT');
      expect(text).toContain(animals[0].name!);
      expect(text).toContain('BASIC INFORMATION');
      expect(text).toContain('REPRODUCTION PERFORMANCE');
      expect(text).toContain('HEALTH STATUS');
      expect(text).toContain('OVERALL PERFORMANCE');
      expect(text).toContain(report.performance.ranking);
    });

    it('should include growth performance section for growing animals', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[2], // Junior - growing animal
        animals,
        litters,
        weights,
        treatments
      );

      const text = PerformanceReportService.formatReportAsText(report);
      
      expect(text).toContain('GROWTH PERFORMANCE');
      expect(text).toContain('Current Weight:');
      expect(text).toContain('Daily Weight Gain:');
      expect(text).toContain('Growth Rate:');
    });

    it('should handle animals without names', () => {
      const animalWithoutName = { ...animals[0] };
      delete animalWithoutName.name;

      const report = PerformanceReportService.generateIndividualReport(
        animalWithoutName,
        animals,
        litters,
        weights,
        treatments
      );

      const text = PerformanceReportService.formatReportAsText(report);
      
      expect(text).toContain(animalWithoutName.id);
      expect(text).toContain('Name: N/A');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle animals with birth date in the future', () => {
      const futureAnimal = {
        ...animals[0],
        birthDate: '2025-12-31'
      };

      const report = PerformanceReportService.generateIndividualReport(
        futureAnimal,
        animals,
        litters,
        weights,
        treatments
      );

      expect(report.basicInfo.age).toBeLessThan(0);
      expect(report.basicInfo.ageDescription).toContain('Unknown age');
    });

    it('should handle animals without birth date', () => {
      const animalWithoutBirthDate = { ...animals[0] };
      delete animalWithoutBirthDate.birthDate;

      const report = PerformanceReportService.generateIndividualReport(
        animalWithoutBirthDate,
        animals,
        litters,
        weights,
        treatments
      );

      expect(report.basicInfo.age).toBe(0);
      expect(report.basicInfo.ageDescription).toBe('Unknown age');
    });

    it('should handle litters without kindling data', () => {
      const littersWithoutKindling = litters.map(l => ({
        ...l,
        kindlingDate: '' as string, // Empty string instead of undefined to maintain type
        bornAlive: 0
      }));

      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        littersWithoutKindling,
        weights,
        treatments
      );

      expect(report.reproductionPerformance!.totalOffspring).toBe(0);
      expect(report.reproductionPerformance!.averageLitterSize).toBe(0);
    });

    it('should handle weight records with invalid dates', () => {
      const invalidWeights = [
        { ...weights[0], date: 'invalid-date' }
      ];

      expect(() => {
        PerformanceReportService.generateIndividualReport(
          animals[0],
          animals,
          litters,
          invalidWeights,
          treatments
        );
      }).not.toThrow();
    });

    it('should calculate correct percentiles for single animal', () => {
      const singleAnimal = [animals[0]];
      
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        singleAnimal,
        litters,
        weights,
        treatments,
        { includeComparisons: true }
      );

      expect(report.comparisons.comparedToPeers.rank).toBe(1);
      expect(report.comparisons.comparedToPeers.totalPeers).toBe(1);
      expect(report.comparisons.comparedToPeers.percentile).toBe(0);
    });

    it('should handle options parameter with partial values', () => {
      const report = PerformanceReportService.generateIndividualReport(
        animals[0],
        animals,
        litters,
        weights,
        treatments,
        { includeTrends: false } // Only specify one option
      );

      expect(report.trends.weightTrend).toHaveLength(0);
      expect(report.comparisons).toBeDefined(); // Should still include comparisons (default true)
    });
  });
});