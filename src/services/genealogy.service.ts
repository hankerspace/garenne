import { Animal, UUID, Status } from '../models/types';

/**
 * Service for advanced genealogy calculations including inbreeding coefficients
 * and genetic analysis for breeding recommendations
 */
export class GenealogyService {
  /**
   * Calculate the inbreeding coefficient for an animal
   * Inbreeding coefficient = probability that two alleles at a locus are identical by descent
   * Formula: F = Σ (1/2)^(n1+n2+1) * (1+FA)
   * where n1 and n2 are path lengths from parents to common ancestor, FA is the ancestor's inbreeding coefficient
   */
  static calculateInbreedingCoefficient(animal: Animal, allAnimals: Animal[]): number {
    const mother = allAnimals.find(a => a.id === animal.motherId);
    const father = allAnimals.find(a => a.id === animal.fatherId);

    if (!mother || !father) {
      return 0; // Cannot calculate without both parents
    }

    // Find all common ancestors between mother and father
    const motherAncestors = this.getAncestors(mother, allAnimals);
    const fatherAncestors = this.getAncestors(father, allAnimals);

    let inbreedingCoefficient = 0;

    // For each common ancestor, calculate contribution to inbreeding
    motherAncestors.forEach(motherAncestor => {
      const commonAncestor = fatherAncestors.find(fa => fa.id === motherAncestor.id);
      if (commonAncestor) {
        const motherPath = this.getPathLength(mother, motherAncestor, allAnimals);
        const fatherPath = this.getPathLength(father, commonAncestor, allAnimals);
        
        if (motherPath !== -1 && fatherPath !== -1) {
          // Calculate ancestor's own inbreeding coefficient (recursive)
          const ancestorInbreeding = this.calculateInbreedingCoefficient(commonAncestor, allAnimals);
          
          // Add contribution: (1/2)^(n1+n2+1) * (1+FA)
          const contribution = Math.pow(0.5, motherPath + fatherPath + 1) * (1 + ancestorInbreeding);
          inbreedingCoefficient += contribution;
        }
      }
    });

    return Math.round(inbreedingCoefficient * 10000) / 10000; // Round to 4 decimal places
  }

  /**
   * Get all ancestors of an animal up to a specified number of generations
   */
  static getAncestors(animal: Animal, allAnimals: Animal[], maxGenerations: number = 10): Animal[] {
    const ancestors: Animal[] = [];
    const visited = new Set<string>();

    const collectAncestors = (currentAnimal: Animal, generation: number) => {
      if (generation >= maxGenerations || visited.has(currentAnimal.id)) {
        return;
      }

      visited.add(currentAnimal.id);

      const mother = allAnimals.find(a => a.id === currentAnimal.motherId);
      const father = allAnimals.find(a => a.id === currentAnimal.fatherId);

      if (mother) {
        ancestors.push(mother);
        collectAncestors(mother, generation + 1);
      }

      if (father) {
        ancestors.push(father);
        collectAncestors(father, generation + 1);
      }
    };

    collectAncestors(animal, 0);
    return ancestors;
  }

  /**
   * Calculate the path length between an animal and its ancestor
   */
  static getPathLength(animal: Animal, ancestor: Animal, allAnimals: Animal[]): number {
    if (animal.id === ancestor.id) {
      return 0;
    }

    const visited = new Set<string>();
    const queue: { animal: Animal; distance: number }[] = [{ animal, distance: 0 }];

    while (queue.length > 0) {
      const { animal: current, distance } = queue.shift()!;

      if (visited.has(current.id)) {
        continue;
      }
      visited.add(current.id);

      const mother = allAnimals.find(a => a.id === current.motherId);
      const father = allAnimals.find(a => a.id === current.fatherId);

      if (mother) {
        if (mother.id === ancestor.id) {
          return distance + 1;
        }
        queue.push({ animal: mother, distance: distance + 1 });
      }

      if (father) {
        if (father.id === ancestor.id) {
          return distance + 1;
        }
        queue.push({ animal: father, distance: distance + 1 });
      }
    }

    return -1; // Ancestor not found
  }

