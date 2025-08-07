import { useMemo } from 'react';
import { useAppStore } from '../store';
import { Animal, Status, Sex } from '../../models/types';

/**
 * Custom hooks for animal-related operations and selectors
 */

/**
 * Get animal by ID with memoization
 */
export const useAnimal = (id: string) => {
  return useAppStore(state => state.animals.find(animal => animal.id === id));
};

/**
 * Get animals by status with memoization
 */
export const useAnimalsByStatus = (status: Status) => {
  return useAppStore(state => state.animals.filter(animal => animal.status === status));
};

/**
 * Get alive animals (Reproducer and Grow status)
 */
export const useAliveAnimals = () => {
  return useAppStore(state => 
    state.animals.filter(animal => 
      animal.status === Status.Reproducer || 
      animal.status === Status.Grow
    )
  );
};

/**
 * Get female animals ready for breeding
 */
export const useBreedingFemales = () => {
  return useAppStore(state => 
    state.animals.filter(animal => 
      animal.sex === Sex.Female && 
      animal.status === Status.Reproducer
    )
  );
};

/**
 * Get male animals ready for breeding
 */
export const useBreedingMales = () => {
  return useAppStore(state => 
    state.animals.filter(animal => 
      animal.sex === Sex.Male && 
      animal.status === Status.Reproducer
    )
  );
};

/**
 * Get animals statistics
 */
export const useAnimalStats = () => {
  return useAppStore(state => {
    const animals = state.animals;
    return {
      total: animals.length,
      reproducer: animals.filter(a => a.status === Status.Reproducer).length,
      grow: animals.filter(a => a.status === Status.Grow).length,
      retired: animals.filter(a => a.status === Status.Retired).length,
      deceased: animals.filter(a => a.status === Status.Deceased).length,
      consumed: animals.filter(a => a.status === Status.Consumed).length,
      males: animals.filter(a => a.sex === Sex.Male).length,
      females: animals.filter(a => a.sex === Sex.Female).length,
    };
  });
};

/**
 * Get animal with its breeding history
 */
export const useAnimalWithBreedingHistory = (animalId: string) => {
  return useAppStore(state => {
    const animal = state.animals.find(a => a.id === animalId);
    const breedings = state.breedings.filter(b => 
      b.femaleId === animalId || b.maleId === animalId
    );
    const litters = state.litters.filter(l => 
      l.motherId === animalId || l.fatherId === animalId
    );
    
    return {
      animal,
      breedings,
      litters,
    };
  });
};

/**
 * Search animals by name or identifier
 */
export const useSearchAnimals = (searchTerm: string) => {
  return useAppStore(state => {
    if (!searchTerm.trim()) return state.animals;
    
    const term = searchTerm.toLowerCase();
    return state.animals.filter(animal => 
      animal.name?.toLowerCase().includes(term) ||
      animal.identifier?.toLowerCase().includes(term) ||
      animal.cage?.toLowerCase().includes(term)
    );
  });
};