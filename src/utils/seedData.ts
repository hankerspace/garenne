import { AppState, Animal, Sex, Status, BreedingMethod } from '../models/types.ts';
import { generateId, generateTimestamp } from '../services/id.service.ts';
import { addDaysToDate, toISODate } from '../utils/dates.ts';

export const createSeedData = (): AppState => {
  const now = new Date();
  const timestamp = generateTimestamp();
  
  // Create some sample animals
  const animals: Animal[] = [
    {
      id: generateId(),
      name: 'Bella',
      identifier: 'F001',
      sex: Sex.Female,
      breed: 'Rex',
      birthDate: addDaysToDate(toISODate(now), -365), // 1 year old
      origin: 'PURCHASED',
      cage: 'A1',
      status: Status.Reproducer,
      notes: 'Excellente reproductrice, très douce',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Luna',
      identifier: 'F002',
      sex: Sex.Female,
      breed: 'Nain Bélier',
      birthDate: addDaysToDate(toISODate(now), -300), // 10 months old
      origin: 'BORN_HERE',
      cage: 'A2',
      status: Status.Reproducer,
      notes: 'Fille de Bella',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Max',
      identifier: 'M001',
      sex: Sex.Male,
      breed: 'Rex',
      birthDate: addDaysToDate(toISODate(now), -400), // 13 months old
      origin: 'PURCHASED',
      cage: 'B1',
      status: Status.Reproducer,
      notes: 'Mâle reproducteur principal',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Choco',
      identifier: 'J001',
      sex: Sex.Male,
      breed: 'Nain Bélier',
      birthDate: addDaysToDate(toISODate(now), -90), // 3 months old
      origin: 'BORN_HERE',
      cage: 'C1',
      status: Status.Grow,
      notes: 'Jeune mâle en croissance',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Caramel',
      identifier: 'J002',
      sex: Sex.Female,
      breed: 'Nain Bélier',
      birthDate: addDaysToDate(toISODate(now), -85), // 3 months old
      origin: 'BORN_HERE',
      cage: 'C2',
      status: Status.Grow,
      notes: 'Jeune femelle en croissance',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create some sample breedings
  const bellaId = animals[0].id;
  const maxId = animals[2].id;
  
  const breedings = [
    {
      id: generateId(),
      femaleId: bellaId,
      maleId: maxId,
      method: BreedingMethod.Natural,
      date: addDaysToDate(toISODate(now), -45),
      notes: 'Première saillie de l\'année',
      diagnosis: 'PREGNANT' as const,
      diagnosisDate: addDaysToDate(toISODate(now), -35),
      expectedKindlingDate: addDaysToDate(toISODate(now), -14),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create a sample litter
  const litters = [
    {
      id: generateId(),
      motherId: bellaId,
      fatherId: maxId,
      kindlingDate: addDaysToDate(toISODate(now), -15),
      bornAlive: 6,
      stillborn: 1,
      weaningDate: addDaysToDate(toISODate(now), 20), // Future weaning date
      weanedCount: 5,
      notes: 'Belle portée, un petit décédé à 2 jours',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create some weight records
  const weights = [
    // Bella's weights
    {
      id: generateId(),
      animalId: bellaId,
      date: addDaysToDate(toISODate(now), -60),
      weightGrams: 2100,
      notes: 'Avant saillie',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      animalId: bellaId,
      date: addDaysToDate(toISODate(now), -30),
      weightGrams: 2250,
      notes: 'Gestante',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      animalId: bellaId,
      date: addDaysToDate(toISODate(now), -7),
      weightGrams: 2050,
      notes: 'Après mise bas',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Max's weights
    {
      id: generateId(),
      animalId: maxId,
      date: addDaysToDate(toISODate(now), -30),
      weightGrams: 2800,
      notes: 'Poids stable',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      animalId: maxId,
      date: addDaysToDate(toISODate(now), -7),
      weightGrams: 2850,
      notes: 'Légère prise de poids',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create a sample treatment with active withdrawal
  const treatments = [
    {
      id: generateId(),
      animalId: bellaId,
      date: addDaysToDate(toISODate(now), -5),
      product: 'Baycox',
      lotNumber: 'LOT2024-001',
      dose: '1ml',
      route: 'ORAL' as const,
      reason: 'Prévention coccidiose',
      withdrawalUntil: addDaysToDate(toISODate(now), 10), // Active withdrawal
      notes: 'Traitement préventif post-partum',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  return {
    animals,
    breedings,
    litters,
    weights,
    treatments,
    mortalities: [],
    settings: {
      theme: 'light',
      weightUnit: 'g',
      enableQR: false,
      locale: 'fr-FR',
      schemaVersion: 1,
    },
  };
};