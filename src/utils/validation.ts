import { z } from 'zod';
import { Sex, Status, BreedingMethod, Route } from '../models/types';
import { I18nService } from '../services/i18n.service';

// Base schemas for common validations
const dateString = z.string().refine((date) => !isNaN(Date.parse(date)), {
  message: I18nService.t('validation.invalidDate')
});

const positiveNumber = z.number().min(0, I18nService.t('validation.weightPositive'));
const uuid = z.string().uuid(I18nService.t('validation.invalidId'));

// Animal validation schema
export const animalSchema = z.object({
  name: z.string().min(1, I18nService.t('validation.nameRequired')).max(50, I18nService.t('validation.nameTooLong')),
  identifier: z.string().optional(),
  sex: z.nativeEnum(Sex, { message: I18nService.t('validation.sexRequired') }),
  breed: z.string().optional(),
  birthDate: dateString.optional(),
  origin: z.enum(['BORN_HERE', 'PURCHASED']).optional(),
  motherId: uuid.optional(),
  fatherId: uuid.optional(),
  cage: z.string().optional(),
  status: z.nativeEnum(Status, { message: I18nService.t('validation.statusRequired') }),
  notes: z.string().optional(),
}).refine((data) => {
  // Validation: if birthDate is provided, it should not be in the future
  if (data.birthDate && new Date(data.birthDate) > new Date()) {
    return false;
  }
  return true;
}, {
  message: I18nService.t('validation.birthDateFuture'),
  path: ['birthDate']
});

// Breeding validation schema
export const breedingSchema = z.object({
  femaleId: uuid,
  maleId: uuid.optional(),
  method: z.nativeEnum(BreedingMethod),
  date: dateString,
  notes: z.string().optional(),
  diagnosis: z.enum(['PREGNANT', 'NOT_PREGNANT', 'UNKNOWN']).optional(),
  diagnosisDate: dateString.optional(),
  expectedKindlingDate: dateString.optional(),
}).refine((data) => {
  // Validation: diagnosis date should be after breeding date
  if (data.diagnosisDate && data.date && new Date(data.diagnosisDate) < new Date(data.date)) {
    return false;
  }
  return true;
}, {
  message: () => I18nService.t('validation.diagnosisAfterBreeding'),
  path: ['diagnosisDate']
});

// Litter validation schema
export const litterSchema = z.object({
  motherId: uuid,
  fatherId: uuid.optional(),
  kindlingDate: dateString,
  bornAlive: positiveNumber,
  stillborn: positiveNumber,
  weaningDate: dateString.optional(),
  weanedCount: positiveNumber.optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // Validation: weaning date should be after kindling date
  if (data.weaningDate && new Date(data.weaningDate) < new Date(data.kindlingDate)) {
    return false;
  }
  return true;
}, {
  message: () => I18nService.t('validation.weaningAfterKindling'),
  path: ['weaningDate']
}).refine((data) => {
  // Validation: weaned count should not exceed born alive
  if (data.weanedCount !== undefined && data.weanedCount > data.bornAlive) {
    return false;
  }
  return true;
}, {
  message: () => I18nService.t('validation.weanedExceedsAlive'),
  path: ['weanedCount']
});

// Weight record validation schema
export const weightSchema = z.object({
  animalId: uuid,
  date: dateString,
  weightGrams: z.number().min(1, () => I18nService.t('validation.weightPositive')),
  notes: z.string().optional(),
});

// Treatment validation schema
export const treatmentSchema = z.object({
  animalId: uuid,
  date: dateString,
  product: z.string().min(1, () => I18nService.t('validation.productRequired')),
  lotNumber: z.string().optional(),
  dose: z.string().optional(),
  route: z.nativeEnum(Route).optional(),
  reason: z.string().optional(),
  withdrawalUntil: dateString.optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // Validation: withdrawal date should be after treatment date
  if (data.withdrawalUntil && new Date(data.withdrawalUntil) < new Date(data.date)) {
    return false;
  }
  return true;
}, {
  message: () => I18nService.t('validation.withdrawalAfterTreatment'),
  path: ['withdrawalUntil']
});

// Mortality validation schema
export const mortalitySchema = z.object({
  animalId: uuid,
  date: dateString,
  suspectedCause: z.string().optional(),
  necropsy: z.boolean().optional(),
  notes: z.string().optional(),
});

// Settings validation schema
export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  weightUnit: z.enum(['g', 'kg']),
  enableQR: z.boolean(),
  locale: z.literal('fr-FR'),
  schemaVersion: z.number(),
});

// Export types
export type AnimalFormData = z.infer<typeof animalSchema>;
export type BreedingFormData = z.infer<typeof breedingSchema>;
export type LitterFormData = z.infer<typeof litterSchema>;
export type WeightFormData = z.infer<typeof weightSchema>;
export type TreatmentFormData = z.infer<typeof treatmentSchema>;
export type MortalityFormData = z.infer<typeof mortalitySchema>;