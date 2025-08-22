import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../state/store';
import { Sex, Status } from '../models/types';

describe('HealthLog Store Actions', () => {
  // Reset store before each test
  beforeEach(() => {
    useAppStore.getState().clearAllData();
  });

  it('should add a health log correctly', () => {
    const { addAnimal, addHealthLog } = useAppStore.getState();

    const animal = addAnimal({
      sex: Sex.Male,
      status: Status.Grow,
    });

    const healthLogData = {
      animalId: animal.id,
      date: '2024-01-01',
      observation: 'Diarrhée',
      notes: 'Selles liquides',
    };

    const newLog = addHealthLog(healthLogData);

    expect(newLog.id).toBeDefined();
    expect(newLog.observation).toBe('Diarrhée');
    expect(newLog.notes).toBe('Selles liquides');
    expect(useAppStore.getState().healthLogs).toHaveLength(1);
    expect(useAppStore.getState().healthLogs[0]).toEqual(newLog);
  });

  it('should update a health log correctly', () => {
    const { addAnimal, addHealthLog, updateHealthLog } = useAppStore.getState();

    const animal = addAnimal({ sex: Sex.Female, status: Status.Reproducer });
    const log = addHealthLog({
      animalId: animal.id,
      date: '2024-02-10',
      observation: 'Bon appétit',
    });

    const updates = {
      observation: 'Très bon appétit',
      notes: 'Mange toute sa ration',
    };

    updateHealthLog(log.id, updates);

    const updatedLog = useAppStore.getState().healthLogs[0];
    expect(updatedLog.observation).toBe('Très bon appétit');
    expect(updatedLog.notes).toBe('Mange toute sa ration');
    // Note: updatedAt can be equal when operations happen within the same millisecond in tests.
    expect(typeof updatedLog.updatedAt).toBe('string');
  });

  it('should delete a health log correctly', () => {
    const { addAnimal, addHealthLog, deleteHealthLog } = useAppStore.getState();

    const animal = addAnimal({ sex: Sex.Male, status: Status.Grow });
    const log1 = addHealthLog({ animalId: animal.id, date: '2024-03-15', observation: 'Boiterie' });
    const log2 = addHealthLog({ animalId: animal.id, date: '2024-03-16', observation: 'Amélioration' });

    expect(useAppStore.getState().healthLogs).toHaveLength(2);

    deleteHealthLog(log1.id);

    expect(useAppStore.getState().healthLogs).toHaveLength(1);
    expect(useAppStore.getState().healthLogs[0].id).toBe(log2.id);
  });

  it('should delete health logs when an animal is deleted', () => {
    const { addAnimal, addHealthLog, deleteAnimal } = useAppStore.getState();

    const animal1 = addAnimal({ sex: Sex.Male, status: Status.Grow });
    const animal2 = addAnimal({ sex: Sex.Female, status: Status.Grow });

    addHealthLog({ animalId: animal1.id, date: '2024-04-01', observation: 'Observation 1' });
    addHealthLog({ animalId: animal2.id, date: '2024-04-02', observation: 'Observation 2' });

    expect(useAppStore.getState().healthLogs).toHaveLength(2);

    deleteAnimal(animal1.id);

    expect(useAppStore.getState().healthLogs).toHaveLength(1);
    expect(useAppStore.getState().healthLogs[0].animalId).toBe(animal2.id);
  });
});
