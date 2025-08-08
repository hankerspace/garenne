import { Animal, Litter, WeightRecord, Treatment, Status, Sex } from '../models/types';
import { StatisticsService } from './statistics.service';
import { differenceInDays, format, parseISO } from 'date-fns';

export interface IndividualPerformanceReport {
  animal: Animal;
  basicInfo: {
    age: number; // in days
    ageDescription: string;
    currentWeight?: number;
    breed?: string;
    cage?: string;
    status: Status;
  };
  reproductionPerformance?: {
    totalLitters: number;
    totalOffspring: number;
    averageLitterSize: number;
    lastLitterDate?: string;
    reproductionEfficiency: number; // offspring per year
    pregnancySuccess: number; // percentage
  };
  growthPerformance?: {
    currentWeight?: number;
    weightGain: number; // grams
    dailyWeightGain: number; // grams per day
    growthRate: 'excellent' | 'good' | 'average' | 'poor';
    targetWeight: number;
    daysToTarget: number;
  };
  healthStatus: {
    totalTreatments: number;
    recentTreatments: number; // last 30 days
    withdrawalStatus: 'none' | 'active' | 'expired';
    withdrawalEndsAt?: string;
    healthScore: number; // 0-100
  };
  performance: {
    overallScore: number; // 0-100
    ranking: 'excellent' | 'good' | 'average' | 'needs_improvement';
    strengths: string[];
    recommendations: string[];
  };
  trends: {
    weightTrend: { date: string; weight: number }[];
    reproductionTrend?: { date: string; litterSize: number }[];
  };
  comparisons: {
    comparedToAverage: {
      weight: number; // percentage difference
      reproduction?: number; // percentage difference
      growth?: number; // percentage difference
    };
    comparedToPeers: {
      rank: number;
      totalPeers: number;
      percentile: number;
    };
  };
}

export interface PerformanceReportOptions {
  includeComparisons?: boolean;
  includeTrends?: boolean;
  includeRecommendations?: boolean;
  periodMonths?: number; // How many months back to analyze
}

export class PerformanceReportService {
  /**
   * Generate a comprehensive performance report for an individual animal
   */
  static generateIndividualReport(
    animal: Animal,
    allAnimals: Animal[],
    litters: Litter[],
    weights: WeightRecord[],
    treatments: Treatment[],
    options: PerformanceReportOptions = {}
  ): IndividualPerformanceReport {
    const {
      includeComparisons = true,
      includeTrends = true,
      includeRecommendations = true,
      periodMonths = 12
    } = options;

    // Calculate basic info
    const basicInfo = this.calculateBasicInfo(animal);
    
    // Get animal-specific data
    const animalLitters = litters.filter(l => l.motherId === animal.id || l.fatherId === animal.id);
    const animalWeights = weights.filter(w => w.animalId === animal.id);
    const animalTreatments = treatments.filter(t => t.animalId === animal.id);

    // Calculate performance metrics
    const reproductionPerformance = animal.sex === Sex.Female || animal.status === Status.Reproducer
      ? this.calculateReproductionPerformance(animal, animalLitters)
      : undefined;

    const growthPerformance = animal.status === Status.Grow
      ? this.calculateGrowthPerformance(animal, animalWeights)
      : undefined;

    const healthStatus = this.calculateHealthStatus(animal, animalTreatments);

    // Calculate overall performance score
    const performance = this.calculateOverallPerformance(
      animal,
      reproductionPerformance,
      growthPerformance,
      healthStatus
    );

    // Generate trends if requested
    const trends = includeTrends
      ? this.calculateTrends(animal, animalWeights, animalLitters, periodMonths)
      : { weightTrend: [] };

    // Generate comparisons if requested
    const comparisons = includeComparisons
      ? this.calculateComparisons(animal, allAnimals, litters, weights, reproductionPerformance, growthPerformance)
      : {
          comparedToAverage: { weight: 0 },
          comparedToPeers: { rank: 1, totalPeers: 1, percentile: 50 }
        };

    return {
      animal,
      basicInfo,
      reproductionPerformance,
      growthPerformance,
      healthStatus,
      performance,
      trends,
      comparisons
    };
  }

