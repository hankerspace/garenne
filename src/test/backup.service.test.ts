import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalBackupService, backupService } from '../services/backup.service';
import { AppState, BackupFile, Sex, Status } from '../models/types';
import { saveAs } from 'file-saver';

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

// Mock date formatting
vi.mock('../utils/dates', () => ({
  formatDate: vi.fn(() => '20241201-1430'),
}));

describe('LocalBackupService', () => {
  let service: LocalBackupService;
  let mockAppState: AppState;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LocalBackupService();
    
    mockAppState = {
      animals: [
        {
          id: 'animal1',
          name: 'Test Rabbit',
          sex: Sex.Male,
          birthDate: '2023-01-01',
          identifier: 'TR001',
          breed: 'Test Breed',
          status: Status.Grow,
          origin: 'BORN_HERE',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        }
      ],
      breedings: [],
      litters: [],
      weights: [],
      treatments: [],
      healthLogs: [],
      mortalities: [],
      cages: [],
      tags: [],
      performanceMetrics: [],
      goals: [],
      goalAchievements: [],
      settings: {
        schemaVersion: 1,
        theme: 'light',
        weightUnit: 'g',
        enableQR: true,
        locale: 'fr-FR',
        gestationDuration: 31,
        weaningDuration: 28,
        reproductionReadyDuration: 120,
        slaughterReadyDuration: 70,
        exportFormat: 'json',
        includeImages: false,
      },
    };
  });

  describe('exportData', () => {
    it('should export data correctly', () => {
      // Mock Date.now() to ensure consistent timestamp
      const mockDate = '2024-12-01T14:30:00.000Z';
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

      service.exportData(mockAppState);

      expect(saveAs).toHaveBeenCalledTimes(1);
      
      const call = (saveAs as any).mock.calls[0];
      const blob = call[0];
      const filename = call[1];

      expect(filename).toBe('backup-20241201-1430.json');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });

    it('should include all required fields in backup', () => {
      const mockDate = '2024-12-01T14:30:00.000Z';
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

      service.exportData(mockAppState);

      const call = (saveAs as any).mock.calls[0];
      const blob = call[0];

      // Read blob content
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const content = JSON.parse(reader.result as string);
          
          expect(content).toHaveProperty('schemaVersion', 1);
          expect(content).toHaveProperty('exportedAt', mockDate);
          expect(content).toHaveProperty('animals');
          expect(content).toHaveProperty('breedings');
          expect(content).toHaveProperty('litters');
          expect(content).toHaveProperty('weights');
          expect(content).toHaveProperty('treatments');
          expect(content).toHaveProperty('mortalities');
          expect(content).toHaveProperty('cages');
          expect(content).toHaveProperty('tags');
          expect(content).toHaveProperty('performanceMetrics');
          expect(content).toHaveProperty('settings');
          
          resolve(undefined);
        };
        reader.readAsText(blob);
      });
    });
  });

  describe('importData', () => {
    it('should import valid backup file', async () => {
      const validBackupData = {
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        settings: mockAppState.settings,
      };

      const file = new File([JSON.stringify(validBackupData)], 'backup.json', {
        type: 'application/json',
      });

      const result = await service.importData(file);

      expect(result).toEqual(validBackupData);
    });

    it('should reject invalid JSON file', async () => {
      const file = new File(['invalid json'], 'backup.json', {
        type: 'application/json',
      });

      await expect(service.importData(file)).rejects.toThrow(
        'Fichier de sauvegarde invalide'
      );
    });

    it('should reject file with invalid structure', async () => {
      const invalidData = { invalid: 'data' };
      const file = new File([JSON.stringify(invalidData)], 'backup.json', {
        type: 'application/json',
      });

      await expect(service.importData(file)).rejects.toThrow(
        'Fichier de sauvegarde invalide'
      );
    });
  });

  describe('validateBackupFile', () => {
    it('should validate correct backup file', () => {
      const validData = {
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        settings: {},
      };

      expect(() => service.validateBackupFile(validData)).not.toThrow();
    });

    it('should throw error for null data', () => {
      expect(() => service.validateBackupFile(null)).toThrow('Format de fichier invalide');
    });

    it('should throw error for missing required fields', () => {
      const invalidData = { schemaVersion: 1 };
      expect(() => service.validateBackupFile(invalidData)).toThrow('Champ manquant');
    });

    it('should throw error for invalid schema version', () => {
      const invalidData = {
        schemaVersion: 0,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        settings: {},
      };

      expect(() => service.validateBackupFile(invalidData)).toThrow('Version de schéma invalide');
    });

    it('should throw error for non-array fields', () => {
      const invalidData = {
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: 'not an array',
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        settings: {},
      };

      expect(() => service.validateBackupFile(invalidData)).toThrow('animals doit être un tableau');
    });

    it('should throw error for invalid export date', () => {
      const invalidData = {
        schemaVersion: 1,
        exportedAt: 'invalid date',
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        settings: {},
      };

      expect(() => service.validateBackupFile(invalidData)).toThrow('Date d\'export invalide');
    });
  });

  describe('generateImportSummary', () => {
    it('should generate correct import summary', () => {
      const backupData: BackupFile = {
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [mockAppState.animals[0]],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        settings: mockAppState.settings,
      };

      const summary = service.generateImportSummary(backupData, mockAppState);

      expect(summary).toEqual({
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        counts: {
          animals: 1,
          breedings: 0,
          litters: 0,
          weights: 0,
          treatments: 0,
          mortalities: 0,
        },
        currentCounts: {
          animals: 1,
          breedings: 0,
          litters: 0,
          weights: 0,
          treatments: 0,
          mortalities: 0,
        },
        canImport: true,
      });
    });

    it('should indicate when import is not possible', () => {
      const backupData: BackupFile = {
        schemaVersion: 2, // Higher than current
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        settings: mockAppState.settings,
      };

      const summary = service.generateImportSummary(backupData, mockAppState);

      expect(summary.canImport).toBe(false);
    });
  });

  describe('mergeData', () => {
    it('should merge backup data with current state', () => {
      const newAnimal = {
        id: 'animal2',
        name: 'New Rabbit',
        sex: Sex.Female,
        birthDate: '2023-02-01',
        identifier: 'TR002',
        breed: 'Test Breed',
        status: Status.Grow,
        origin: 'PURCHASED' as const,
        createdAt: '2023-02-01T00:00:00.000Z',
        updatedAt: '2023-02-01T00:00:00.000Z',
      };

      const backupData: BackupFile = {
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [newAnimal],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        settings: mockAppState.settings,
      };

      const merged = service.mergeData(backupData, mockAppState);

      expect(merged.animals).toHaveLength(2);
      expect(merged.animals.map(a => a.id)).toContain('animal1');
      expect(merged.animals.map(a => a.id)).toContain('animal2');
    });

    it('should handle missing arrays in backup data', () => {
      const backupData: BackupFile = {
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        settings: mockAppState.settings,
      };

      const merged = service.mergeData(backupData, mockAppState);

      expect(merged.cages).toEqual([]);
      expect(merged.tags).toEqual([]);
      expect(merged.performanceMetrics).toEqual([]);
      expect(merged.goals).toEqual([]);
      expect(merged.goalAchievements).toEqual([]);
    });
  });

  describe('replaceData', () => {
    it('should replace all data with backup data', () => {
      const backupData: BackupFile = {
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        settings: mockAppState.settings,
      };

      const replaced = service.replaceData(backupData);

      expect(replaced.animals).toEqual([]);
      expect(replaced.settings).toEqual(mockAppState.settings);
    });

    it('should handle missing arrays with defaults', () => {
      const backupData: BackupFile = {
        schemaVersion: 1,
        exportedAt: '2024-12-01T14:30:00.000Z',
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        settings: mockAppState.settings,
      };

      const replaced = service.replaceData(backupData);

      expect(replaced.cages).toEqual([]);
      expect(replaced.tags).toEqual([]);
      expect(replaced.performanceMetrics).toEqual([]);
      expect(replaced.goals).toEqual([]);
      expect(replaced.goalAchievements).toEqual([]);
    });
  });

  describe('singleton instance', () => {
    it('should provide a global instance', () => {
      expect(backupService).toBeInstanceOf(LocalBackupService);
    });
  });
});