  /**
   * Calculate relationship coefficient between two animals
   * (used for mating recommendations)
   */
  static calculateRelationshipCoefficient(animal1: Animal, animal2: Animal, allAnimals: Animal[]): number {
    // Direct parent-child relationship
    if (animal1.motherId === animal2.id || animal1.fatherId === animal2.id ||
        animal2.motherId === animal1.id || animal2.fatherId === animal1.id) {
      return 0.5;
    }

    // Get all common ancestors
    const ancestors1 = this.getAncestors(animal1, allAnimals);
    const ancestors2 = this.getAncestors(animal2, allAnimals);

    let relationshipCoefficient = 0;

    // Find common ancestors and calculate their contributions
    ancestors1.forEach(ancestor1 => {
      const commonAncestor = ancestors2.find(a2 => a2.id === ancestor1.id);
      if (commonAncestor) {
        const path1 = this.getPathLength(animal1, ancestor1, allAnimals);
        const path2 = this.getPathLength(animal2, commonAncestor, allAnimals);
        
        if (path1 !== -1 && path2 !== -1) {
          const ancestorInbreeding = this.calculateInbreedingCoefficient(ancestor1, allAnimals);
          const contribution = Math.pow(0.5, path1 + path2) * (1 + ancestorInbreeding);
          relationshipCoefficient += contribution;
        }
      }
    });

    return Math.round(relationshipCoefficient * 10000) / 10000;
  }

  /**
   * Generate mating recommendations based on genetic diversity and inbreeding avoidance
   */
  static generateMatingRecommendations(
    animal: Animal,
    allAnimals: Animal[],
    options: {
      maxInbreedingCoefficient?: number;
      minGenerationsFromCommonAncestor?: number;
      preferredBreeds?: string[];
    } = {}
  ): Array<{
    partner: Animal;
    inbreedingCoefficient: number;
    relationshipCoefficient: number;
    geneticDiversityScore: number;
    recommendation: 'excellent' | 'good' | 'acceptable' | 'not_recommended';
    reasons: string[];
  }> {
    const {
      maxInbreedingCoefficient = 0.0625, // 6.25% (3 generations)
      minGenerationsFromCommonAncestor = 3,
      preferredBreeds = []
    } = options;

    // Find potential partners (opposite sex, breeding status, not directly related)
    const potentialPartners = allAnimals.filter(partner => 
      partner.id !== animal.id &&
      partner.sex !== animal.sex &&
      partner.status === 'REPRO' &&
      !this.isDirectlyRelated(animal, partner, allAnimals)
    );

    const recommendations = potentialPartners.map(partner => {
      // Calculate predicted inbreeding coefficient of offspring
      const mockOffspring: Animal = {
        id: 'mock-offspring',
        name: 'Mock Offspring',
        sex: animal.sex,
        status: Status.Grow,
        motherId: animal.sex === 'F' ? animal.id : partner.id,
        fatherId: animal.sex === 'M' ? animal.id : partner.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const inbreedingCoefficient = this.calculateInbreedingCoefficient(mockOffspring, allAnimals);
      const relationshipCoefficient = this.calculateRelationshipCoefficient(animal, partner, allAnimals);
      
      // Calculate genetic diversity score (higher is better)
      const geneticDiversityScore = this.calculateGeneticDiversityScore(animal, partner, allAnimals);

      // Determine recommendation level
      const reasons: string[] = [];
      let recommendation: 'excellent' | 'good' | 'acceptable' | 'not_recommended' = 'excellent';

      if (inbreedingCoefficient > maxInbreedingCoefficient) {
        recommendation = 'not_recommended';
        reasons.push(`High inbreeding risk (${(inbreedingCoefficient * 100).toFixed(2)}%)`);
      } else if (inbreedingCoefficient > maxInbreedingCoefficient * 0.5) {
        recommendation = 'acceptable';
        reasons.push(`Moderate inbreeding risk (${(inbreedingCoefficient * 100).toFixed(2)}%)`);
      }

      if (relationshipCoefficient > 0.125) { // 12.5%
        if (recommendation === 'excellent') recommendation = 'good';
        reasons.push(`Close relationship (${(relationshipCoefficient * 100).toFixed(2)}%)`);
      }

      if (geneticDiversityScore > 0.8) {
        reasons.push('Excellent genetic diversity');
      } else if (geneticDiversityScore > 0.6) {
        reasons.push('Good genetic diversity');
      } else if (geneticDiversityScore > 0.4) {
        reasons.push('Moderate genetic diversity');
      } else {
        reasons.push('Limited genetic diversity');
        if (recommendation === 'excellent') recommendation = 'good';
      }

      if (preferredBreeds.length > 0 && preferredBreeds.includes(partner.breed || '')) {
        reasons.push('Preferred breed');
      }

      if (reasons.length === 0) {
        reasons.push('No specific genetic concerns identified');
      }

      return {
        partner,
        inbreedingCoefficient,
        relationshipCoefficient,
        geneticDiversityScore,
        recommendation,
        reasons
      };
    });

    // Sort by recommendation quality and genetic diversity
    return recommendations.sort((a, b) => {
      const scoreMap = { excellent: 4, good: 3, acceptable: 2, not_recommended: 1 };
      const scoreA = scoreMap[a.recommendation];
      const scoreB = scoreMap[b.recommendation];

      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher scores first
      }

      return b.geneticDiversityScore - a.geneticDiversityScore; // Higher diversity first
    });
  }

