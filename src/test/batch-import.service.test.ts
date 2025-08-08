import { describe, it, expect, beforeEach } from 'vitest';
import { BatchImportService } from '../services/batch-import.service';
import { Animal, Sex, Status } from '../models/types';

describe('BatchImportService', () => {
  let existingAnimals: Animal[];

  beforeEach(() => {
    existingAnimals = [
      {
        id: 'existing-1',
        name: 'Existing Rabbit',
        identifier: 'EX001',
        sex: Sex.Female,
        status: Status.Reproducer,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }
    ];
  });

  describe('parseCSV', () => {
    it('should parse valid CSV content', () => {
      const csvContent = `name,identifier,sex,status
Rabbit 1,R001,M,GROW
Rabbit 2,R002,F,REPRO`;

      const result = BatchImportService.parseCSV(csvContent);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'Rabbit 1',
        identifier: 'R001',
        sex: 'M',
        status: 'GROW',
      });
      expect(result[1]).toEqual({
        name: 'Rabbit 2',
        identifier: 'R002',
        sex: 'F',
        status: 'REPRO',
      });
    });

    it('should handle quoted CSV values', () => {
      const csvContent = `name,identifier,notes
"Rabbit, Special",R001,"Notes with, comma"`;

      const result = BatchImportService.parseCSV(csvContent);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: 'Rabbit, Special',
        identifier: 'R001',
        notes: 'Notes with, comma',
      });
    });

    it('should throw error for empty CSV', () => {
      expect(() => BatchImportService.parseCSV('')).toThrow();
    });

    it('should throw error for CSV with only headers', () => {
      expect(() => BatchImportService.parseCSV('name,identifier')).toThrow();
    });
  });

  describe('validateImport', () => {
    it('should validate correct data', () => {
      const rows = [
        {
          name: 'New Rabbit',
          identifier: 'NR001',
          sex: Sex.Male,
          status: Status.Grow,
        }
      ];

      const result = BatchImportService.validateImport(rows, existingAnimals, {
        duplicateHandling: 'skip',
        validateRelationships: false,
      });

      expect(result.totalRows).toBe(1);
      expect(result.validRows).toBe(1);
      expect(result.errors).toHaveLength(0);
      expect(result.preview.animals).toHaveLength(1);
    });

    it('should detect validation errors', () => {
      const rows = [
        {
          name: '', // Empty name
          identifier: '',
          sex: 'INVALID_SEX',
          status: 'INVALID_STATUS',
        }
      ];

      const result = BatchImportService.validateImport(rows, existingAnimals, {
        duplicateHandling: 'error',
        validateRelationships: false,
      });

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.validRows).toBe(0);
    });

    it('should detect duplicates by identifier', () => {
      const rows = [
        {
          name: 'Duplicate Rabbit',
          identifier: 'EX001', // Same as existing
          sex: Sex.Male,
          status: Status.Grow,
        }
      ];

      const result = BatchImportService.validateImport(rows, existingAnimals, {
        duplicateHandling: 'error',
        validateRelationships: false,
      });

      expect(result.errors.some(e => e.field === 'identifier')).toBe(true);
      expect(result.duplicates.byIdentifier).toHaveLength(1);
    });

    it('should handle duplicate with skip option', () => {
      const rows = [
        {
          name: 'Duplicate Rabbit',
          identifier: 'EX001',
          sex: Sex.Male,
          status: Status.Grow,
        }
      ];

      const result = BatchImportService.validateImport(rows, existingAnimals, {
        duplicateHandling: 'skip',
        validateRelationships: false,
      });

      expect(result.warnings.some(w => w.field === 'identifier')).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should validate birth date format', () => {
      const rows = [
        {
          name: 'Test Rabbit',
          identifier: 'TR001',
          sex: Sex.Male,
          status: Status.Grow,
          birthDate: 'invalid-date',
        }
      ];

      const result = BatchImportService.validateImport(rows, existingAnimals, {
        duplicateHandling: 'skip',
        validateRelationships: false,
      });

      expect(result.errors.some(e => e.field === 'birthDate')).toBe(true);
    });
  });

  describe('executeImport', () => {
    it('should execute import with valid preview', () => {
      const preview = {
        totalRows: 1,
        validRows: 1,
        errors: [],
        warnings: [],
        preview: {
          animals: [{
            id: 'new-1',
            name: 'New Rabbit',
            identifier: 'NR001',
            sex: Sex.Male,
            status: Status.Grow,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          }],
          weights: [],
          treatments: [],
          breedings: [],
          litters: [],
          mortalities: [],
        },
        duplicates: {
          byIdentifier: [],
          byName: [],
        },
      };

      const result = BatchImportService.executeImport(preview, existingAnimals, {
        duplicateHandling: 'skip',
        addTags: ['imported'],
      });

      expect(result.success).toBe(true);
      expect(result.imported.animals).toBe(1);
      expect(result.duplicatesHandled.skipped).toBe(0);
    });

    it('should handle duplicates during execution', () => {
      const preview = {
        totalRows: 1,
        validRows: 1,
        errors: [],
        warnings: [],
        preview: {
          animals: [{
            id: 'new-1',
            name: 'Duplicate',
            identifier: 'EX001', // Same as existing
            sex: Sex.Male,
            status: Status.Grow,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          }],
          weights: [],
          treatments: [],
          breedings: [],
          litters: [],
          mortalities: [],
        },
        duplicates: {
          byIdentifier: [],
          byName: [],
        },
      };

      const result = BatchImportService.executeImport(preview, existingAnimals, {
        duplicateHandling: 'skip',
        addTags: [],
      });

      expect(result.duplicatesHandled.skipped).toBe(1);
      expect(result.imported.animals).toBe(0);
    });
  });

  describe('generateTemplate', () => {
    it('should generate CSV template', () => {
      const template = BatchImportService.generateTemplate();

      expect(template).toContain('name,identifier,sex');
      expect(template).toContain('Lapin Example');
      expect(template.split('\n')).toHaveLength(3);
    });
  });
});