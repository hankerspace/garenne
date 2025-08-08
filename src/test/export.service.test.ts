import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExportService } from '../services/export.service';
import { AppState, Animal, WeightRecord, Litter, Treatment, Cage, Tag, Status, Sex } from '../models/types';

// Mock I18nService
vi.mock('../services/i18n.service', () => ({
  I18nService: {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'export.animals': 'Animals',
        'export.weights': 'Weights',
        'export.litters': 'Litters',
        'export.treatments': 'Treatments',
        'export.cages': 'Cages',
        'export.tags': 'Tags',
        'export.headers.id': 'ID',
        'export.headers.name': 'Name',
        'export.headers.identifier': 'Identifier',
        'export.headers.sex': 'Sex',
        'export.headers.breed': 'Breed',
        'export.headers.birthDate': 'Birth Date',
        'export.headers.origin': 'Origin',
        'export.headers.motherId': 'Mother ID',
        'export.headers.fatherId': 'Father ID',
        'export.headers.cage': 'Cage',
        'export.headers.status': 'Status',
        'export.headers.tags': 'Tags',
        'export.headers.consumedDate': 'Consumed Date',
        'export.headers.consumedWeight': 'Consumed Weight',
        'export.headers.notes': 'Notes',
        'export.headers.animalId': 'Animal ID',
        'export.headers.date': 'Date',
        'export.headers.weight': 'Weight',
        'export.headers.kindlingDate': 'Kindling Date',
        'export.headers.bornAlive': 'Born Alive',
        'export.headers.stillborn': 'Stillborn',
        'export.headers.weaningDate': 'Weaning Date',
        'export.headers.weanedCount': 'Weaned Count',
        'export.headers.product': 'Product',
        'export.headers.lotNumber': 'Lot Number',
        'export.headers.dose': 'Dose',
        'export.headers.route': 'Route',
        'export.headers.reason': 'Reason',
        'export.headers.withdrawalUntil': 'Withdrawal Until',
        'export.headers.description': 'Description',
        'export.headers.capacity': 'Capacity',
        'export.headers.location': 'Location',
        'export.headers.color': 'Color'
      };
      return translations[key] || key;
    }
  }
}));

