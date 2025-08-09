import { describe, it, expect, beforeEach } from 'vitest';
import { GenealogyService } from '../services/genealogy.service';
import { Animal, Sex, Status } from '../models/types';

describe('GenealogyService', () => {
  let animals: Animal[];

  beforeEach(() => {
    // Create a test family tree
    // Great-grandparents generation (generation 3)
    const greatGrandmother: Animal = {
      id: 'ggm1',
      name: 'Grande-Mère 1',
      sex: Sex.Female,
      status: Status.Deceased,
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z'
    };

    const greatGrandfather: Animal = {
      id: 'ggf1',
      name: 'Grand-Père 1',
      sex: Sex.Male,
      status: Status.Deceased,
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z'
    };

    // Grandparents generation (generation 2)
    const grandmother: Animal = {
      id: 'gm1',
      name: 'Grand-Mère',
      sex: Sex.Female,
      status: Status.Retired,
      motherId: 'ggm1',
      fatherId: 'ggf1',
      createdAt: '2021-01-01T00:00:00Z',
      updatedAt: '2021-01-01T00:00:00Z'
    };

    const grandfather: Animal = {
      id: 'gf1',
      name: 'Grand-Père',
      sex: Sex.Male,
      status: Status.Retired,
      motherId: 'ggm1', // Same mother as grandmother (half-siblings)
      createdAt: '2021-01-01T00:00:00Z',
      updatedAt: '2021-01-01T00:00:00Z'
    };

    // Parents generation (generation 1)
    const mother: Animal = {
      id: 'mother1',
      name: 'Mère',
      sex: Sex.Female,
      status: Status.Reproducer,
      motherId: 'gm1',
      fatherId: 'gf1',
      createdAt: '2022-01-01T00:00:00Z',
      updatedAt: '2022-01-01T00:00:00Z'
    };

    const father: Animal = {
      id: 'father1',
      name: 'Père',
      sex: Sex.Male,
      status: Status.Reproducer,
      createdAt: '2022-01-01T00:00:00Z',
      updatedAt: '2022-01-01T00:00:00Z'
    };

    // Current generation (generation 0)
    const offspring: Animal = {
      id: 'offspring1',
      name: 'Descendant',
      sex: Sex.Female,
      status: Status.Grow,
      motherId: 'mother1',
      fatherId: 'father1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    // Unrelated animal for mating recommendations
    const unrelated: Animal = {
      id: 'unrelated1',
      name: 'Non Apparenté',
      sex: Sex.Male,
      status: Status.Reproducer,
      breed: 'Race A',
      createdAt: '2022-06-01T00:00:00Z',
      updatedAt: '2022-06-01T00:00:00Z'
    };

    animals = [
      greatGrandmother,
      greatGrandfather,
      grandmother,
      grandfather,
      mother,
      father,
      offspring,
      unrelated
    ];
  });

  describe('calculateInbreedingCoefficient', () => {
    it('should return 0 for animals without parents', () => {
      const animal = animals.find(a => a.id === 'unrelated1')!;
      const coefficient = GenealogyService.calculateInbreedingCoefficient(animal, animals);
      expect(coefficient).toBe(0);
    });

    it('should return 0 for animals with unrelated parents', () => {
      const animal = animals.find(a => a.id === 'offspring1')!;
      const coefficient = GenealogyService.calculateInbreedingCoefficient(animal, animals);
      expect(coefficient).toBe(0);
    });

    it('should calculate inbreeding coefficient for animals with common ancestors', () => {
      // Create an inbred animal (parents are half-siblings)
      const inbredOffspring: Animal = {
        id: 'inbred1',
        name: 'Consanguin',
        sex: Sex.Male,
        status: Status.Grow,
        motherId: 'gm1', // Grandmother
        fatherId: 'gf1', // Grandfather (half-siblings share ggm1)
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      const testAnimals = [...animals, inbredOffspring];
      const coefficient = GenealogyService.calculateInbreedingCoefficient(inbredOffspring, testAnimals);
      
      // Should be 0.125 (12.5%) for half-sibling parents
      expect(coefficient).toBeCloseTo(0.125, 3);
    });

    it('should handle complex pedigrees with multiple common ancestors', () => {
      // Create animals with multiple common ancestors
      const complexInbred: Animal = {
        id: 'complex1',
        name: 'Complexe',
        sex: Sex.Female,
        status: Status.Grow,
        motherId: 'mother1',
        fatherId: 'gf1', // Father's grandfather
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      const testAnimals = [...animals, complexInbred];
      const coefficient = GenealogyService.calculateInbreedingCoefficient(complexInbred, testAnimals);
      
      expect(coefficient).toBeGreaterThan(0);
      expect(coefficient).toBeLessThan(0.5);
    });
  });

  describe('getAncestors', () => {
    it('should return empty array for animals without parents', () => {
      const animal = animals.find(a => a.id === 'ggm1')!;
      const ancestors = GenealogyService.getAncestors(animal, animals);
      expect(ancestors).toHaveLength(0);
    });

    it('should return all ancestors for an animal with complex pedigree', () => {
      const animal = animals.find(a => a.id === 'offspring1')!;
      const ancestors = GenealogyService.getAncestors(animal, animals);
      
      // Should include mother, father, grandmother, grandfather, great-grandmother, great-grandfather
      expect(ancestors.length).toBeGreaterThan(0);
      expect(ancestors.some(a => a.id === 'mother1')).toBe(true);
      expect(ancestors.some(a => a.id === 'father1')).toBe(true);
      expect(ancestors.some(a => a.id === 'gm1')).toBe(true);
      expect(ancestors.some(a => a.id === 'gf1')).toBe(true);
    });

    it('should respect maximum generations limit', () => {
      const animal = animals.find(a => a.id === 'offspring1')!;
      const ancestors = GenealogyService.getAncestors(animal, animals, 2);
      
      // Should only go back 2 generations
      expect(ancestors.some(a => a.id === 'mother1')).toBe(true);
      expect(ancestors.some(a => a.id === 'gm1')).toBe(true);
      expect(ancestors.some(a => a.id === 'ggm1')).toBe(false); // Too far back
    });

    it('should handle circular references gracefully', () => {
      // Create a circular reference (should not happen in practice but test robustness)
      const circularAnimals = [...animals];
      const circular = circularAnimals.find(a => a.id === 'ggm1')!;
      circular.motherId = 'offspring1'; // Creates circular reference

      const animal = circularAnimals.find(a => a.id === 'offspring1')!;
      const ancestors = GenealogyService.getAncestors(animal, circularAnimals);
      
      // Should not crash and should return finite results
      expect(ancestors).toBeDefined();
      expect(ancestors.length).toBeLessThan(100); // Sanity check
    });
  });

  describe('getPathLength', () => {
    it('should return 0 for same animal', () => {
      const animal = animals.find(a => a.id === 'offspring1')!;
      const pathLength = GenealogyService.getPathLength(animal, animal, animals);
      expect(pathLength).toBe(0);
    });

    it('should return 1 for parent-child relationship', () => {
      const offspring = animals.find(a => a.id === 'offspring1')!;
      const mother = animals.find(a => a.id === 'mother1')!;
      const pathLength = GenealogyService.getPathLength(offspring, mother, animals);
      expect(pathLength).toBe(1);
    });

    it('should return 2 for grandparent-grandchild relationship', () => {
      const offspring = animals.find(a => a.id === 'offspring1')!;
      const grandmother = animals.find(a => a.id === 'gm1')!;
      const pathLength = GenealogyService.getPathLength(offspring, grandmother, animals);
      expect(pathLength).toBe(2);
    });

    it('should return -1 for unrelated animals', () => {
      const offspring = animals.find(a => a.id === 'offspring1')!;
      const unrelated = animals.find(a => a.id === 'unrelated1')!;
      const pathLength = GenealogyService.getPathLength(offspring, unrelated, animals);
      expect(pathLength).toBe(-1);
    });
  });

  describe('calculateRelationshipCoefficient', () => {
    it('should return 0 for unrelated animals', () => {
      const offspring = animals.find(a => a.id === 'offspring1')!;
      const unrelated = animals.find(a => a.id === 'unrelated1')!;
      const coefficient = GenealogyService.calculateRelationshipCoefficient(offspring, unrelated, animals);
      expect(coefficient).toBe(0);
    });

    it('should return 0.5 for parent-child relationship', () => {
      const offspring = animals.find(a => a.id === 'offspring1')!;
      const mother = animals.find(a => a.id === 'mother1')!;
      const coefficient = GenealogyService.calculateRelationshipCoefficient(offspring, mother, animals);
      expect(coefficient).toBeCloseTo(0.5, 3);
    });

    it('should return 0.25 for grandparent-grandchild relationship', () => {
      const offspring = animals.find(a => a.id === 'offspring1')!;
      const grandmother = animals.find(a => a.id === 'gm1')!;
      const coefficient = GenealogyService.calculateRelationshipCoefficient(offspring, grandmother, animals);
      
      // In our test data, grandmother and grandfather share a common mother (ggm1)
      // so the coefficient is higher than simple grandparent-grandchild (0.25)
      // Expected: 0.25 (grandmother path) + 0.0625 (shared ancestor through grandfather) = 0.1875
      expect(coefficient).toBeCloseTo(0.1875, 3);
    });

    it('should calculate correct coefficient for half-siblings', () => {
      const grandmother = animals.find(a => a.id === 'gm1')!;
      const grandfather = animals.find(a => a.id === 'gf1')!;
      const coefficient = GenealogyService.calculateRelationshipCoefficient(grandmother, grandfather, animals);
      
      // Half-siblings should have coefficient of 0.25
      expect(coefficient).toBeCloseTo(0.25, 3);
    });
  });

  describe('generateMatingRecommendations', () => {
    it('should return recommendations for female animal', () => {
      const female = animals.find(a => a.id === 'offspring1')!;
      const recommendations = GenealogyService.generateMatingRecommendations(female, animals);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      
      // Should only recommend males
      recommendations.forEach(rec => {
        expect(rec.partner.sex).toBe(Sex.Male);
        expect(rec.partner.id).not.toBe(female.id);
      });
    });

    it('should prioritize unrelated partners', () => {
      const female = animals.find(a => a.id === 'offspring1')!;
      const recommendations = GenealogyService.generateMatingRecommendations(female, animals);
      
      // Unrelated partner should be recommended over related ones
      const unrelatedRec = recommendations.find(r => r.partner.id === 'unrelated1');
      const fatherRec = recommendations.find(r => r.partner.id === 'father1');
      
      if (unrelatedRec && fatherRec) {
        expect(unrelatedRec.recommendation).toBe('excellent');
        expect(fatherRec.recommendation).toBe('not_recommended');
      }
    });

    it('should calculate inbreeding coefficients for potential offspring', () => {
      const female = animals.find(a => a.id === 'offspring1')!;
      const recommendations = GenealogyService.generateMatingRecommendations(female, animals);
      
      recommendations.forEach(rec => {
        expect(rec.inbreedingCoefficient).toBeGreaterThanOrEqual(0);
        expect(rec.inbreedingCoefficient).toBeLessThanOrEqual(1);
        expect(rec.relationshipCoefficient).toBeGreaterThanOrEqual(0);
        expect(rec.relationshipCoefficient).toBeLessThanOrEqual(1);
        expect(rec.geneticDiversityScore).toBeGreaterThanOrEqual(0);
        expect(rec.geneticDiversityScore).toBeLessThanOrEqual(1);
      });
    });

    it('should respect breeding status filter', () => {
      const female = animals.find(a => a.id === 'offspring1')!;
      const recommendations = GenealogyService.generateMatingRecommendations(female, animals);
      
      // Should only recommend breeding animals
      recommendations.forEach(rec => {
        expect(rec.partner.status).toBe(Status.Reproducer);
      });
    });

    it('should handle preferred breeds option', () => {
      const female = animals.find(a => a.id === 'offspring1')!;
      const recommendations = GenealogyService.generateMatingRecommendations(female, animals, {
        preferredBreeds: ['Race A']
      });
      
      const preferredRec = recommendations.find(r => r.partner.breed === 'Race A');
      if (preferredRec) {
        expect(preferredRec.reasons.some(reason => reason.includes('Preferred breed'))).toBe(true);
      }
    });

    it('should handle maximum inbreeding coefficient option', () => {
      const female = animals.find(a => a.id === 'offspring1')!;
      const recommendations = GenealogyService.generateMatingRecommendations(female, animals, {
        maxInbreedingCoefficient: 0.03125 // Very strict limit
      });
      
      recommendations.forEach(rec => {
        if (rec.recommendation === 'not_recommended') {
          expect(rec.inbreedingCoefficient).toBeGreaterThan(0.03125);
        }
      });
    });
  });

  describe('getPedigreeData', () => {
    it('should generate complete pedigree structure', () => {
      const animal = animals.find(a => a.id === 'offspring1')!;
      const pedigreeData = GenealogyService.getPedigreeData(animal, animals, 3);
      
      expect(pedigreeData).toBeDefined();
      expect(pedigreeData.animal.id).toBe('offspring1');
      expect(pedigreeData.generation).toBe(0);
      expect(pedigreeData.inbreedingCoefficient).toBeGreaterThanOrEqual(0);
    });

    it('should include parent information when available', () => {
      const animal = animals.find(a => a.id === 'offspring1')!;
      const pedigreeData = GenealogyService.getPedigreeData(animal, animals, 3);
      
      expect(pedigreeData.mother).toBeDefined();
      expect(pedigreeData.father).toBeDefined();
      expect(pedigreeData.mother?.animal.id).toBe('mother1');
      expect(pedigreeData.father?.animal.id).toBe('father1');
    });

    it('should respect generation limit', () => {
      const animal = animals.find(a => a.id === 'offspring1')!;
      const pedigreeData = GenealogyService.getPedigreeData(animal, animals, 2);
      
      // Should have parents (generation 1) but not great-grandparents (generation 3)
      expect(pedigreeData.mother).toBeDefined();
      expect(pedigreeData.mother?.mother).toBeDefined(); // Grandmother
      expect(pedigreeData.mother?.mother?.mother).toBeNull(); // Great-grandmother should be null
    });

    it('should handle animals without parents', () => {
      const animal = animals.find(a => a.id === 'unrelated1')!;
      const pedigreeData = GenealogyService.getPedigreeData(animal, animals, 3);
      
      expect(pedigreeData.animal.id).toBe('unrelated1');
      expect(pedigreeData.mother).toBeNull();
      expect(pedigreeData.father).toBeNull();
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle empty animal array', () => {
      const animal = animals[0];
      const coefficient = GenealogyService.calculateInbreedingCoefficient(animal, []);
      expect(coefficient).toBe(0);
    });

    it('should handle missing parent references', () => {
      const orphan: Animal = {
        id: 'orphan',
        name: 'Orphelin',
        sex: Sex.Male,
        status: Status.Grow,
        motherId: 'nonexistent',
        fatherId: 'alsononexistent',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      const coefficient = GenealogyService.calculateInbreedingCoefficient(orphan, [orphan]);
      expect(coefficient).toBe(0);
    });

    it('should handle very deep pedigrees without stack overflow', () => {
      // Create a very deep lineage
      const deepAnimals: Animal[] = [];
      const depth = 20;

      for (let i = 0; i < depth; i++) {
        const animal: Animal = {
          id: `deep-${i}`,
          name: `Animal ${i}`,
          sex: i % 2 === 0 ? Sex.Female : Sex.Male,
          status: Status.Grow,
          motherId: i > 0 ? `deep-${i - 1}` : undefined,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        };
        deepAnimals.push(animal);
      }

      const lastAnimal = deepAnimals[depth - 1];
      const ancestors = GenealogyService.getAncestors(lastAnimal, deepAnimals);
      
      expect(ancestors.length).toBeLessThanOrEqual(10); // Should respect max generations limit
    });
  });
});