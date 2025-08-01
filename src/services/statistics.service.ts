import { Animal, Litter, WeightRecord, Treatment, PerformanceMetrics, Status, Sex } from '../models/types';
import { addDays, differenceInDays, startOfMonth, endOfMonth, format } from 'date-fns';

export interface StatisticsOverview {
  totalAnimals: number;
  activeAnimals: number;
  reproductors: number;
  growing: number;
  consumed: number;
  deceased: number;
  averageAge: number;
  averageWeight: number;
  cageOccupancy: number;
}

export interface ReproductionStats {
  totalLitters: number;
  totalOffspring: number;
  averageLitterSize: number;
  survivalRate: number;
  reproductionRate: number;
  kindlingsThisMonth: number;
  expectedKindlings: number;
}

export interface GrowthStats {
  averageWeightGain: number;
  fastestGrowing: Animal | null;
  slowestGrowing: Animal | null;
  weightDistribution: { range: string; count: number }[];
  growthTrends: { month: string; averageWeight: number }[];
}

export interface ConsumptionStats {
  totalConsumed: number;
  totalWeight: number;
  averageConsumptionWeight: number;
  consumedThisMonth: number;
  consumptionTrends: { month: string; count: number; weight: number }[];
}

export interface HealthStats {
  totalTreatments: number;
  activeWithdrawals: number;
  commonTreatments: { product: string; count: number }[];
  treatmentTrends: { month: string; count: number }[];
}

