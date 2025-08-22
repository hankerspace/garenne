import { AppState, Animal, Sex, Status, BreedingMethod, Route, Mortality } from '../models/types.ts';
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
    {
      id: generateId(),
      name: 'Daisy',
      identifier: 'F003',
      sex: Sex.Female,
      breed: 'Géant des Flandres',
      birthDate: addDaysToDate(toISODate(now), -420),
      origin: 'PURCHASED',
      cage: 'B2',
      status: Status.Reproducer,
      notes: 'Grande femelle calme',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Thor',
      identifier: 'M002',
      sex: Sex.Male,
      breed: 'Géant des Flandres',
      birthDate: addDaysToDate(toISODate(now), -450),
      origin: 'PURCHASED',
      cage: 'B2',
      status: Status.Reproducer,
      notes: 'Mâle puissant',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Misty',
      identifier: 'F004',
      sex: Sex.Female,
      breed: 'Papillon',
      birthDate: addDaysToDate(toISODate(now), -180),
      origin: 'PURCHASED',
      cage: 'A2',
      status: Status.Reproducer,
      notes: 'Jeune femelle prometteuse',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Vieux',
      identifier: 'F005',
      sex: Sex.Female,
      breed: 'Rex',
      birthDate: addDaysToDate(toISODate(now), -1500),
      origin: 'BORN_HERE',
      cage: 'A1',
      status: Status.Retired,
      notes: 'Retraitée - excellente lignée',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Shadow',
      identifier: 'M003',
      sex: Sex.Male,
      breed: 'Rex',
      birthDate: addDaysToDate(toISODate(now), -900),
      origin: 'PURCHASED',
      status: Status.Deceased,
      notes: 'Décédé récemment',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Gibier',
      identifier: 'K001',
      sex: Sex.Male,
      breed: 'Croisé',
      birthDate: addDaysToDate(toISODate(now), -80),
      origin: 'BORN_HERE',
      status: Status.Consumed,
      consumedDate: addDaysToDate(toISODate(now), -2),
      consumedWeight: 1800,
      notes: 'Abattu pour consommation',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Junior',
      identifier: 'J003',
      sex: Sex.Male,
      breed: 'Géant des Flandres',
      birthDate: addDaysToDate(toISODate(now), -60),
      origin: 'BORN_HERE',
      status: Status.Grow,
      notes: 'Fils de Daisy x Thor',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Perle',
      identifier: 'J004',
      sex: Sex.Female,
      breed: 'Géant des Flandres',
      birthDate: addDaysToDate(toISODate(now), -60),
      origin: 'BORN_HERE',
      status: Status.Grow,
      notes: 'Fille de Daisy x Thor',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create some sample breedings
  const bellaId = animals[0].id;
  const maxId = animals[2].id;
  const lunaId = animals[1].id;
  const chocoId = animals[3].id;
  const caramelId = animals[4].id;
  const daisyId = animals[5].id;
  const thorId = animals[6].id;
  const mistyId = animals[7].id;
  const vieuxId = animals[8].id;
  const shadowId = animals[9].id;
  const gibierId = animals[10].id;
  const juniorId = animals[11].id;
  const perleId = animals[12].id;
  
  // Set explicit parent relationships
  animals[1].motherId = bellaId; // Luna is daughter of Bella
  animals[1].fatherId = maxId;   // and Max
  animals[3].motherId = bellaId; // Choco from Bella
  animals[3].fatherId = maxId;   // and Max
  animals[4].motherId = bellaId; // Caramel from Bella
  animals[4].fatherId = maxId;   // and Max
  animals[11].motherId = daisyId; // Junior from Daisy
  animals[11].fatherId = thorId;  // and Thor
  animals[12].motherId = daisyId; // Perle from Daisy
  animals[12].fatherId = thorId;  // and Thor
  animals[10].motherId = bellaId; // Gibier from Bella
  animals[10].fatherId = maxId;   // and Max
  
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
    {
      id: generateId(),
      femaleId: bellaId,
      maleId: maxId,
      method: BreedingMethod.Natural,
      date: addDaysToDate(toISODate(now), -121),
      notes: 'Cycle précédent',
      diagnosis: 'PREGNANT' as const,
      diagnosisDate: addDaysToDate(toISODate(now), -107),
      expectedKindlingDate: addDaysToDate(toISODate(now), -90),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      femaleId: daisyId,
      maleId: thorId,
      method: BreedingMethod.Natural,
      date: addDaysToDate(toISODate(now), -91),
      notes: 'Saillie Géant des Flandres',
      diagnosis: 'PREGNANT' as const,
      diagnosisDate: addDaysToDate(toISODate(now), -77),
      expectedKindlingDate: addDaysToDate(toISODate(now), -60),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      femaleId: mistyId,
      method: BreedingMethod.AI,
      date: addDaysToDate(toISODate(now), -10),
      notes: 'Insémination via IA',
      diagnosis: 'UNKNOWN' as const,
      expectedKindlingDate: addDaysToDate(toISODate(now), 21),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      femaleId: lunaId,
      method: BreedingMethod.Natural,
      date: addDaysToDate(toISODate(now), -7),
      notes: 'Saillie non concluante',
      diagnosis: 'NOT_PREGNANT' as const,
      diagnosisDate: toISODate(now),
      expectedKindlingDate: addDaysToDate(toISODate(now), 24),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create sample litters
  const litters = [
    // Current Bella x Max litter in progress
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
    // Previous Bella x Max litter ~90 days ago (Choco, Caramel, Gibier en sont issus)
    {
      id: generateId(),
      motherId: bellaId,
      fatherId: maxId,
      kindlingDate: addDaysToDate(toISODate(now), -90),
      bornAlive: 8,
      stillborn: 0,
      weaningDate: addDaysToDate(toISODate(now), -48),
      weanedCount: 7,
      notes: 'Portée précédente de Bella',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Daisy x Thor litter ~60 days ago (Junior et Perle)
    {
      id: generateId(),
      motherId: daisyId,
      fatherId: thorId,
      kindlingDate: addDaysToDate(toISODate(now), -60),
      bornAlive: 7,
      stillborn: 1,
      weaningDate: addDaysToDate(toISODate(now), -18),
      weanedCount: 6,
      notes: 'Bonne mère, deux très beaux sujets',
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
    // Daisy's weights
    {
      id: generateId(),
      animalId: daisyId,
      date: addDaysToDate(toISODate(now), -75),
      weightGrams: 5200,
      notes: 'Avant mise bas',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      animalId: daisyId,
      date: addDaysToDate(toISODate(now), -55),
      weightGrams: 5000,
      notes: 'Post-partum',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Thor's weights
    {
      id: generateId(),
      animalId: thorId,
      date: addDaysToDate(toISODate(now), -30),
      weightGrams: 6200,
      notes: 'Mâle en forme',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Junior's weights
    {
      id: generateId(),
      animalId: juniorId,
      date: addDaysToDate(toISODate(now), -15),
      weightGrams: 1800,
      notes: 'Jeune en croissance',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Perle's weights
    {
      id: generateId(),
      animalId: perleId,
      date: addDaysToDate(toISODate(now), -15),
      weightGrams: 1750,
      notes: 'Jeune en croissance',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create some treatments
  const treatments = [
    {
      id: generateId(),
      animalId: bellaId,
      date: addDaysToDate(toISODate(now), -5),
      product: 'Baycox',
      lotNumber: 'LOT2024-001',
      dose: '1ml',
      route: Route.Oral,
      reason: 'Prévention coccidiose',
      withdrawalUntil: addDaysToDate(toISODate(now), 10), // Active withdrawal
      notes: 'Traitement préventif post-partum',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      animalId: mistyId,
      date: addDaysToDate(toISODate(now), -3),
      product: 'Vitamine E',
      dose: '0.5ml',
      route: Route.Oral,
      reason: 'Support reproduction',
      notes: 'Avant diagnostic IA',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create sample cages
  const cages = [
    {
      id: generateId(),
      name: 'A1',
      description: 'Cage reproducteurs - Bâtiment A',
      capacity: 2,
      location: 'Bâtiment A, Rangée 1',
      notes: 'Cage pour reproducteurs',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'A2',
      description: 'Cage reproducteurs - Bâtiment A',
      capacity: 2,
      location: 'Bâtiment A, Rangée 1',
      notes: 'Cage pour reproducteurs',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'B1',
      description: 'Cage croissance - Bâtiment B',
      capacity: 4,
      location: 'Bâtiment B, Rangée 1',
      notes: 'Cage pour jeunes en croissance',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'B2',
      description: 'Cage croissance - Bâtiment B',
      capacity: 4,
      location: 'Bâtiment B, Rangée 1',
      notes: 'Cage pour jeunes en croissance',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create sample tags
  const tags = [
    {
      id: generateId(),
      name: 'Champion',
      color: '#FFD700',
      description: 'Animal avec excellentes performances',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Réservé',
      color: '#FF5722',
      description: 'Animal réservé pour la vente',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Lignée Premium',
      color: '#9C27B0',
      description: 'Animal de lignée pure',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: generateId(),
      name: 'Surveillance',
      color: '#FF9800',
      description: 'Animal nécessitant une surveillance particulière',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Assign some tags to animals
  animals[0].tags = [tags[0].id]; // Bella gets Champion tag
  animals[1].tags = [tags[2].id]; // Luna gets Lignée Premium tag
  animals[2].tags = [tags[1].id, tags[3].id]; // Max gets Réservé and Surveillance tags
  animals[5].tags = [tags[0].id]; // Daisy Champion
  animals[7].tags = [tags[3].id]; // Misty under Surveillance

  // Assign some cages to animals (use created cage IDs)
  animals[0].cage = cages[0].id; // Bella in Cage A1
  animals[1].cage = cages[1].id; // Luna in Cage A2
  animals[2].cage = cages[2].id; // Max in Cage B1
  animals[5].cage = cages[3].id; // Daisy in Cage B2
  animals[6].cage = cages[3].id; // Thor in Cage B2

  // Create a mortality record for Shadow
  const mortalities: Mortality[] = [
    {
      id: generateId(),
      animalId: animals[9].id, // Shadow
      date: addDaysToDate(toISODate(now), -1),
      suspectedCause: 'Entérotoxémie',
      necropsy: false,
      notes: 'Décès soudain',
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
    healthLogs: [],
    mortalities,
    cages,
    tags,
    performanceMetrics: [],
    goals: [],
    goalAchievements: [],
    settings: {
      theme: 'light',
      weightUnit: 'g',
      enableQR: false,
      locale: 'fr-FR',
      schemaVersion: 2,
      gestationDuration: 31,
      weaningDuration: 28,
      reproductionReadyDuration: 90,
      slaughterReadyDuration: 70,
      exportFormat: 'json',
      includeImages: false,
    },
  };
};