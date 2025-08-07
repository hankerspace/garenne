import { useAppStore } from '../store';

/**
 * Custom hooks for breeding-related operations and selectors
 */

/**
 * Get breeding by ID
 */
export const useBreeding = (id: string) => {
  return useAppStore(state => state.breedings.find(breeding => breeding.id === id));
};

/**
 * Get breedings for a specific animal
 */
export const useAnimalBreedings = (animalId: string) => {
  return useAppStore(state => 
    state.breedings.filter(breeding => 
      breeding.femaleId === animalId || breeding.maleId === animalId
    )
  );
};

/**
 * Get active breedings (with diagnosis unknown or pregnant)
 */
export const useActiveBreedings = () => {
  return useAppStore(state => 
    state.breedings.filter(breeding => 
      breeding.diagnosis === 'PREGNANT' || breeding.diagnosis === 'UNKNOWN'
    )
  );
};

/**
 * Get expected kindlings in next days
 */
export const useExpectedKindlings = (daysAhead = 7) => {
  return useAppStore(state => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    
    return state.breedings.filter(breeding => {
      if (!breeding.expectedKindlingDate) return false;
      const kindlingDate = new Date(breeding.expectedKindlingDate);
      return kindlingDate >= now && kindlingDate <= futureDate;
    });
  });
};

/**
 * Get breeding statistics
 */
export const useBreedingStats = () => {
  return useAppStore(state => {
    const breedings = state.breedings;
    const litters = state.litters;
    
    return {
      totalBreedings: breedings.length,
      pregnantBreedings: breedings.filter(b => b.diagnosis === 'PREGNANT').length,
      confirmedBreedings: breedings.filter(b => b.diagnosis === 'NOT_PREGNANT').length,
      unknownBreedings: breedings.filter(b => b.diagnosis === 'UNKNOWN').length,
      totalLitters: litters.length,
      averageLitterSize: litters.length > 0 
        ? litters.reduce((sum, l) => sum + l.bornAlive, 0) / litters.length 
        : 0,
      totalBornAlive: litters.reduce((sum, l) => sum + l.bornAlive, 0),
      totalStillborn: litters.reduce((sum, l) => sum + l.stillborn, 0),
    };
  });
};