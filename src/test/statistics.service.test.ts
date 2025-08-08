import { describe, it, expect, beforeEach } from 'vitest';
import { StatisticsService, StatisticsOverview, ReproductionStats, GrowthStats, ConsumptionStats, HealthStats } from '../services/statistics.service';
import { Animal, Litter, WeightRecord, Treatment, Status, Sex, Route } from '../models/types';

describe('StatisticsService', () => {
  let sampleAnimals: Animal[];
  let sampleLitters: Litter[];
  let sampleWeights: WeightRecord[];
  let sampleTreatments: Treatment[];
  let sampleCages: any[];

  beforeEach(() => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    sampleAnimals = [
      {
        id: 'animal-1',
        name: 'Fluffy',
        sex: Sex.Female,
        birthDate: monthAgo.toISOString().split('T')[0],
        status: Status.Reproducer,
        cage: 'A1',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'animal-2',
        name: 'Speedy',
        sex: Sex.Male,
        birthDate: twoMonthsAgo.toISOString().split('T')[0],
        status: Status.Reproducer,
        cage: 'A2',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'animal-3',
        name: 'Junior',
        sex: Sex.Male,
        birthDate: now.toISOString().split('T')[0],
        status: Status.Grow,
        cage: 'B1',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'animal-4',
        name: 'Elder',
        sex: Sex.Female,
        birthDate: '2023-01-01',
        status: Status.Retired,
        cage: 'C1',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'animal-5',
        name: 'Consumed',
        sex: Sex.Male,
        birthDate: '2024-01-01',
        status: Status.Consumed,
        consumedDate: monthAgo.toISOString().split('T')[0],
        consumedWeight: 2500,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'animal-6',
        name: 'Deceased',
        sex: Sex.Female,
        birthDate: '2024-02-01',
        status: Status.Deceased,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    sampleLitters = [
      {
        id: 'litter-1',
        motherId: 'animal-1',
        fatherId: 'animal-2',
        kindlingDate: monthAgo.toISOString().split('T')[0],
        bornAlive: 8,
        stillborn: 1,
        weanedCount: 7,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'litter-2',
        motherId: 'animal-1',
        fatherId: 'animal-2',
        kindlingDate: twoMonthsAgo.toISOString().split('T')[0],
        bornAlive: 6,
        stillborn: 0,
        weanedCount: 6,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    sampleWeights = [
      {
        id: 'weight-1',
        animalId: 'animal-1',
        date: twoMonthsAgo.toISOString().split('T')[0],
        weightGrams: 2000,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'weight-2',
        animalId: 'animal-1',
        date: monthAgo.toISOString().split('T')[0],
        weightGrams: 2200,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'weight-3',
        animalId: 'animal-3',
        date: monthAgo.toISOString().split('T')[0],
        weightGrams: 800,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'weight-4',
        animalId: 'animal-3',
        date: now.toISOString().split('T')[0],
        weightGrams: 1200,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    sampleTreatments = [
      {
        id: 'treatment-1',
        animalId: 'animal-1',
        date: monthAgo.toISOString().split('T')[0],
        product: 'Antibiotic A',
        withdrawalUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'treatment-2',
        animalId: 'animal-2',
        date: twoMonthsAgo.toISOString().split('T')[0],
        product: 'Antibiotic A',
        withdrawalUntil: monthAgo.toISOString().split('T')[0],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'treatment-3',
        animalId: 'animal-3',
        date: monthAgo.toISOString().split('T')[0],
        product: 'Vaccine B',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    sampleCages = [
      { id: 'A1', name: 'Cage A1' },
      { id: 'A2', name: 'Cage A2' },
      { id: 'B1', name: 'Cage B1' },
      { id: 'C1', name: 'Cage C1' },
      { id: 'D1', name: 'Cage D1' }
    ];
  });

  describe('calculateOverview', () => {
    it('should calculate basic statistics correctly', () => {
      const result = StatisticsService.calculateOverview(sampleAnimals, sampleWeights, sampleCages);

      expect(result.totalAnimals).toBe(6);
      expect(result.activeAnimals).toBe(4); // Excludes deceased and consumed
      expect(result.reproductors).toBe(2);
      expect(result.growing).toBe(1);
      expect(result.consumed).toBe(1);
      expect(result.deceased).toBe(1);
    });

    it('should calculate average age correctly', () => {
      const result = StatisticsService.calculateOverview(sampleAnimals, sampleWeights, sampleCages);

      expect(result.averageAge).toBeGreaterThan(0);
      expect(typeof result.averageAge).toBe('number');
    });

    it('should calculate average weight from latest weights', () => {
      const result = StatisticsService.calculateOverview(sampleAnimals, sampleWeights, sampleCages);

      expect(result.averageWeight).toBeGreaterThan(0);
      expect(typeof result.averageWeight).toBe('number');
      // Should be based on latest weights: animal-1 (2200g) and animal-3 (1200g)
      expect(result.averageWeight).toBe(Math.round((2200 + 1200) / 2));
    });

    it('should calculate cage occupancy correctly', () => {
      const result = StatisticsService.calculateOverview(sampleAnimals, sampleWeights, sampleCages);

      // 3 occupied cages (A1, A2, B1, C1) out of 5 total
      expect(result.cageOccupancy).toBe(80); // 4/5 * 100
    });

    it('should handle empty data gracefully', () => {
      const result = StatisticsService.calculateOverview([], [], []);

      expect(result.totalAnimals).toBe(0);
      expect(result.activeAnimals).toBe(0);
      expect(result.reproductors).toBe(0);
      expect(result.growing).toBe(0);
      expect(result.consumed).toBe(0);
      expect(result.deceased).toBe(0);
      expect(result.averageAge).toBe(0);
      expect(result.averageWeight).toBe(0);
      expect(result.cageOccupancy).toBe(0);
    });

    it('should handle animals without birth dates', () => {
      const animalsNoBirthDates = sampleAnimals.map(a => ({ ...a, birthDate: undefined }));
      const result = StatisticsService.calculateOverview(animalsNoBirthDates, sampleWeights, sampleCages);

      expect(result.averageAge).toBe(0);
    });

    it('should handle animals without weights', () => {
      const result = StatisticsService.calculateOverview(sampleAnimals, [], sampleCages);

      expect(result.averageWeight).toBe(0);
    });
  });

  describe('calculateReproductionStats', () => {
    it('should calculate reproduction statistics correctly', () => {
      const result = StatisticsService.calculateReproductionStats(sampleAnimals, sampleLitters);

      expect(result.totalLitters).toBe(2);
      expect(result.totalOffspring).toBe(14); // 8 + 6
      expect(result.averageLitterSize).toBe(7); // 14/2
      expect(result.survivalRate).toBe(93); // 13 weaned out of 14 born alive
    });

    it('should calculate reproduction rate correctly', () => {
      const result = StatisticsService.calculateReproductionStats(sampleAnimals, sampleLitters);

      // 2 litters from 1 reproducing female = 2 litters per female per year * 12 months
      expect(result.reproductionRate).toBe(24);
    });

    it('should count kindlings this month', () => {
      const result = StatisticsService.calculateReproductionStats(sampleAnimals, sampleLitters);

      // No litters this month in sample data
      expect(result.kindlingsThisMonth).toBe(0);
    });

    it('should handle empty data', () => {
      const result = StatisticsService.calculateReproductionStats([], []);

      expect(result.totalLitters).toBe(0);
      expect(result.totalOffspring).toBe(0);
      expect(result.averageLitterSize).toBe(0);
      expect(result.survivalRate).toBe(0);
      expect(result.reproductionRate).toBe(0);
      expect(result.kindlingsThisMonth).toBe(0);
      expect(result.expectedKindlings).toBe(0);
    });

    it('should handle litters without weaned count', () => {
      const littersNoWeanedCount = sampleLitters.map(l => ({ ...l, weanedCount: undefined }));
      const result = StatisticsService.calculateReproductionStats(sampleAnimals, littersNoWeanedCount);

      expect(result.survivalRate).toBe(0); // No weaned data = 0% survival rate
    });
  });

  describe('calculateGrowthStats', () => {
    it('should calculate weight gain correctly', () => {
      const result = StatisticsService.calculateGrowthStats(sampleAnimals, sampleWeights);

      expect(result.averageWeightGain).toBeGreaterThan(0);
      expect(typeof result.averageWeightGain).toBe('number');
    });

    it('should identify fastest and slowest growing animals', () => {
      const result = StatisticsService.calculateGrowthStats(sampleAnimals, sampleWeights);

      // Only animal-3 has growth data in our sample (800g to 1200g)
      expect(result.fastestGrowing?.id).toBe('animal-3');
      expect(result.slowestGrowing?.id).toBe('animal-3');
    });

    it('should calculate weight distribution', () => {
      const result = StatisticsService.calculateGrowthStats(sampleAnimals, sampleWeights);

      expect(result.weightDistribution).toHaveLength(5);
      expect(result.weightDistribution.every(d => typeof d.range === 'string')).toBe(true);
      expect(result.weightDistribution.every(d => typeof d.count === 'number')).toBe(true);
    });

    it('should calculate growth trends', () => {
      const result = StatisticsService.calculateGrowthStats(sampleAnimals, sampleWeights);

      expect(result.growthTrends).toHaveLength(6); // Last 6 months
      expect(result.growthTrends.every(t => typeof t.month === 'string')).toBe(true);
      expect(result.growthTrends.every(t => typeof t.averageWeight === 'number')).toBe(true);
    });

    it('should handle empty data', () => {
      const result = StatisticsService.calculateGrowthStats([], []);

      expect(result.averageWeightGain).toBe(0);
      expect(result.fastestGrowing).toBeNull();
      expect(result.slowestGrowing).toBeNull();
      expect(result.weightDistribution.every(d => d.count === 0)).toBe(true);
      expect(result.growthTrends.every(t => t.averageWeight === 0)).toBe(true);
    });

    it('should handle animals with insufficient weight data', () => {
      const singleWeights = [sampleWeights[0]]; // Only one weight record
      const result = StatisticsService.calculateGrowthStats(sampleAnimals, singleWeights);

      expect(result.averageWeightGain).toBe(0);
      expect(result.fastestGrowing).toBeNull();
      expect(result.slowestGrowing).toBeNull();
    });
  });

  describe('calculateConsumptionStats', () => {
    it('should calculate consumption statistics correctly', () => {
      const result = StatisticsService.calculateConsumptionStats(sampleAnimals);

      expect(result.totalConsumed).toBe(1);
      expect(result.totalWeight).toBe(2500);
      expect(result.averageConsumptionWeight).toBe(2500);
    });

    it('should count consumption this month', () => {
      const result = StatisticsService.calculateConsumptionStats(sampleAnimals);

      expect(result.consumedThisMonth).toBe(0); // The consumed animal was last month, not this month
    });

    it('should calculate consumption trends', () => {
      const result = StatisticsService.calculateConsumptionStats(sampleAnimals);

      expect(result.consumptionTrends).toHaveLength(6); // Last 6 months
      expect(result.consumptionTrends.every(t => typeof t.month === 'string')).toBe(true);
      expect(result.consumptionTrends.every(t => typeof t.count === 'number')).toBe(true);
      expect(result.consumptionTrends.every(t => typeof t.weight === 'number')).toBe(true);
    });

    it('should handle empty data', () => {
      const result = StatisticsService.calculateConsumptionStats([]);

      expect(result.totalConsumed).toBe(0);
      expect(result.totalWeight).toBe(0);
      expect(result.averageConsumptionWeight).toBe(0);
      expect(result.consumedThisMonth).toBe(0);
      expect(result.consumptionTrends.every(t => t.count === 0 && t.weight === 0)).toBe(true);
    });

    it('should handle consumed animals without weight or date', () => {
      const animalsNoConsumptionData = [
        {
          ...sampleAnimals[0],
          status: Status.Consumed,
          consumedDate: undefined,
          consumedWeight: undefined
        }
      ];

      const result = StatisticsService.calculateConsumptionStats(animalsNoConsumptionData);

      expect(result.totalConsumed).toBe(1);
      expect(result.totalWeight).toBe(0);
      expect(result.averageConsumptionWeight).toBe(0);
      expect(result.consumedThisMonth).toBe(0);
    });
  });

  describe('calculateHealthStats', () => {
    it('should calculate health statistics correctly', () => {
      const result = StatisticsService.calculateHealthStats(sampleTreatments);

      expect(result.totalTreatments).toBe(3);
      expect(result.activeWithdrawals).toBe(1); // Only treatment-1 has future withdrawal
    });

    it('should identify common treatments', () => {
      const result = StatisticsService.calculateHealthStats(sampleTreatments);

      expect(result.commonTreatments).toHaveLength(2);
      expect(result.commonTreatments[0].product).toBe('Antibiotic A');
      expect(result.commonTreatments[0].count).toBe(2);
      expect(result.commonTreatments[1].product).toBe('Vaccine B');
      expect(result.commonTreatments[1].count).toBe(1);
    });

    it('should calculate treatment trends', () => {
      const result = StatisticsService.calculateHealthStats(sampleTreatments);

      expect(result.treatmentTrends).toHaveLength(6); // Last 6 months
      expect(result.treatmentTrends.every(t => typeof t.month === 'string')).toBe(true);
      expect(result.treatmentTrends.every(t => typeof t.count === 'number')).toBe(true);
    });

    it('should handle empty data', () => {
      const result = StatisticsService.calculateHealthStats([]);

      expect(result.totalTreatments).toBe(0);
      expect(result.activeWithdrawals).toBe(0);
      expect(result.commonTreatments).toHaveLength(0);
      expect(result.treatmentTrends.every(t => t.count === 0)).toBe(true);
    });

    it('should handle treatments without withdrawal periods', () => {
      const treatmentsNoWithdrawal = sampleTreatments.map(t => ({ ...t, withdrawalUntil: undefined }));
      const result = StatisticsService.calculateHealthStats(treatmentsNoWithdrawal);

      expect(result.activeWithdrawals).toBe(0);
    });

    it('should limit common treatments to top 5', () => {
      const manyTreatments = Array.from({ length: 10 }, (_, i) => ({
        ...sampleTreatments[0],
        id: `treatment-${i}`,
        product: `Product ${i}`
      }));

      const result = StatisticsService.calculateHealthStats(manyTreatments);

      expect(result.commonTreatments.length).toBeLessThanOrEqual(5);
    });
  });

  describe('generatePerformanceReport', () => {
    it('should generate complete performance report', () => {
      const result = StatisticsService.generatePerformanceReport(
        sampleAnimals,
        sampleLitters,
        sampleWeights,
        sampleTreatments,
        sampleCages
      );

      expect(result.overview).toBeDefined();
      expect(result.reproduction).toBeDefined();
      expect(result.growth).toBeDefined();
      expect(result.consumption).toBeDefined();
      expect(result.health).toBeDefined();
      expect(result.generatedAt).toBeDefined();
      expect(new Date(result.generatedAt).getTime()).toBeCloseTo(Date.now(), -2); // Within 100ms
    });

    it('should include all required sections', () => {
      const result = StatisticsService.generatePerformanceReport(
        sampleAnimals,
        sampleLitters,
        sampleWeights,
        sampleTreatments,
        sampleCages
      );

      // Check that all sections have the expected structure
      expect(typeof result.overview.totalAnimals).toBe('number');
      expect(typeof result.reproduction.totalLitters).toBe('number');
      expect(typeof result.growth.averageWeightGain).toBe('number');
      expect(typeof result.consumption.totalConsumed).toBe('number');
      expect(typeof result.health.totalTreatments).toBe('number');
    });

    it('should handle empty data in all sections', () => {
      const result = StatisticsService.generatePerformanceReport([], [], [], [], []);

      expect(result.overview.totalAnimals).toBe(0);
      expect(result.reproduction.totalLitters).toBe(0);
      expect(result.growth.averageWeightGain).toBe(0);
      expect(result.consumption.totalConsumed).toBe(0);
      expect(result.health.totalTreatments).toBe(0);
      expect(result.generatedAt).toBeDefined();
    });
  });
});