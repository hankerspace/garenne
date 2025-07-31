import { z } from 'zod';
import { Sex, Status, BreedingMethod, Route } from '../models/types';

// Base schemas for common validations
const dateString = z.string().refine((date) => !isNaN(Date.parse(date)), {
  message: 'Date invalide'
});

const positiveNumber = z.number().min(0, 'Doit être positif');
const uuid = z.string().uuid('ID invalide');

// Animal validation schema
export const animalSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(50, 'Nom trop long'),
  identifier: z.string().optional(),
  sex: z.nativeEnum(Sex, { message: 'Sexe requis' }),
  breed: z.string().optional(),
  birthDate: dateString.optional(),
  origin: z.enum(['BORN_HERE', 'PURCHASED']).optional(),
  motherId: uuid.optional(),
  fatherId: uuid.optional(),
  cage: z.string().optional(),
  status: z.nativeEnum(Status, { message: 'Statut requis' }),
  notes: z.string().optional(),
}).refine((data) => {
  // Validation: if birthDate is provided, it should not be in the future
  if (data.birthDate && new Date(data.birthDate) > new Date()) {
    return false;
  }
  return true;
}, {
  message: 'La date de naissance ne peut pas être dans le futur',
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
  message: 'La date de diagnostic doit être après la saillie',
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
  message: 'La date de sevrage doit être après la mise bas',
  path: ['weaningDate']
}).refine((data) => {
  // Validation: weaned count should not exceed born alive
  if (data.weanedCount !== undefined && data.weanedCount > data.bornAlive) {
    return false;
  }
  return true;
}, {
  message: 'Le nombre de sevrés ne peut pas dépasser les nés vivants',
  path: ['weanedCount']
});

// Weight record validation schema
export const weightSchema = z.object({
  animalId: uuid,
  date: dateString,
  weightGrams: z.number().min(1, 'Le poids doit être supérieur à 0'),
  notes: z.string().optional(),
});

// Treatment validation schema
export const treatmentSchema = z.object({
  animalId: uuid,
  date: dateString,
  product: z.string().min(1, 'Le produit est requis'),
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
  message: 'La fin du délai d\'attente doit être après le traitement',
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