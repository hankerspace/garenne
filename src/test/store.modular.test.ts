import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStoreModular } from '../state/store.modular';
import { Status, Sex, BreedingMethod } from '../models/types';
import { act, renderHook } from '@testing-library/react';

describe('Modular Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useAppStoreModular());
    act(() => {
      result.current.clearAllData();
    });
  });

  describe('Animals Slice', () => {
    it('should add an animal', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      act(() => {
        const animal = result.current.addAnimal({
          name: 'Test Rabbit',
          sex: Sex.Female,
          breed: 'Californian',
          birthDate: '2024-01-01',
          status: Status.Grow,
        });
        
        expect(animal.id).toBeDefined();
        expect(animal.name).toBe('Test Rabbit');
        expect(animal.createdAt).toBeDefined();
        expect(animal.updatedAt).toBeDefined();
      });
      
      expect(result.current.animals).toHaveLength(1);
      expect(result.current.animals[0].name).toBe('Test Rabbit');
    });

    it('should update an animal', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      let animalId: string;
      
      act(() => {
        const animal = result.current.addAnimal({
          name: 'Test Rabbit',
          sex: Sex.Female,
          breed: 'Californian',
          birthDate: '2024-01-01',
          status: Status.Grow,
        });
        animalId = animal.id;
      });
      
      act(() => {
        result.current.updateAnimal(animalId, { name: 'Updated Rabbit' });
      });
      
      expect(result.current.animals[0].name).toBe('Updated Rabbit');
    });

    it('should delete an animal', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      let animalId: string;
      
      act(() => {
        const animal = result.current.addAnimal({
          name: 'Test Rabbit',
          sex: Sex.Female,
          breed: 'Californian',
          birthDate: '2024-01-01',
          status: Status.Grow,
        });
        animalId = animal.id;
      });
      
      expect(result.current.animals).toHaveLength(1);
      
      act(() => {
        result.current.deleteAnimal(animalId);
      });
      
      expect(result.current.animals).toHaveLength(0);
    });

    it('should mark animal as consumed', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      let animalId: string;
      
      act(() => {
        const animal = result.current.addAnimal({
          name: 'Test Rabbit',
          sex: Sex.Female,
          breed: 'Californian',
          birthDate: '2024-01-01',
          status: Status.Grow,
        });
        animalId = animal.id;
      });
      
      act(() => {
        result.current.markAnimalConsumed(animalId, '2024-02-01', 2500);
      });
      
      const animal = result.current.animals[0];
      expect(animal.status).toBe(Status.Consumed);
      expect(animal.consumedDate).toBe('2024-02-01');
      expect(animal.consumedWeight).toBe(2500);
    });
  });

  describe('Breeding Slice', () => {
    it('should add a breeding', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      act(() => {
        const breeding = result.current.addBreeding({
          femaleId: 'female-1',
          maleId: 'male-1',
          method: BreedingMethod.Natural,
          date: '2024-01-01',
          expectedKindlingDate: '2024-02-01',
          diagnosis: 'UNKNOWN',
        });
        
        expect(breeding.id).toBeDefined();
        expect(breeding.femaleId).toBe('female-1');
        expect(breeding.createdAt).toBeDefined();
      });
      
      expect(result.current.breedings).toHaveLength(1);
    });

    it('should update a breeding', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      let breedingId: string;
      
      act(() => {
        const breeding = result.current.addBreeding({
          femaleId: 'female-1',
          maleId: 'male-1',
          method: BreedingMethod.Natural,
          date: '2024-01-01',
          expectedKindlingDate: '2024-02-01',
          diagnosis: 'UNKNOWN',
        });
        breedingId = breeding.id;
      });
      
      act(() => {
        result.current.updateBreeding(breedingId, { diagnosis: 'PREGNANT' });
      });
      
      expect(result.current.breedings[0].diagnosis).toBe('PREGNANT');
    });
  });

  describe('Settings Slice', () => {
    it('should update settings', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      act(() => {
        result.current.updateSettings({ theme: 'dark', enableQR: true });
      });
      
      expect(result.current.settings.theme).toBe('dark');
      expect(result.current.settings.enableQR).toBe(true);
    });

    it('should reset settings to defaults', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      act(() => {
        result.current.updateSettings({ theme: 'dark' });
      });
      
      expect(result.current.settings.theme).toBe('dark');
      
      act(() => {
        result.current.resetSettings();
      });
      
      expect(result.current.settings.theme).toBe('light');
    });
  });

  describe('Data Slice', () => {
    it('should clear all data', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      act(() => {
        result.current.addAnimal({
          name: 'Test Rabbit',
          sex: Sex.Female,
          breed: 'Californian',
          birthDate: '2024-01-01',
          status: Status.Grow,
        });
        
        result.current.addBreeding({
          femaleId: 'female-1',
          maleId: 'male-1',
          method: BreedingMethod.Natural,
          date: '2024-01-01',
          expectedKindlingDate: '2024-02-01',
          diagnosis: 'UNKNOWN',
        });
      });
      
      expect(result.current.animals).toHaveLength(1);
      expect(result.current.breedings).toHaveLength(1);
      
      act(() => {
        result.current.clearAllData();
      });
      
      expect(result.current.animals).toHaveLength(0);
      expect(result.current.breedings).toHaveLength(0);
    });

    it('should export data as JSON', () => {
      const { result } = renderHook(() => useAppStoreModular());
      
      act(() => {
        result.current.addAnimal({
          name: 'Test Rabbit',
          sex: Sex.Female,
          breed: 'Californian',
          birthDate: '2024-01-01',
          status: Status.Grow,
        });
      });
      
      const exportedData = result.current.exportData('json');
      const parsedData = JSON.parse(exportedData as string);
      
      expect(parsedData.animals).toHaveLength(1);
      expect(parsedData.animals[0].name).toBe('Test Rabbit');
    });
  });
});