import { StateCreator } from 'zustand';
import { Animal, Status, Sex } from '../../models/types';
import { generateId, generateTimestamp } from '../../services/id.service';

export interface AnimalsSlice {
  animals: Animal[];
  
  // Animal actions
  addAnimal: (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => Animal;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  markAnimalConsumed: (id: string, consumedDate: string, consumedWeight?: number) => void;
  getAnimalById: (id: string) => Animal | undefined;
  getAnimalsByStatus: (status: Status) => Animal[];
}

export const createAnimalsSlice: StateCreator<
  AnimalsSlice & { saveData: () => void },
  [],
  [],
  AnimalsSlice
> = (set, get) => ({
  animals: [],

  // Animal actions
  addAnimal: (animalData) => {
    const now = generateTimestamp();
    const animal: Animal = {
      ...animalData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => ({
      animals: [...state.animals, animal],
    }));
    
    get().saveData();
    return animal;
  },

  updateAnimal: (id, updates) => {
    set((state) => ({
      animals: state.animals.map(animal =>
        animal.id === id
          ? { ...animal, ...updates, updatedAt: generateTimestamp() }
          : animal
      ),
    }));
    get().saveData();
  },

  deleteAnimal: (id) => {
    set((state) => ({
      animals: state.animals.filter(animal => animal.id !== id),
    }));
    get().saveData();
  },

  markAnimalConsumed: (id, consumedDate, consumedWeight) => {
    set((state) => ({
      animals: state.animals.map(animal =>
        animal.id === id
          ? { 
              ...animal, 
              status: Status.Consumed, 
              consumedDate, 
              consumedWeight,
              updatedAt: generateTimestamp() 
            }
          : animal
      ),
    }));
    get().saveData();
  },

  // Selector helpers
  getAnimalById: (id) => {
    const state = get();
    return state.animals.find(animal => animal.id === id);
  },

  getAnimalsByStatus: (status) => {
    const state = get();
    return state.animals.filter(animal => animal.status === status);
  },
});