describe('ExportService', () => {
  let sampleAppState: AppState;
  let sampleAnimal: Animal;
  let sampleWeight: WeightRecord;
  let sampleLitter: Litter;
  let sampleTreatment: Treatment;
  let sampleCage: Cage;
  let sampleTag: Tag;

  beforeEach(() => {
    sampleAnimal = {
      id: 'animal-1',
      name: 'Test Rabbit',
      identifier: 'TR001',
      sex: Sex.Female,
      breed: 'New Zealand White',
      birthDate: '2024-01-15',
      origin: 'BORN_HERE',
      status: Status.Reproducer,
      cage: 'cage-1',
      tags: ['tag-1', 'tag-2'],
      consumedDate: '2024-12-01',
      consumedWeight: 2500,
      notes: 'Test notes',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    sampleWeight = {
      id: 'weight-1',
      animalId: 'animal-1',
      date: '2024-01-20',
      weightGrams: 1500,
      notes: 'Weight notes',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    sampleLitter = {
      id: 'litter-1',
      motherId: 'animal-1',
      fatherId: 'animal-2',
      kindlingDate: '2024-02-01',
      bornAlive: 8,
      stillborn: 1,
      weaningDate: '2024-03-01',
      weanedCount: 7,
      notes: 'Litter notes',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    sampleTreatment = {
      id: 'treatment-1',
      animalId: 'animal-1',
      date: '2024-01-25',
      product: 'Antibiotic',
      lotNumber: 'LOT123',
      dose: '5ml',
      route: 'Oral',
      reason: 'Infection',
      withdrawalUntil: '2024-02-05',
      notes: 'Treatment notes',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    sampleCage = {
      id: 'cage-1',
      name: 'Cage A1',
      description: 'Large breeding cage',
      capacity: 2,
      location: 'Block A',
      notes: 'Cage notes'
    };

    sampleTag = {
      id: 'tag-1',
      name: 'Breeding Stock',
      color: '#FF5722',
      description: 'Animals for breeding'
    };

    sampleAppState = {
      animals: [sampleAnimal],
      weights: [sampleWeight],
      litters: [sampleLitter],
      treatments: [sampleTreatment],
      cages: [sampleCage],
      tags: [sampleTag],
      breedings: [],
      mortalities: [],
      performanceMetrics: [],
      settings: {
        theme: 'light',
        gestationDuration: 31,
        weaningAge: 28,
        reproductionRestDays: 42,
        slaughterAge: 84
      }
    };
  });

  describe('exportToJSON', () => {
    it('should export app state to formatted JSON string', () => {
      const result = ExportService.exportToJSON(sampleAppState);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(() => JSON.parse(result)).not.toThrow();
      
      const parsed = JSON.parse(result);
      expect(parsed).toEqual(sampleAppState);
      expect(result).toContain('"animals"');
      expect(result).toContain('"weights"');
      expect(result).toContain('"litters"');
    });

    it('should handle empty app state', () => {
      const emptyState: AppState = {
        animals: [],
        weights: [],
        litters: [],
        treatments: [],
        cages: [],
        tags: [],
        breedings: [],
        mortalities: [],
        performanceMetrics: [],
        settings: {
          theme: 'light',
          gestationDuration: 31,
          weaningAge: 28,
          reproductionRestDays: 42,
          slaughterAge: 84
        }
      };

      const result = ExportService.exportToJSON(emptyState);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual(emptyState);
      expect(parsed.animals).toHaveLength(0);
    });
  });

  describe('exportToCSV', () => {
    it('should export app state to CSV format with all sections', () => {
      const result = ExportService.exportToCSV(sampleAppState);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      
      // Check that all sections are present
      expect(result).toContain('=== Animals ===');
      expect(result).toContain('=== Weights ===');
      expect(result).toContain('=== Litters ===');
      expect(result).toContain('=== Treatments ===');
      expect(result).toContain('=== Cages ===');
      expect(result).toContain('=== Tags ===');
      
      // Check headers
      expect(result).toContain('ID,Name,Identifier,Sex,Breed');
      expect(result).toContain('ID,Animal ID,Date,Weight,Notes');
      
      // Check data
      expect(result).toContain('"animal-1"');
      expect(result).toContain('"Test Rabbit"');
      expect(result).toContain('"TR001"');
    });

    it('should handle quotes in data by escaping them', () => {
      const animalWithQuotes = {
        ...sampleAnimal,
        name: 'Test "Special" Rabbit',
        notes: 'Notes with "quotes" inside'
      };
      
      const stateWithQuotes = {
        ...sampleAppState,
        animals: [animalWithQuotes]
      };

      const result = ExportService.exportToCSV(stateWithQuotes);
      
      expect(result).toContain('"Test ""Special"" Rabbit"');
      expect(result).toContain('"Notes with ""quotes"" inside"');
    });

    it('should handle empty arrays by omitting sections', () => {
      const emptyState: AppState = {
        animals: [],
        weights: [],
        litters: [],
        treatments: [],
        cages: [],
        tags: [],
        breedings: [],
        mortalities: [],
        performanceMetrics: [],
        settings: {
          theme: 'light',
          gestationDuration: 31,
          weaningAge: 28,
          reproductionRestDays: 42,
          slaughterAge: 84
        }
      };

      const result = ExportService.exportToCSV(emptyState);
      
      expect(result).toBe('');
    });

    it('should handle partial data with missing optional fields', () => {
      const minimalAnimal: Animal = {
        id: 'minimal-1',
        sex: Sex.Male,
        status: Status.Grow,
        birthDate: '2024-01-01',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };

      const minimalState = {
        ...sampleAppState,
        animals: [minimalAnimal],
        weights: [],
        litters: [],
        treatments: [],
        cages: [],
        tags: []
      };

      const result = ExportService.exportToCSV(minimalState);
      
      expect(result).toContain('=== Animals ===');
      expect(result).toContain('"minimal-1"');
      expect(result).toContain('""'); // Empty fields should be quoted empty strings
    });

    it('should format tags as semicolon-separated values', () => {
      const result = ExportService.exportToCSV(sampleAppState);
      
      expect(result).toContain('"tag-1;tag-2"');
    });

    it('should handle null and undefined values', () => {
      const animalWithNulls = {
        ...sampleAnimal,
        name: undefined,
        identifier: null,
        breed: undefined,
        notes: null
      } as any;

      const stateWithNulls = {
        ...sampleAppState,
        animals: [animalWithNulls]
      };

      const result = ExportService.exportToCSV(stateWithNulls);
      
      expect(result).not.toContain('undefined');
      expect(result).not.toContain('null');
      expect(result).toContain('""'); // Should convert to empty strings
    });
  });

  describe('exportToExcel', () => {
    it('should return a blob with CSV data', () => {
      const result = ExportService.exportToExcel(sampleAppState);
      
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/vnd.ms-excel');
    });

    it('should contain same data as CSV export', () => {
      const csvResult = ExportService.exportToCSV(sampleAppState);
      const excelBlob = ExportService.exportToExcel(sampleAppState);
      
      // Check that it's the correct type and size
      expect(excelBlob.type).toBe('application/vnd.ms-excel');
      expect(excelBlob.size).toBe(csvResult.length);
    });
  });

  describe('downloadFile', () => {
    let mockLink: any;

    beforeEach(() => {
      // Mock DOM methods
      mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
        style: { display: '' }
      };

      const mockCreateElement = vi.fn().mockReturnValue(mockLink);
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockCreateObjectURL = vi.fn().mockReturnValue('mock-url');
      const mockRevokeObjectURL = vi.fn();

      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
        writable: true
      });

      Object.defineProperty(document.body, 'appendChild', {
        value: mockAppendChild,
        writable: true
      });

      Object.defineProperty(document.body, 'removeChild', {
        value: mockRemoveChild,
        writable: true
      });

      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true
      });

      Object.defineProperty(URL, 'revokeObjectURL', {
        value: mockRevokeObjectURL,
        writable: true
      });
    });

    it('should create download link for string content', () => {
      const content = 'test content';
      const filename = 'test.txt';
      const type = 'text/plain';

      ExportService.downloadFile(content, filename, type);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe(filename);
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    });

    it('should handle blob content', () => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const filename = 'test.txt';
      const type = 'text/plain';

      ExportService.downloadFile(blob, filename, type);

      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(mockLink.href).toBe('mock-url');
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('should handle different file types', () => {
      const testCases = [
        { content: '{}', filename: 'data.json', type: 'application/json' as const },
        { content: 'csv,data', filename: 'data.csv', type: 'text/csv' as const },
        { content: 'excel data', filename: 'data.xlsx', type: 'application/vnd.ms-excel' as const }
      ];

      testCases.forEach(({ content, filename, type }) => {
        ExportService.downloadFile(content, filename, type);
        expect(mockLink.download).toBe(filename);
      });
    });
  });
});