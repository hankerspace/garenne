import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppState, Animal, Breeding, Litter, WeightRecord, Treatment, Mortality, Cage, Tag, PerformanceMetrics, Status } from '../models/types';
import { storageService } from '../services/storage.service';
import { generateId, generateTimestamp } from '../services/id.service';
import { createSeedData } from '../utils/seedData';

interface AppStore extends AppState {
  // Actions
  loadData: () => void;
  saveData: () => void;
  loadSeedData: () => void;
  
  // Animal actions
  addAnimal: (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => Animal;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  markAnimalConsumed: (id: string, consumedDate: string, consumedWeight?: number) => void;
  
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
  
  // Cage actions
  addCage: (cage: Omit<Cage, 'id' | 'createdAt' | 'updatedAt'>) => Cage;
  updateCage: (id: string, updates: Partial<Cage>) => void;
  deleteCage: (id: string) => void;
  
  // Tag actions
  addTag: (tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => Tag;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  // Performance metrics actions
  addPerformanceMetrics: (metrics: Omit<PerformanceMetrics, 'id' | 'createdAt' | 'updatedAt'>) => PerformanceMetrics;
  updatePerformanceMetrics: (id: string, updates: Partial<PerformanceMetrics>) => void;
  deletePerformanceMetrics: (id: string) => void;
  calculatePerformanceMetrics: (animalId: string, period: string) => void;
  
  // Settings actions
  updateSettings: (updates: Partial<AppState['settings']>) => void;
  
  // Export/Import actions
  exportData: (format?: 'json' | 'csv' | 'excel') => string | Blob;
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
    cages: [],
    tags: [],
    performanceMetrics: [],
    settings: {
      theme: 'light',
      weightUnit: 'g',
      enableQR: false,
      locale: 'fr-FR',
      schemaVersion: 2, // Incremented for new features
      gestationDuration: 31,
      weaningDuration: 28,
      reproductionReadyDuration: 90,
      slaughterReadyDuration: 70,
      exportFormat: 'json',
      includeImages: false,
    },

    // Load data from storage
    loadData: () => {
      const data = storageService.load();
      set(data);
    },

    // Save data to storage
    saveData: () => {
      const state = get();
      const { loadData: _loadData, saveData: _saveData, loadSeedData: _loadSeedData, ...dataToSave } = state;
      storageService.save(dataToSave);
    },

    // Load seed data for testing
    loadSeedData: () => {
      const seedData = createSeedData();
      set(seedData);
      get().saveData();
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

    // Cage actions
    addCage: (cageData) => {
      const now = generateTimestamp();
      const cage: Cage = {
        ...cageData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        cages: [...state.cages, cage],
      }));
      
      get().saveData();
      return cage;
    },

    updateCage: (id, updates) => {
      set((state) => ({
        cages: state.cages.map(cage =>
          cage.id === id
            ? { ...cage, ...updates, updatedAt: generateTimestamp() }
            : cage
        ),
      }));
      get().saveData();
    },

    deleteCage: (id) => {
      set((state) => ({
        cages: state.cages.filter(cage => cage.id !== id),
        // Update animals to remove cage reference
        animals: state.animals.map(animal =>
          animal.cage === id ? { ...animal, cage: undefined, updatedAt: generateTimestamp() } : animal
        ),
      }));
      get().saveData();
    },

    // Tag actions
    addTag: (tagData) => {
      const now = generateTimestamp();
      const tag: Tag = {
        ...tagData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        tags: [...state.tags, tag],
      }));
      
      get().saveData();
      return tag;
    },

    updateTag: (id, updates) => {
      set((state) => ({
        tags: state.tags.map(tag =>
          tag.id === id
            ? { ...tag, ...updates, updatedAt: generateTimestamp() }
            : tag
        ),
      }));
      get().saveData();
    },

    deleteTag: (id) => {
      set((state) => ({
        tags: state.tags.filter(tag => tag.id !== id),
        // Remove tag from animals
        animals: state.animals.map(animal => ({
          ...animal,
          tags: animal.tags?.filter(tagId => tagId !== id),
          updatedAt: generateTimestamp()
        })),
      }));
      get().saveData();
    },

    // Performance metrics actions
    addPerformanceMetrics: (metricsData) => {
      const now = generateTimestamp();
      const metrics: PerformanceMetrics = {
        ...metricsData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        performanceMetrics: [...state.performanceMetrics, metrics],
      }));
      
      get().saveData();
      return metrics;
    },

    updatePerformanceMetrics: (id, updates) => {
      set((state) => ({
        performanceMetrics: state.performanceMetrics.map(metrics =>
          metrics.id === id
            ? { ...metrics, ...updates, updatedAt: generateTimestamp() }
            : metrics
        ),
      }));
      get().saveData();
    },

    deletePerformanceMetrics: (id) => {
      set((state) => ({
        performanceMetrics: state.performanceMetrics.filter(metrics => metrics.id !== id),
      }));
      get().saveData();
    },

    calculatePerformanceMetrics: (animalId, period) => {
      const state = get();
      const animal = state.animals.find(a => a.id === animalId);
      if (!animal) return;

      // Calculate metrics for the given period
      const litters = state.litters.filter(l => 
        l.motherId === animalId && 
        l.kindlingDate.startsWith(period)
      );

      const totalLitters = litters.length;
      const totalOffspring = litters.reduce((sum, l) => sum + l.bornAlive, 0);
      const survivingOffspring = litters.reduce((sum, l) => sum + (l.weanedCount || 0), 0);
      const averageLitterSize = totalLitters > 0 ? totalOffspring / totalLitters : 0;
      const survivalRate = totalOffspring > 0 ? survivingOffspring / totalOffspring : 0;

      // Get weights for offspring at weaning
      const offspringWeights = state.weights.filter(w => {
        const animal = state.animals.find(a => a.id === w.animalId);
        return animal && (animal.motherId === animalId || animal.fatherId === animalId);
      });

      const averageWeightAtWeaning = offspringWeights.length > 0
        ? offspringWeights.reduce((sum, w) => sum + w.weightGrams, 0) / offspringWeights.length
        : 0;

      const reproductionEfficiency = survivalRate * averageLitterSize;

      const existingMetrics = state.performanceMetrics.find(pm => 
        pm.animalId === animalId && pm.period === period
      );

      const metricsData = {
        animalId,
        period,
        totalLitters,
        totalOffspring,
        survivingOffspring,
        averageLitterSize,
        survivalRate,
        averageWeightAtWeaning,
        reproductionEfficiency,
      };

      if (existingMetrics) {
        get().updatePerformanceMetrics(existingMetrics.id, metricsData);
      } else {
        get().addPerformanceMetrics(metricsData);
      }
    },

    // Export actions
    exportData: (format = 'json') => {
      const state = get();
      const { loadData: _loadData, saveData: _saveData, loadSeedData: _loadSeedData, exportData: _exportData, ...dataToExport } = state;
      
      if (format === 'json') {
        return JSON.stringify(dataToExport, null, 2);
      }
      
      // For CSV and Excel, we'll return a string for now
      // In a real implementation, you'd use the ExportService
      return JSON.stringify(dataToExport, null, 2);
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
        cages: [],
        tags: [],
        performanceMetrics: [],
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