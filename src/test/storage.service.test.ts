import { expect, test, vi, beforeEach, describe } from 'vitest';
import { LocalStorageService } from '../services/storage.service';
import { AppState, Sex, Status } from '../models/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock LZ-string
vi.mock('lz-string', () => ({
  default: {
    compress: vi.fn(),
    decompress: vi.fn(),
  },
  compress: vi.fn(),
  decompress: vi.fn(),
}));

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LocalStorageService();
  });

  describe('load', () => {
    test('returns default state when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = service.load();

      expect(result).toMatchObject({
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        goals: [],
        goalAchievements: [],
        settings: expect.objectContaining({
          theme: 'light',
          weightUnit: 'g',
          enableQR: false,
          schemaVersion: 2,
        }),
      });
    });

    test('loads and parses stored data successfully', () => {
      const mockState: AppState = {
        animals: [{ 
          id: 'test-animal', 
          name: 'Test', 
          birthDate: '2023-01-01T00:00:00.000Z', 
          sex: Sex.Male, 
          breed: 'Test', 
          status: Status.Grow, 
          cage: 'A1', 
          tags: [], 
          createdAt: '2023-01-01T00:00:00.000Z', 
          updatedAt: '2023-01-01T00:00:00.000Z' 
        }],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        goals: [],
        goalAchievements: [],
        settings: {
          theme: 'dark',
          weightUnit: 'kg',
          enableQR: true,
          locale: 'en-US',
          schemaVersion: 2,
          gestationDuration: 31,
          weaningDuration: 28,
          reproductionReadyDuration: 90,
          slaughterReadyDuration: 70,
          exportFormat: 'json',
          includeImages: false,
        },
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockState));

      const result = service.load();

      expect(result).toMatchObject({
        animals: expect.arrayContaining([
          expect.objectContaining({ id: 'test-animal', name: 'Test' })
        ]),
        settings: expect.objectContaining({
          theme: 'dark',
          weightUnit: 'kg',
          enableQR: true,
        }),
      });
    });

    test('returns default state when stored data is invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const result = service.load();

      expect(result).toMatchObject({
        animals: [],
        settings: expect.objectContaining({
          theme: 'light',
        }),
      });
    });

    test('loads stored data with string dates (date conversion handled by application layer)', () => {
      const mockState = {
        animals: [{
          id: 'test-animal',
          name: 'Test',
          birthDate: '2023-01-01T00:00:00.000Z',
          sex: Sex.Male,
          breed: 'Test',
          status: Status.Grow,
          cage: 'A1',
          tags: [],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        }],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        goals: [],
        goalAchievements: [],
        settings: {
          theme: 'light',
          weightUnit: 'g',
          enableQR: false,
          locale: 'en-US',
          schemaVersion: 2,
          gestationDuration: 31,
          weaningDuration: 28,
          reproductionReadyDuration: 90,
          slaughterReadyDuration: 70,
          exportFormat: 'json',
          includeImages: false,
        },
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockState));

      const result = service.load();

      // Storage service loads raw data, date conversion is handled by application layer
      expect(result.animals[0].birthDate).toBe('2023-01-01T00:00:00.000Z');
      expect(result.animals[0].id).toBe('test-animal');
      expect(result.animals[0].name).toBe('Test');
    });
  });

  describe('save', () => {
    test('saves state to localStorage successfully', () => {
      const mockState: AppState = {
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        goals: [],
        goalAchievements: [],
        settings: {
          theme: 'dark',
          weightUnit: 'kg',
          enableQR: true,
          locale: 'en-US',
          schemaVersion: 2,
          gestationDuration: 31,
          weaningDuration: 28,
          reproductionReadyDuration: 90,
          slaughterReadyDuration: 70,
          exportFormat: 'json',
          includeImages: false,
        },
      };

      service.save(mockState);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'rabbit-app-v1',
        expect.stringContaining('"theme":"dark"')
      );
    });

    test('throws error when localStorage save fails', () => {
      const mockState: AppState = {
        animals: [],
        breedings: [],
        litters: [],
        weights: [],
        treatments: [],
        mortalities: [],
        cages: [],
        tags: [],
        performanceMetrics: [],
        goals: [],
        goalAchievements: [],
        settings: {
          theme: 'light',
          weightUnit: 'g',
          enableQR: false,
          locale: 'en-US',
          schemaVersion: 2,
          gestationDuration: 31,
          weaningDuration: 28,
          reproductionReadyDuration: 90,
          slaughterReadyDuration: 70,
          exportFormat: 'json',
          includeImages: false,
        },
      };

      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should throw an error with localized message
      expect(() => service.save(mockState)).toThrow('Échec de la sauvegarde des données');
    });
  });

  describe('clear', () => {
    test('clears localStorage', () => {
      service.clear();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('rabbit-app-v1');
    });
  });
});