  private static calculateBasicInfo(animal: Animal) {
    const age = animal.birthDate 
      ? differenceInDays(new Date(), parseISO(animal.birthDate))
      : 0;

    let ageDescription = 'Unknown age';
    if (age > 0) {
      if (age < 30) {
        ageDescription = `${age} days old`;
      } else if (age < 365) {
        const months = Math.floor(age / 30);
        ageDescription = `${months} month${months > 1 ? 's' : ''} old`;
      } else {
        const years = Math.floor(age / 365);
        const remainingMonths = Math.floor((age % 365) / 30);
        ageDescription = `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''} old`;
      }
    }

    return {
      age,
      ageDescription,
      breed: animal.breed,
      cage: animal.cage,
      status: animal.status
    };
  }

  private static calculateReproductionPerformance(animal: Animal, litters: Litter[]) {
    const totalLitters = litters.length;
    const totalOffspring = litters.reduce((sum, litter) => sum + (litter.kindlingCount || 0), 0);
    const averageLitterSize = totalLitters > 0 ? totalOffspring / totalLitters : 0;
    
    // Get last litter date
    const sortedLitters = litters
      .filter(l => l.kindlingDate)
      .sort((a, b) => new Date(b.kindlingDate!).getTime() - new Date(a.kindlingDate!).getTime());
    
    const lastLitterDate = sortedLitters[0]?.kindlingDate;

    // Calculate reproduction efficiency (offspring per year)
    let reproductionEfficiency = 0;
    if (animal.birthDate && totalOffspring > 0) {
      const ageInDays = differenceInDays(new Date(), parseISO(animal.birthDate));
      const ageInYears = ageInDays / 365;
      reproductionEfficiency = totalOffspring / Math.max(ageInYears, 0.1);
    }

    // Calculate pregnancy success rate (placeholder - would need breeding records)
    const pregnancySuccess = totalLitters > 0 ? 85 : 0; // Placeholder calculation

    return {
      totalLitters,
      totalOffspring,
      averageLitterSize,
      lastLitterDate,
      reproductionEfficiency,
      pregnancySuccess
    };
  }

  private static calculateGrowthPerformance(animal: Animal, weights: WeightRecord[]) {
    if (weights.length === 0) {
      return {
        currentWeight: 0,
        weightGain: 0,
        dailyWeightGain: 0,
        growthRate: 'average' as const,
        targetWeight: 2500, // Default target weight in grams
        daysToTarget: 0
      };
    }

    // Sort weights by date
    const sortedWeights = weights.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const currentWeight = sortedWeights[sortedWeights.length - 1].weight;
    const firstWeight = sortedWeights[0].weight;
    const weightGain = currentWeight - firstWeight;

    // Calculate daily weight gain
    const daysDifference = differenceInDays(
      parseISO(sortedWeights[sortedWeights.length - 1].date),
      parseISO(sortedWeights[0].date)
    );
    const dailyWeightGain = daysDifference > 0 ? weightGain / daysDifference : 0;

    // Determine growth rate based on daily weight gain
    let growthRate: 'excellent' | 'good' | 'average' | 'poor' = 'average';
    if (dailyWeightGain > 30) growthRate = 'excellent';
    else if (dailyWeightGain > 20) growthRate = 'good';
    else if (dailyWeightGain < 10) growthRate = 'poor';

    // Calculate target weight and days to reach it
    const targetWeight = 2500; // grams
    const daysToTarget = dailyWeightGain > 0 
      ? Math.max(0, Math.ceil((targetWeight - currentWeight) / dailyWeightGain))
      : 0;

    return {
      currentWeight,
      weightGain,
      dailyWeightGain,
      growthRate,
      targetWeight,
      daysToTarget
    };
  }

  private static calculateHealthStatus(animal: Animal, treatments: Treatment[]) {
    const totalTreatments = treatments.length;
    
    // Recent treatments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTreatments = treatments.filter(t => 
      new Date(t.date) >= thirtyDaysAgo
    ).length;

