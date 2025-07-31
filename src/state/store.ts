import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppState, Animal, Breeding, Litter, WeightRecord, Treatment, Mortality, Status } from '../models/types';
import { storageService } from '../services/storage.service';
import { generateId, generateTimestamp } from '../services/id.service';

interface AppStore extends AppState {
  // Actions
  loadData: () => void;
  saveData: () => void;
  
  // Animal actions
  addAnimal: (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => Animal;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  
  // Breeding actions
  addBreeding: (breeding: Omit<Breeding, 'id' | 'createdAt' | 'updatedAt'>) => Breeding;
  updateBreeding: (id: string, updates: Partial<Breeding>) => void;
  deleteBreeding: (id: string) => void;
  
  // Litter actions
  addLitter: (litter: Omit<Litter, 'id' | 'createdAt' | 'updatedAt'>) => Litter;
  updateLitter: (id: string, updates: Partial<Litter>) => void;
  deleteLitter: (id: string) => void;
  
  // Weight actions
  addWeight: (weight: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt'>) => WeightRecord;
  updateWeight: (id: string, updates: Partial<WeightRecord>) => void;
  deleteWeight: (id: string) => void;
  
  // Treatment actions
  addTreatment: (treatment: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>) => Treatment;
  updateTreatment: (id: string, updates: Partial<Treatment>) => void;
  deleteTreatment: (id: string) => void;
  
  // Mortality actions
  addMortality: (mortality: Omit<Mortality, 'id' | 'createdAt' | 'updatedAt'>) => Mortality;
  updateMortality: (id: string, updates: Partial<Mortality>) => void;
  deleteMortality: (id: string) => void;
  
  // Settings actions
  updateSettings: (updates: Partial<AppState['settings']>) => void;
  
  // Bulk actions
  importData: (data: AppState) => void;
  clearAllData: () => void;
}

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    animals: [],
    breedings: [],
    litters: [],
    weights: [],
    treatments: [],
    mortalities: [],
    settings: {
      theme: 'light',
      weightUnit: 'g',
      enableQR: false,
      locale: 'fr-FR',
      schemaVersion: 1,
    },

    // Load data from storage
    loadData: () => {
      const data = storageService.load();
      set(data);
    },

    // Save data to storage
    saveData: () => {
      const state = get();
      const { loadData, saveData, ...dataToSave } = state;
      storageService.save(dataToSave);
    },

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
        // Also remove related records
        breedings: state.breedings.filter(b => b.femaleId !== id && b.maleId !== id),
        litters: state.litters.filter(l => l.motherId !== id && l.fatherId !== id),
        weights: state.weights.filter(w => w.animalId !== id),
        treatments: state.treatments.filter(t => t.animalId !== id),
        mortalities: state.mortalities.filter(m => m.animalId !== id),
      }));
      get().saveData();
    },

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

    // Litter actions
    addLitter: (litterData) => {
      const now = generateTimestamp();
      const litter: Litter = {
        ...litterData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        litters: [...state.litters, litter],
      }));
      
      get().saveData();
      return litter;
    },

    updateLitter: (id, updates) => {
      set((state) => ({
        litters: state.litters.map(litter =>
          litter.id === id
            ? { ...litter, ...updates, updatedAt: generateTimestamp() }
            : litter
        ),
      }));
      get().saveData();
    },

    deleteLitter: (id) => {
      set((state) => ({
        litters: state.litters.filter(litter => litter.id !== id),
      }));
      get().saveData();
    },

    // Weight actions
    addWeight: (weightData) => {
      const now = generateTimestamp();
      const weight: WeightRecord = {
        ...weightData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        weights: [...state.weights, weight],
      }));
      
      get().saveData();
      return weight;
    },

    updateWeight: (id, updates) => {
      set((state) => ({
        weights: state.weights.map(weight =>
          weight.id === id
            ? { ...weight, ...updates, updatedAt: generateTimestamp() }
            : weight
        ),
      }));
      get().saveData();
    },

    deleteWeight: (id) => {
      set((state) => ({
        weights: state.weights.filter(weight => weight.id !== id),
      }));
      get().saveData();
    },

    // Treatment actions
    addTreatment: (treatmentData) => {
      const now = generateTimestamp();
      const treatment: Treatment = {
        ...treatmentData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        treatments: [...state.treatments, treatment],
      }));
      
      get().saveData();
      return treatment;
    },

    updateTreatment: (id, updates) => {
      set((state) => ({
        treatments: state.treatments.map(treatment =>
          treatment.id === id
            ? { ...treatment, ...updates, updatedAt: generateTimestamp() }
            : treatment
        ),
      }));
      get().saveData();
    },

    deleteTreatment: (id) => {
      set((state) => ({
        treatments: state.treatments.filter(treatment => treatment.id !== id),
      }));
      get().saveData();
    },

    // Mortality actions
    addMortality: (mortalityData) => {
      const now = generateTimestamp();
      const mortality: Mortality = {
        ...mortalityData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      // Mark animal as deceased
      const { animals } = get();
      const animal = animals.find(a => a.id === mortalityData.animalId);
      if (animal) {
        get().updateAnimal(animal.id, { status: Status.Deceased });
      }
      
      set((state) => ({
        mortalities: [...state.mortalities, mortality],
      }));
      
      get().saveData();
      return mortality;
    },

    updateMortality: (id, updates) => {
      set((state) => ({
        mortalities: state.mortalities.map(mortality =>
          mortality.id === id
            ? { ...mortality, ...updates, updatedAt: generateTimestamp() }
            : mortality
        ),
      }));
      get().saveData();
    },

    deleteMortality: (id) => {
      set((state) => ({
        mortalities: state.mortalities.filter(mortality => mortality.id !== id),
      }));
      get().saveData();
    },

    // Settings actions
    updateSettings: (updates) => {
      set((state) => ({
        settings: { ...state.settings, ...updates },
      }));
      get().saveData();
    },

    // Bulk actions
    importData: (data) => {
      set(data);
      get().saveData();
    },

    clearAllData: () => {
      set({
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
      });
      get().saveData();
    },
  }))
);

// Auto-save subscription
useAppStore.subscribe(
  (state) => state,
  () => {
    // Auto-save is handled by individual actions
  }
);