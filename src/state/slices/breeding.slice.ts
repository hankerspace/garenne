import { StateCreator } from 'zustand';
import { Breeding } from '../../models/types';
import { generateId, generateTimestamp } from '../../services/id.service';

export interface BreedingSlice {
  breedings: Breeding[];
  
  // Breeding actions
  addBreeding: (breeding: Omit<Breeding, 'id' | 'createdAt' | 'updatedAt'>) => Breeding;
  updateBreeding: (id: string, updates: Partial<Breeding>) => void;
  deleteBreeding: (id: string) => void;
  getBreedingById: (id: string) => Breeding | undefined;
  getBreedingsByAnimal: (animalId: string) => Breeding[];
}

export const createBreedingSlice: StateCreator<
  BreedingSlice & { saveData: () => void },
  [],
  [],
  BreedingSlice
> = (set, get) => ({
  breedings: [],

  // Breeding actions
  addBreeding: (breedingData) => {
    const now = generateTimestamp();
    const breeding: Breeding = {
      ...breedingData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => ({
      breedings: [...state.breedings, breeding],
    }));
    
    get().saveData();
    return breeding;
  },

  updateBreeding: (id, updates) => {
    set((state) => ({
      breedings: state.breedings.map(breeding =>
        breeding.id === id
          ? { ...breeding, ...updates, updatedAt: generateTimestamp() }
          : breeding
      ),
    }));
    get().saveData();
  },

  deleteBreeding: (id) => {
    set((state) => ({
      breedings: state.breedings.filter(breeding => breeding.id !== id),
    }));
    get().saveData();
  },

  // Selector helpers
  getBreedingById: (id) => {
    const state = get();
    return state.breedings.find(breeding => breeding.id === id);
  },

  getBreedingsByAnimal: (animalId) => {
    const state = get();
    return state.breedings.filter(breeding => 
      breeding.femaleId === animalId || breeding.maleId === animalId
    );
  },
});