export class StatisticsService {
  static calculateOverview(
    animals: Animal[],
    weights: WeightRecord[],
    cages: any[]
  ): StatisticsOverview {
    const now = new Date();
    const activeAnimals = animals.filter(a => a.status !== Status.Deceased && a.status !== Status.Consumed);
    
    // Calculate average age
    const agesInDays = animals
      .filter(a => a.birthDate)
      .map(a => differenceInDays(now, new Date(a.birthDate!)));
    const averageAge = agesInDays.length > 0 
      ? agesInDays.reduce((sum, age) => sum + age, 0) / agesInDays.length 
      : 0;

    // Calculate average weight (latest weight for each animal)
    const latestWeights = activeAnimals.map(animal => {
      const animalWeights = weights
        .filter(w => w.animalId === animal.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return animalWeights[0]?.weightGrams || 0;
    }).filter(w => w > 0);

    const averageWeight = latestWeights.length > 0 
      ? latestWeights.reduce((sum, weight) => sum + weight, 0) / latestWeights.length 
      : 0;

    // Calculate cage occupancy
    const occupiedCages = new Set(activeAnimals.map(a => a.cage).filter(Boolean));
    const cageOccupancy = cages.length > 0 ? (occupiedCages.size / cages.length) * 100 : 0;

    return {
      totalAnimals: animals.length,
      activeAnimals: activeAnimals.length,
      reproductors: animals.filter(a => a.status === Status.Reproducer).length,
      growing: animals.filter(a => a.status === Status.Grow).length,
      consumed: animals.filter(a => a.status === Status.Consumed).length,
      deceased: animals.filter(a => a.status === Status.Deceased).length,
      averageAge: Math.round(averageAge),
      averageWeight: Math.round(averageWeight),
      cageOccupancy: Math.round(cageOccupancy),
    };
  }

  static calculateReproductionStats(
    animals: Animal[],
    litters: Litter[]
  ): ReproductionStats {
    const females = animals.filter(a => a.sex === Sex.Female && a.status === Status.Reproducer);
    const now = new Date();
    const thisMonth = startOfMonth(now);
    const endThisMonth = endOfMonth(now);

    const totalOffspring = litters.reduce((sum, l) => sum + l.bornAlive, 0);
    const totalWeaned = litters.reduce((sum, l) => sum + (l.weanedCount || 0), 0);
    const survivalRate = totalOffspring > 0 ? (totalWeaned / totalOffspring) * 100 : 0;

    const kindlingsThisMonth = litters.filter(l => {
      const kindlingDate = new Date(l.kindlingDate);
      return kindlingDate >= thisMonth && kindlingDate <= endThisMonth;
    }).length;

    // Calculate reproduction rate (litters per female per year)
    const reproductionRate = females.length > 0 ? (litters.length / females.length) * 12 : 0;

    return {
      totalLitters: litters.length,
      totalOffspring,
      averageLitterSize: litters.length > 0 ? totalOffspring / litters.length : 0,
      survivalRate: Math.round(survivalRate),
      reproductionRate: Math.round(reproductionRate * 100) / 100,
      kindlingsThisMonth,
      expectedKindlings: 0, // Would require breeding data to calculate
    };
  }

  static calculateGrowthStats(
    animals: Animal[],
    weights: WeightRecord[]
  ): GrowthStats {
    const growingAnimals = animals.filter(a => a.status === Status.Grow);
    const weightGains: { animalId: string; gainPerDay: number }[] = [];

    // Calculate weight gain per day for each animal
    growingAnimals.forEach(animal => {
      const animalWeights = weights
        .filter(w => w.animalId === animal.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (animalWeights.length >= 2) {
        const firstWeight = animalWeights[0];
        const lastWeight = animalWeights[animalWeights.length - 1];
        const daysDiff = differenceInDays(new Date(lastWeight.date), new Date(firstWeight.date));
        
        if (daysDiff > 0) {
          const gainPerDay = (lastWeight.weightGrams - firstWeight.weightGrams) / daysDiff;
          weightGains.push({ animalId: animal.id, gainPerDay });
        }
      }
    });

    const averageWeightGain = weightGains.length > 0 
      ? weightGains.reduce((sum, g) => sum + g.gainPerDay, 0) / weightGains.length 
      : 0;

    // Find fastest and slowest growing animals
    const sortedGains = weightGains.sort((a, b) => b.gainPerDay - a.gainPerDay);
    const fastestGrowing = sortedGains.length > 0 
      ? animals.find(a => a.id === sortedGains[0].animalId) || null 
      : null;
    const slowestGrowing = sortedGains.length > 0 
      ? animals.find(a => a.id === sortedGains[sortedGains.length - 1].animalId) || null 
      : null;

    // Calculate weight distribution
    const currentWeights = growingAnimals.map(animal => {
      const latestWeight = weights
        .filter(w => w.animalId === animal.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      return latestWeight?.weightGrams || 0;
    }).filter(w => w > 0);

    const weightDistribution = [
      { range: '0-500g', count: currentWeights.filter(w => w < 500).length },
      { range: '500-1000g', count: currentWeights.filter(w => w >= 500 && w < 1000).length },
      { range: '1000-1500g', count: currentWeights.filter(w => w >= 1000 && w < 1500).length },
      { range: '1500-2000g', count: currentWeights.filter(w => w >= 1500 && w < 2000).length },
      { range: '2000g+', count: currentWeights.filter(w => w >= 2000).length },
    ];

    // Calculate growth trends (last 6 months)
    const growthTrends: { month: string; averageWeight: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = addDays(startOfMonth(new Date()), -i * 30);
      const monthWeights = weights.filter(w => {
        const weightDate = new Date(w.date);
        return weightDate.getMonth() === monthDate.getMonth() && 
               weightDate.getFullYear() === monthDate.getFullYear();
      });

      const averageWeight = monthWeights.length > 0 
        ? monthWeights.reduce((sum, w) => sum + w.weightGrams, 0) / monthWeights.length 
        : 0;

      growthTrends.push({
        month: format(monthDate, 'MMM yyyy'),
        averageWeight: Math.round(averageWeight),
      });
    }

    return {
      averageWeightGain: Math.round(averageWeightGain * 100) / 100,
      fastestGrowing,
      slowestGrowing,
      weightDistribution,
      growthTrends,
    };
  }

  static calculateConsumptionStats(animals: Animal[]): ConsumptionStats {
    const consumedAnimals = animals.filter(a => a.status === Status.Consumed);
    const now = new Date();
    const thisMonth = startOfMonth(now);
    const endThisMonth = endOfMonth(now);

    const totalWeight = consumedAnimals.reduce((sum, a) => sum + (a.consumedWeight || 0), 0);
    const averageConsumptionWeight = consumedAnimals.length > 0 ? totalWeight / consumedAnimals.length : 0;

    const consumedThisMonth = consumedAnimals.filter(a => {
      if (!a.consumedDate) return false;
      const consumedDate = new Date(a.consumedDate);
      return consumedDate >= thisMonth && consumedDate <= endThisMonth;
    }).length;

    // Calculate consumption trends (last 6 months)
    const consumptionTrends: { month: string; count: number; weight: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = addDays(startOfMonth(new Date()), -i * 30);
      const monthConsumed = consumedAnimals.filter(a => {
        if (!a.consumedDate) return false;
        const consumedDate = new Date(a.consumedDate);
        return consumedDate.getMonth() === monthDate.getMonth() && 
               consumedDate.getFullYear() === monthDate.getFullYear();
      });

      const monthWeight = monthConsumed.reduce((sum, a) => sum + (a.consumedWeight || 0), 0);

      consumptionTrends.push({
        month: format(monthDate, 'MMM yyyy'),
        count: monthConsumed.length,
        weight: Math.round(monthWeight),
      });
    }

    return {
      totalConsumed: consumedAnimals.length,
      totalWeight: Math.round(totalWeight),
      averageConsumptionWeight: Math.round(averageConsumptionWeight),
      consumedThisMonth,
      consumptionTrends,
    };
  }

  static calculateHealthStats(treatments: Treatment[]): HealthStats {
    const now = new Date();
    
    // Active withdrawals
    const activeWithdrawals = treatments.filter(t => {
      if (!t.withdrawalUntil) return false;
      return new Date(t.withdrawalUntil) > now;
    }).length;

    // Common treatments
    const treatmentCounts: Record<string, number> = {};
    treatments.forEach(t => {
      treatmentCounts[t.product] = (treatmentCounts[t.product] || 0) + 1;
    });

    const commonTreatments = Object.entries(treatmentCounts)
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Treatment trends (last 6 months)
    const treatmentTrends: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = addDays(startOfMonth(new Date()), -i * 30);
      const monthTreatments = treatments.filter(t => {
        const treatmentDate = new Date(t.date);
        return treatmentDate.getMonth() === monthDate.getMonth() && 
               treatmentDate.getFullYear() === monthDate.getFullYear();
      });

      treatmentTrends.push({
        month: format(monthDate, 'MMM yyyy'),
        count: monthTreatments.length,
      });
    }

    return {
      totalTreatments: treatments.length,
      activeWithdrawals,
      commonTreatments,
      treatmentTrends,
    };
  }

  static generatePerformanceReport(
    animals: Animal[],
    litters: Litter[],
    weights: WeightRecord[],
    treatments: Treatment[],
    cages: any[]
  ) {
    return {
      overview: this.calculateOverview(animals, weights, cages),
      reproduction: this.calculateReproductionStats(animals, litters),
      growth: this.calculateGrowthStats(animals, weights),
      consumption: this.calculateConsumptionStats(animals),
      health: this.calculateHealthStats(treatments),
      generatedAt: new Date().toISOString(),
    };
  }
}