  /**
   * Check if two animals are directly related (parent-child, siblings)
   */
  private static isDirectlyRelated(animal1: Animal, animal2: Animal, allAnimals: Animal[]): boolean {
    // Parent-child relationship
    if (animal1.motherId === animal2.id || animal1.fatherId === animal2.id ||
        animal2.motherId === animal1.id || animal2.fatherId === animal1.id) {
      return true;
    }

    // Sibling relationship (same parents)
    if ((animal1.motherId && animal1.motherId === animal2.motherId) ||
        (animal1.fatherId && animal1.fatherId === animal2.fatherId)) {
      return true;
    }

    return false;
  }

  /**
   * Calculate genetic diversity score between two animals
   * Based on the number of different ancestors in recent generations
   */
  private static calculateGeneticDiversityScore(animal1: Animal, animal2: Animal, allAnimals: Animal[]): number {
    const ancestors1 = this.getAncestors(animal1, allAnimals, 4); // 4 generations
    const ancestors2 = this.getAncestors(animal2, allAnimals, 4);

    if (ancestors1.length === 0 && ancestors2.length === 0) {
      return 1.0; // Maximum diversity if no ancestors known
    }

    const totalAncestors = Math.max(ancestors1.length + ancestors2.length, 1);
    const commonAncestors = ancestors1.filter(a1 => 
      ancestors2.some(a2 => a2.id === a1.id)
    ).length;

    return Math.max(0, 1 - (commonAncestors * 2) / totalAncestors);
  }

  /**
   * Get complete pedigree data for an animal (for PDF export)
   */
  static getPedigreeData(animal: Animal, allAnimals: Animal[], generations: number = 4): PedigreeNode {
    const buildPedigreeNode = (currentAnimal: Animal, currentGeneration: number): PedigreeNode => {
      const mother = currentAnimal.motherId ? allAnimals.find(a => a.id === currentAnimal.motherId) : null;
      const father = currentAnimal.fatherId ? allAnimals.find(a => a.id === currentAnimal.fatherId) : null;

      const node: PedigreeNode = {
        animal: currentAnimal,
        generation: currentGeneration,
        inbreedingCoefficient: this.calculateInbreedingCoefficient(currentAnimal, allAnimals),
        mother: null,
        father: null
      };

      if (currentGeneration < generations) {
        if (mother) {
          node.mother = buildPedigreeNode(mother, currentGeneration + 1);
        }
        if (father) {
          node.father = buildPedigreeNode(father, currentGeneration + 1);
        }
      }

      return node;
    };

    return buildPedigreeNode(animal, 0);
  }
}

/**
 * Interface for pedigree tree nodes
 */
export interface PedigreeNode {
  animal: Animal;
  generation: number;
  inbreedingCoefficient: number;
  mother: PedigreeNode | null;
  father: PedigreeNode | null;
}

/**
 * Interface for mating recommendation options
 */
export interface MatingRecommendationOptions {
  maxInbreedingCoefficient?: number;
  minGenerationsFromCommonAncestor?: number;
  preferredBreeds?: string[];
}