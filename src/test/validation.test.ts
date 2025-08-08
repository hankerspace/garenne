import { describe, it, expect, vi } from 'vitest';
import {
  animalSchema,
  breedingSchema,
  litterSchema,
  weightSchema,
  treatmentSchema,
  mortalitySchema,
  settingsSchema
} from '../utils/validation';
import { Sex, Status, BreedingMethod, Route } from '../models/types';

// Mock I18nService
vi.mock('../services/i18n.service', () => ({
  I18nService: {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'validation.invalidDate': 'Invalid date',
        'validation.weightPositive': 'Weight must be positive',
        'validation.invalidId': 'Invalid ID',
        'validation.nameRequired': 'Name is required',
        'validation.nameTooLong': 'Name is too long',
        'validation.sexRequired': 'Sex is required',
        'validation.statusRequired': 'Status is required',
        'validation.birthDateFuture': 'Birth date cannot be in the future',
        'validation.diagnosisAfterBreeding': 'Diagnosis date must be after breeding date',
        'validation.weaningAfterKindling': 'Weaning date must be after kindling date',
        'validation.weanedExceedsAlive': 'Weaned count cannot exceed born alive',
        'validation.productRequired': 'Product is required',
        'validation.withdrawalAfterTreatment': 'Withdrawal date must be after treatment date'
      };
      return translations[key] || key;
    }
  }
}));

