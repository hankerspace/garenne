import { AppState, Status, Sex } from '../models/types';
import { isWithdrawalActive } from '../utils/dates';

// Basic selectors
export const getAnimals = (state: AppState) => state.animals;
export const getBreedings = (state: AppState) => state.breedings;
export const getLitters = (state: AppState) => state.litters;
export const getWeights = (state: AppState) => state.weights;
export const getTreatments = (state: AppState) => state.treatments;
export const getMortalities = (state: AppState) => state.mortalities;
export const getSettings = (state: AppState) => state.settings;

// Animal selectors
export const getLiveAnimals = (state: AppState) =>
  state.animals.filter(animal => animal.status !== Status.Deceased);

export const getFemales = (state: AppState) =>
  state.animals.filter(animal => animal.sex === Sex.Female && animal.status !== Status.Deceased);

export const getMales = (state: AppState) =>
  state.animals.filter(animal => animal.sex === Sex.Male && animal.status !== Status.Deceased);

export const getReproducers = (state: AppState) =>
  state.animals.filter(animal => animal.status === Status.Reproducer);

export const getAnimalById = (state: AppState, id: string) =>
  state.animals.find(animal => animal.id === id);

// Animal family relationships
export const getAnimalChildren = (state: AppState, parentId: string) =>
  state.animals.filter(animal => 
    animal.motherId === parentId || animal.fatherId === parentId
  );

export const getAnimalParents = (state: AppState, animalId: string) => {
  const animal = getAnimalById(state, animalId);
  if (!animal) return { mother: undefined, father: undefined };
  
  const mother = animal.motherId ? getAnimalById(state, animal.motherId) : undefined;
  const father = animal.fatherId ? getAnimalById(state, animal.fatherId) : undefined;
  
  return { mother, father };
};

// Weight selectors
export const getAnimalWeights = (state: AppState, animalId: string) =>
  state.weights
    .filter(weight => weight.animalId === animalId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export const getLatestWeight = (state: AppState, animalId: string) => {
  const weights = getAnimalWeights(state, animalId);
  return weights[weights.length - 1];
};

export const getRecentWeights = (state: AppState, days: number = 7) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return state.weights.filter(weight => 
    new Date(weight.date) >= cutoffDate
  );
};

// Treatment selectors
export const getAnimalTreatments = (state: AppState, animalId: string) =>
  state.treatments
    .filter(treatment => treatment.animalId === animalId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getActiveTreatments = (state: AppState) =>
  state.treatments.filter(treatment => isWithdrawalActive(treatment.withdrawalUntil));

export const getAnimalActiveTreatments = (state: AppState, animalId: string) =>
  getAnimalTreatments(state, animalId).filter(treatment =>
    isWithdrawalActive(treatment.withdrawalUntil)
  );

// Breeding selectors
export const getAnimalBreedings = (state: AppState, animalId: string) =>
  state.breedings.filter(breeding => 
    breeding.femaleId === animalId || breeding.maleId === animalId
  );

export const getFemaleBreedings = (state: AppState, femaleId: string) =>
  state.breedings
    .filter(breeding => breeding.femaleId === femaleId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Litter selectors
export const getAnimalLitters = (state: AppState, animalId: string) =>
  state.litters.filter(litter => 
    litter.motherId === animalId || litter.fatherId === animalId
  );

export const getRecentLitters = (state: AppState, days: number = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return state.litters.filter(litter => 
    new Date(litter.kindlingDate) >= cutoffDate
  );
};

// KPI selectors
export const getKPIs = (state: AppState) => {
  const liveAnimals = getLiveAnimals(state);
  const recentLitters = getRecentLitters(state, 30);
  const activeTreatments = getActiveTreatments(state);
  const recentWeights = getRecentWeights(state, 7);

  return {
    liveAnimalsCount: liveAnimals.length,
    recentLittersCount: recentLitters.length,
    activeTreatmentsCount: activeTreatments.length,
    recentWeightsCount: recentWeights.length,
    femalesCount: liveAnimals.filter(a => a.sex === Sex.Female).length,
    malesCount: liveAnimals.filter(a => a.sex === Sex.Male).length,
    reproducersCount: getReproducers(state).length,
  };
};

// Statistics selectors
export const getWeightStatistics = (state: AppState, animalId: string) => {
  const weights = getAnimalWeights(state, animalId);
  
  if (weights.length === 0) {
    return {
      count: 0,
      latest: null,
      gainMoyenQuotidien: null,
      totalGain: null,
    };
  }
  
  const latest = weights[weights.length - 1];
  const first = weights[0];
  
  let gainMoyenQuotidien = null;
  if (weights.length >= 2) {
    const totalGain = latest.weightGrams - first.weightGrams;
    const daysDiff = Math.abs(
      Math.floor((new Date(latest.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24))
    );
    gainMoyenQuotidien = daysDiff > 0 ? totalGain / daysDiff : 0;
  }
  
  return {
    count: weights.length,
    latest: latest.weightGrams,
    gainMoyenQuotidien,
    totalGain: latest.weightGrams - first.weightGrams,
  };
};

export const getBreedingStatistics = (state: AppState, femaleId: string) => {
  const breedings = getFemaleBreedings(state, femaleId);
  const litters = getAnimalLitters(state, femaleId);
  
  const pregnantBreedings = breedings.filter(b => b.diagnosis === 'PREGNANT');
  const successRate = breedings.length > 0 ? (pregnantBreedings.length / breedings.length) * 100 : 0;
  
  const totalBornAlive = litters.reduce((sum, litter) => sum + litter.bornAlive, 0);
  const averageLitterSize = litters.length > 0 ? totalBornAlive / litters.length : 0;
  
  return {
    totalBreedings: breedings.length,
    totalLitters: litters.length,
    successRate,
    averageLitterSize,
    totalOffspring: totalBornAlive,
  };
};