    // Check withdrawal status
    const activeTreatments = treatments.filter(t => {
      if (!t.withdrawalTime) return false;
      const withdrawalEnd = new Date(t.date);
      withdrawalEnd.setDate(withdrawalEnd.getDate() + t.withdrawalTime);
      return withdrawalEnd > new Date();
    });

    const withdrawalStatus = activeTreatments.length > 0 ? 'active' : 'none';
    const withdrawalEndsAt = activeTreatments.length > 0
      ? activeTreatments.reduce((latest, t) => {
          const withdrawalEnd = new Date(t.date);
          withdrawalEnd.setDate(withdrawalEnd.getDate() + t.withdrawalTime!);
          return withdrawalEnd > latest ? withdrawalEnd : latest;
        }, new Date()).toISOString()
      : undefined;

    // Calculate health score (0-100)
    let healthScore = 100;
    healthScore -= Math.min(totalTreatments * 5, 30); // Reduce score for treatments
    healthScore -= recentTreatments * 10; // More penalty for recent treatments
    if (withdrawalStatus === 'active') healthScore -= 20;
    healthScore = Math.max(0, healthScore);

    return {
      totalTreatments,
      recentTreatments,
      withdrawalStatus: withdrawalStatus as 'none' | 'active' | 'expired',
      withdrawalEndsAt,
      healthScore
    };
  }

  private static calculateOverallPerformance(
    animal: Animal,
    reproductionPerformance?: any,
    growthPerformance?: any,
    healthStatus?: any
  ) {
    let overallScore = 0;
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // Health score contributes 40% to overall score
    if (healthStatus) {
      overallScore += healthStatus.healthScore * 0.4;
      if (healthStatus.healthScore > 90) {
        strengths.push('Excellent health record');
      } else if (healthStatus.healthScore < 70) {
        recommendations.push('Monitor health closely and consider preventive care');
      }
    }

    // Reproduction performance contributes 30%
    if (reproductionPerformance) {
      let reproScore = 50; // Base score
      if (reproductionPerformance.averageLitterSize > 8) {
        reproScore += 30;
        strengths.push('High litter size productivity');
      } else if (reproductionPerformance.averageLitterSize < 6) {
        reproScore -= 20;
        recommendations.push('Consider improving breeding conditions or nutrition');
      }
      
      if (reproductionPerformance.reproductionEfficiency > 40) {
        reproScore += 20;
        strengths.push('High reproduction efficiency');
      }
      
      overallScore += Math.min(100, reproScore) * 0.3;
    }

    // Growth performance contributes 30%
    if (growthPerformance) {
      let growthScore = 50; // Base score
      if (growthPerformance.growthRate === 'excellent') {
        growthScore += 40;
        strengths.push('Excellent growth rate');
      } else if (growthPerformance.growthRate === 'good') {
        growthScore += 20;
        strengths.push('Good growth performance');
      } else if (growthPerformance.growthRate === 'poor') {
        growthScore -= 30;
        recommendations.push('Review nutrition and feeding schedule');
      }
      
      overallScore += Math.min(100, growthScore) * 0.3;
    }

    // Determine ranking
    let ranking: 'excellent' | 'good' | 'average' | 'needs_improvement' = 'average';
    if (overallScore >= 90) ranking = 'excellent';
    else if (overallScore >= 75) ranking = 'good';
    else if (overallScore < 60) ranking = 'needs_improvement';

    // Add general recommendations
    if (ranking === 'needs_improvement') {
      recommendations.push('Consider comprehensive health and nutrition review');
    }

    return {
      overallScore: Math.round(overallScore),
      ranking,
      strengths,
      recommendations
    };
  }

  private static calculateTrends(
    animal: Animal,
    weights: WeightRecord[],
    litters: Litter[],
    periodMonths: number
  ) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - periodMonths);

    // Weight trend
    const weightTrend = weights
      .filter(w => new Date(w.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(w => ({
        date: w.date,
        weight: w.weight
      }));

    // Reproduction trend (for females)
    const reproductionTrend = animal.sex === Sex.Female
      ? litters
          .filter(l => l.kindlingDate && new Date(l.kindlingDate) >= cutoffDate)
          .sort((a, b) => new Date(a.kindlingDate!).getTime() - new Date(b.kindlingDate!).getTime())
          .map(l => ({
            date: l.kindlingDate!,
            litterSize: l.kindlingCount || 0
          }))
      : undefined;

    return {
      weightTrend,
      reproductionTrend
    };
  }

  private static calculateComparisons(
    animal: Animal,
    allAnimals: Animal[],
    allLitters: Litter[],
    allWeights: WeightRecord[],
    reproductionPerformance?: any,
    growthPerformance?: any
  ) {
    // Find similar animals for comparison (same sex, similar age)
    const similarAnimals = allAnimals.filter(a => 
      a.id !== animal.id &&
      a.sex === animal.sex &&
      a.status === animal.status
    );

    // Calculate average weight for similar animals
    const avgWeights = similarAnimals.map(a => {
      const animalWeights = allWeights.filter(w => w.animalId === a.id);
      return animalWeights.length > 0
        ? animalWeights[animalWeights.length - 1].weight
        : 0;
    }).filter(w => w > 0);

    const averageWeight = avgWeights.length > 0
      ? avgWeights.reduce((sum, w) => sum + w, 0) / avgWeights.length
      : 0;

    const currentWeight = growthPerformance?.currentWeight || 0;
    const weightComparison = averageWeight > 0
      ? ((currentWeight - averageWeight) / averageWeight) * 100
      : 0;

    // Calculate reproduction comparison
    let reproductionComparison = 0;
    if (reproductionPerformance) {
      const avgLitterSizes = similarAnimals.map(a => {
        const animalLitters = allLitters.filter(l => l.motherId === a.id);
        const totalOffspring = animalLitters.reduce((sum, l) => sum + (l.kindlingCount || 0), 0);
        return animalLitters.length > 0 ? totalOffspring / animalLitters.length : 0;
      }).filter(s => s > 0);

      const avgLitterSize = avgLitterSizes.length > 0
        ? avgLitterSizes.reduce((sum, s) => sum + s, 0) / avgLitterSizes.length
        : 0;

      reproductionComparison = avgLitterSize > 0
        ? ((reproductionPerformance.averageLitterSize - avgLitterSize) / avgLitterSize) * 100
        : 0;
    }

    // Calculate growth comparison
    let growthComparison = 0;
    if (growthPerformance) {
      const avgGrowthRates = similarAnimals.map(a => {
        const animalWeights = allWeights.filter(w => w.animalId === a.id);
        if (animalWeights.length < 2) return 0;
        const sorted = animalWeights.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const weightGain = sorted[sorted.length - 1].weight - sorted[0].weight;
        const days = differenceInDays(parseISO(sorted[sorted.length - 1].date), parseISO(sorted[0].date));
        return days > 0 ? weightGain / days : 0;
      }).filter(r => r > 0);

      const avgGrowthRate = avgGrowthRates.length > 0
        ? avgGrowthRates.reduce((sum, r) => sum + r, 0) / avgGrowthRates.length
        : 0;

      growthComparison = avgGrowthRate > 0
        ? ((growthPerformance.dailyWeightGain - avgGrowthRate) / avgGrowthRate) * 100
        : 0;
    }

    // Calculate peer ranking
    const performanceScores = similarAnimals.map(a => {
      // This is a simplified ranking - in real implementation would calculate full performance scores
      const weights = allWeights.filter(w => w.animalId === a.id);
      return weights.length > 0 ? weights[weights.length - 1].weight : 0;
    });

    performanceScores.push(currentWeight);
    performanceScores.sort((a, b) => b - a);
    const rank = performanceScores.indexOf(currentWeight) + 1;
    const totalPeers = performanceScores.length;
    const percentile = ((totalPeers - rank) / totalPeers) * 100;

    return {
      comparedToAverage: {
        weight: Math.round(weightComparison),
        reproduction: reproductionPerformance ? Math.round(reproductionComparison) : undefined,
        growth: growthPerformance ? Math.round(growthComparison) : undefined
      },
      comparedToPeers: {
        rank,
        totalPeers,
        percentile: Math.round(percentile)
      }
    };
  }

  /**
   * Generate performance reports for multiple animals
   */
  static generateBatchReports(
    animals: Animal[],
    litters: Litter[],
    weights: WeightRecord[],
    treatments: Treatment[],
    options: PerformanceReportOptions = {}
  ): IndividualPerformanceReport[] {
    return animals.map(animal => 
      this.generateIndividualReport(animal, animals, litters, weights, treatments, options)
    );
  }

  /**
   * Export performance report to PDF format (placeholder implementation)
   */
  static async exportToPDF(report: IndividualPerformanceReport): Promise<Blob> {
    // This would integrate with a PDF library like jsPDF or Puppeteer
    // For now, return a placeholder
    const content = this.formatReportAsText(report);
    return new Blob([content], { type: 'text/plain' });
  }

  /**
   * Format report as readable text
   */
  static formatReportAsText(report: IndividualPerformanceReport): string {
    const { animal, basicInfo, reproductionPerformance, growthPerformance, healthStatus, performance } = report;

    let text = `PERFORMANCE REPORT - ${animal.name || animal.id}\n`;
    text += `===============================================\n\n`;
    
    text += `BASIC INFORMATION\n`;
    text += `-----------------\n`;
    text += `ID: ${animal.id}\n`;
    text += `Name: ${animal.name || 'N/A'}\n`;
    text += `Sex: ${animal.sex}\n`;
    text += `Age: ${basicInfo.ageDescription}\n`;
    text += `Status: ${animal.status}\n`;
    text += `Cage: ${animal.cage || 'N/A'}\n`;
    text += `Breed: ${animal.breed || 'N/A'}\n\n`;

    if (reproductionPerformance) {
      text += `REPRODUCTION PERFORMANCE\n`;
      text += `------------------------\n`;
      text += `Total Litters: ${reproductionPerformance.totalLitters}\n`;
      text += `Total Offspring: ${reproductionPerformance.totalOffspring}\n`;
      text += `Average Litter Size: ${reproductionPerformance.averageLitterSize.toFixed(1)}\n`;
      text += `Reproduction Efficiency: ${reproductionPerformance.reproductionEfficiency.toFixed(1)} offspring/year\n\n`;
    }

    if (growthPerformance) {
      text += `GROWTH PERFORMANCE\n`;
      text += `------------------\n`;
      text += `Current Weight: ${growthPerformance.currentWeight}g\n`;
      text += `Weight Gain: ${growthPerformance.weightGain}g\n`;
      text += `Daily Weight Gain: ${growthPerformance.dailyWeightGain.toFixed(1)}g/day\n`;
      text += `Growth Rate: ${growthPerformance.growthRate}\n`;
      text += `Days to Target Weight: ${growthPerformance.daysToTarget}\n\n`;
    }

    text += `HEALTH STATUS\n`;
    text += `-------------\n`;
    text += `Total Treatments: ${healthStatus.totalTreatments}\n`;
    text += `Recent Treatments: ${healthStatus.recentTreatments}\n`;
    text += `Withdrawal Status: ${healthStatus.withdrawalStatus}\n`;
    text += `Health Score: ${healthStatus.healthScore}/100\n\n`;

    text += `OVERALL PERFORMANCE\n`;
    text += `-------------------\n`;
    text += `Overall Score: ${performance.overallScore}/100\n`;
    text += `Ranking: ${performance.ranking}\n`;
    text += `Strengths: ${performance.strengths.join(', ') || 'None identified'}\n`;
    text += `Recommendations: ${performance.recommendations.join(', ') || 'None'}\n`;

    return text;
  }
}

// Export a default instance for convenience
export const performanceReportService = new PerformanceReportService();