describe('Validation Schemas', () => {
  describe('animalSchema', () => {
    const validAnimalData = {
      name: 'Test Rabbit',
      identifier: 'TR001',
      sex: Sex.Female,
      breed: 'New Zealand White',
      birthDate: '2024-01-15',
      origin: 'BORN_HERE' as const,
      motherId: '123e4567-e89b-12d3-a456-426614174000',
      fatherId: '123e4567-e89b-12d3-a456-426614174001',
      cage: 'A1',
      status: Status.Reproducer,
      notes: 'Good breeder'
    };

    it('should validate correct animal data', () => {
      const result = animalSchema.safeParse(validAnimalData);
      expect(result.success).toBe(true);
    });

    it('should require name to be non-empty', () => {
      const invalidData = { ...validAnimalData, name: '' };
      const result = animalSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required');
      }
    });

    it('should reject name that is too long', () => {
      const invalidData = { ...validAnimalData, name: 'A'.repeat(51) };
      const result = animalSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is too long');
      }
    });

    it('should require valid sex enum', () => {
      const invalidData = { ...validAnimalData, sex: 'invalid' as any };
      const result = animalSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Sex is required');
      }
    });

    it('should require valid status enum', () => {
      const invalidData = { ...validAnimalData, status: 'invalid' as any };
      const result = animalSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Status is required');
      }
    });

    it('should reject future birth dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const invalidData = { ...validAnimalData, birthDate: futureDate.toISOString().split('T')[0] };
      
      const result = animalSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Birth date cannot be in the future');
        expect(result.error.issues[0].path).toEqual(['birthDate']);
      }
    });

    it('should validate valid UUID for parent IDs', () => {
      const invalidData = { ...validAnimalData, motherId: 'invalid-uuid' };
      const result = animalSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid ID');
      }
    });

    it('should accept optional fields as undefined', () => {
      const minimalData = {
        name: 'Test',
        sex: Sex.Male,
        status: Status.Grow
      };
      
      const result = animalSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should accept valid origin values', () => {
      const bornHereData = { ...validAnimalData, origin: 'BORN_HERE' as const };
      const purchasedData = { ...validAnimalData, origin: 'PURCHASED' as const };
      
      expect(animalSchema.safeParse(bornHereData).success).toBe(true);
      expect(animalSchema.safeParse(purchasedData).success).toBe(true);
    });

    it('should reject invalid origin values', () => {
      const invalidData = { ...validAnimalData, origin: 'INVALID' as any };
      const result = animalSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('breedingSchema', () => {
    const validBreedingData = {
      femaleId: '123e4567-e89b-12d3-a456-426614174000',
      maleId: '123e4567-e89b-12d3-a456-426614174001',
      method: BreedingMethod.Natural,
      date: '2024-01-15',
      notes: 'First breeding',
      diagnosis: 'PREGNANT' as const,
      diagnosisDate: '2024-01-25',
      expectedKindlingDate: '2024-02-15'
    };

    it('should validate correct breeding data', () => {
      const result = breedingSchema.safeParse(validBreedingData);
      expect(result.success).toBe(true);
    });

    it('should require valid UUID for femaleId', () => {
      const invalidData = { ...validBreedingData, femaleId: 'invalid-uuid' };
      const result = breedingSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should require valid breeding method', () => {
      const invalidData = { ...validBreedingData, method: 'invalid' as any };
      const result = breedingSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should require valid date format', () => {
      const invalidData = { ...validBreedingData, date: 'invalid-date' };
      const result = breedingSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid date');
      }
    });

    it('should reject diagnosis date before breeding date', () => {
      const invalidData = {
        ...validBreedingData,
        date: '2024-01-25',
        diagnosisDate: '2024-01-20'
      };
      
      const result = breedingSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Diagnosis date must be after breeding date');
        expect(result.error.issues[0].path).toEqual(['diagnosisDate']);
      }
    });

    it('should accept valid diagnosis values', () => {
      const pregnantData = { ...validBreedingData, diagnosis: 'PREGNANT' as const };
      const notPregnantData = { ...validBreedingData, diagnosis: 'NOT_PREGNANT' as const };
      const unknownData = { ...validBreedingData, diagnosis: 'UNKNOWN' as const };
      
      expect(breedingSchema.safeParse(pregnantData).success).toBe(true);
      expect(breedingSchema.safeParse(notPregnantData).success).toBe(true);
      expect(breedingSchema.safeParse(unknownData).success).toBe(true);
    });
  });

  describe('litterSchema', () => {
    const validLitterData = {
      motherId: '123e4567-e89b-12d3-a456-426614174000',
      fatherId: '123e4567-e89b-12d3-a456-426614174001',
      kindlingDate: '2024-02-15',
      bornAlive: 8,
      stillborn: 1,
      weaningDate: '2024-03-15',
      weanedCount: 7,
      notes: 'Good litter'
    };

    it('should validate correct litter data', () => {
      const result = litterSchema.safeParse(validLitterData);
      expect(result.success).toBe(true);
    });

    it('should require positive numbers for born alive and stillborn', () => {
      const negativeAliveData = { ...validLitterData, bornAlive: -1 };
      const negativeStillbornData = { ...validLitterData, stillborn: -1 };
      
      expect(litterSchema.safeParse(negativeAliveData).success).toBe(false);
      expect(litterSchema.safeParse(negativeStillbornData).success).toBe(false);
    });

    it('should reject weaning date before kindling date', () => {
      const invalidData = {
        ...validLitterData,
        kindlingDate: '2024-02-15',
        weaningDate: '2024-02-10'
      };
      
      const result = litterSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Weaning date must be after kindling date');
        expect(result.error.issues[0].path).toEqual(['weaningDate']);
      }
    });

    it('should reject weaned count exceeding born alive', () => {
      const invalidData = {
        ...validLitterData,
        bornAlive: 5,
        weanedCount: 6
      };
      
      const result = litterSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Weaned count cannot exceed born alive');
        expect(result.error.issues[0].path).toEqual(['weanedCount']);
      }
    });

    it('should accept weaned count equal to born alive', () => {
      const validData = {
        ...validLitterData,
        bornAlive: 8,
        weanedCount: 8
      };
      
      const result = litterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('weightSchema', () => {
    const validWeightData = {
      animalId: '123e4567-e89b-12d3-a456-426614174000',
      date: '2024-01-15',
      weightGrams: 2500,
      notes: 'Monthly weighing'
    };

    it('should validate correct weight data', () => {
      const result = weightSchema.safeParse(validWeightData);
      expect(result.success).toBe(true);
    });

    it('should require positive weight', () => {
      const invalidData = { ...validWeightData, weightGrams: 0 };
      const result = weightSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Weight must be positive');
      }
    });

    it('should require valid UUID for animalId', () => {
      const invalidData = { ...validWeightData, animalId: 'invalid-uuid' };
      const result = weightSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should require valid date', () => {
      const invalidData = { ...validWeightData, date: 'invalid-date' };
      const result = weightSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('treatmentSchema', () => {
    const validTreatmentData = {
      animalId: '123e4567-e89b-12d3-a456-426614174000',
      date: '2024-01-15',
      product: 'Antibiotic',
      lotNumber: 'LOT123',
      dose: '5ml',
      route: Route.Oral,
      reason: 'Infection',
      withdrawalUntil: '2024-01-25',
      notes: 'First treatment'
    };

    it('should validate correct treatment data', () => {
      const result = treatmentSchema.safeParse(validTreatmentData);
      expect(result.success).toBe(true);
    });

    it('should require non-empty product', () => {
      const invalidData = { ...validTreatmentData, product: '' };
      const result = treatmentSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Product is required');
      }
    });

    it('should require valid route enum', () => {
      const invalidData = { ...validTreatmentData, route: 'invalid' as any };
      const result = treatmentSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should reject withdrawal date before treatment date', () => {
      const invalidData = {
        ...validTreatmentData,
        date: '2024-01-25',
        withdrawalUntil: '2024-01-20'
      };
      
      const result = treatmentSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Withdrawal date must be after treatment date');
        expect(result.error.issues[0].path).toEqual(['withdrawalUntil']);
      }
    });

    it('should accept valid route values', () => {
      const routes = [Route.Oral, Route.SC, Route.IM, Route.Other];
      
      routes.forEach(route => {
        const data = { ...validTreatmentData, route };
        const result = treatmentSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('mortalitySchema', () => {
    const validMortalityData = {
      animalId: '123e4567-e89b-12d3-a456-426614174000',
      date: '2024-01-15',
      suspectedCause: 'Disease',
      necropsy: true,
      notes: 'Sudden death'
    };

    it('should validate correct mortality data', () => {
      const result = mortalitySchema.safeParse(validMortalityData);
      expect(result.success).toBe(true);
    });

    it('should require valid UUID for animalId', () => {
      const invalidData = { ...validMortalityData, animalId: 'invalid-uuid' };
      const result = mortalitySchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should require valid date', () => {
      const invalidData = { ...validMortalityData, date: 'invalid-date' };
      const result = mortalitySchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should accept minimal mortality data', () => {
      const minimalData = {
        animalId: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15'
      };
      
      const result = mortalitySchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('settingsSchema', () => {
    const validSettingsData = {
      theme: 'light' as const,
      weightUnit: 'g' as const,
      enableQR: true,
      locale: 'fr-FR' as const,
      schemaVersion: 1
    };

    it('should validate correct settings data', () => {
      const result = settingsSchema.safeParse(validSettingsData);
      expect(result.success).toBe(true);
    });

    it('should accept valid theme values', () => {
      const themes = ['light', 'dark', 'system'] as const;
      
      themes.forEach(theme => {
        const data = { ...validSettingsData, theme };
        const result = settingsSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid theme values', () => {
      const invalidData = { ...validSettingsData, theme: 'invalid' as any };
      const result = settingsSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should accept valid weight units', () => {
      const units = ['g', 'kg'] as const;
      
      units.forEach(weightUnit => {
        const data = { ...validSettingsData, weightUnit };
        const result = settingsSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should require boolean for enableQR', () => {
      const invalidData = { ...validSettingsData, enableQR: 'true' as any };
      const result = settingsSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should require specific locale value', () => {
      const invalidData = { ...validSettingsData, locale: 'en-US' as any };
      const result = settingsSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should require number for schemaVersion', () => {
      const invalidData = { ...validSettingsData, schemaVersion: '1' as any };
      const result = settingsSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle empty objects', () => {
      expect(animalSchema.safeParse({}).success).toBe(false);
      expect(weightSchema.safeParse({}).success).toBe(false);
      expect(treatmentSchema.safeParse({}).success).toBe(false);
    });

    it('should handle null and undefined values', () => {
      expect(animalSchema.safeParse(null).success).toBe(false);
      expect(animalSchema.safeParse(undefined).success).toBe(false);
    });

    it('should handle boundary weight values', () => {
      const boundaryData = {
        animalId: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15',
        weightGrams: 1 // Minimum valid weight
      };
      
      expect(weightSchema.safeParse(boundaryData).success).toBe(true);
    });

    it('should handle boundary dates', () => {
      const today = new Date().toISOString().split('T')[0];
      const animalData = {
        name: 'Test',
        sex: Sex.Male,
        status: Status.Grow,
        birthDate: today
      };
      
      expect(animalSchema.safeParse(animalData).success).toBe(true);
    });

    it('should handle very long but valid names', () => {
      const animalData = {
        name: 'A'.repeat(50), // Max length
        sex: Sex.Female,
        status: Status.Reproducer
      };
      
      expect(animalSchema.safeParse(animalData).success).toBe(true);
    });

    it('should handle zero values for litter counts', () => {
      const litterData = {
        motherId: '123e4567-e89b-12d3-a456-426614174000',
        kindlingDate: '2024-02-15',
        bornAlive: 0,
        stillborn: 0
      };
      
      expect(litterSchema.safeParse(litterData).success).toBe(true);
    });
  });
});