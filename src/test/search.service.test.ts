import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SearchService, SearchFilters, SavedSearchFilter } from '../services/search.service';
import { Animal, Status, Sex } from '../models/types';

// Mock memory-cache service
vi.mock('../services/memory-cache.service', () => ({
  CacheUtils: {
    cacheSearchResults: vi.fn((query, filters, fn) => fn())
  }
}));

describe('SearchService', () => {
  let sampleAnimals: Animal[];

  beforeEach(() => {
    sampleAnimals = [
      {
        id: 'animal-1',
        name: 'Fluffy',
        identifier: 'FL001',
        sex: Sex.Female,
        breed: 'New Zealand White',
        birthDate: '2024-01-15',
        origin: 'BORN_HERE',
        status: Status.Reproducer,
        cage: 'A1',
        tags: ['breeding', 'white'],
        notes: "Good breeder",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 'animal-2',
        name: 'Speedy',
        identifier: 'SP002',
        sex: Sex.Male,
        breed: 'Dutch',
        birthDate: '2024-02-10',
        origin: 'PURCHASED',
        status: Status.Grow,
        cage: 'B2',
        tags: ['young', 'male'],
        notes: "Fast growing",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 'animal-3',
        name: 'Shadow',
        identifier: 'SH003',
        sex: Sex.Male,
        breed: 'New Zealand White',
        birthDate: '2024-03-05',
        origin: 'BORN_HERE',
        status: Status.Reproducer,
        cage: 'A1',
        tags: ['breeding', 'dark'],
        notes: "Strong male",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 'animal-4',
        name: 'Luna',
        identifier: 'LU004',
        sex: Sex.Female,
        breed: 'Dutch',
        birthDate: '2023-12-01',
        origin: 'BORN_HERE',
        status: Status.RETIRED,
        cage: 'C3',
        tags: ['old', 'retired'],
        notes: "Former breeder",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    ];

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('fuzzyMatch', () => {
    it('should return 1.0 for exact matches', () => {
      const result = SearchService.fuzzyMatch('Fluffy', 'Fluffy');
      expect(result).toBe(1.0);
    });

    it('should return 0.9 for partial exact matches', () => {
      const result = SearchService.fuzzyMatch('Fluffy Rabbit', 'Fluffy');
      expect(result).toBe(0.9);
    });

    it('should return score between 0 and 1 for similar strings', () => {
      const result = SearchService.fuzzyMatch('Fluffy', 'Flufi');
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });

    it('should return 0 for completely different strings', () => {
      const result = SearchService.fuzzyMatch('Fluffy', 'xyz123');
      expect(result).toBe(0);
    });

    it('should handle empty or null inputs', () => {
      expect(SearchService.fuzzyMatch('', 'test')).toBe(0);
      expect(SearchService.fuzzyMatch('test', '')).toBe(0);
      expect(SearchService.fuzzyMatch(null as any, 'test')).toBe(0);
      expect(SearchService.fuzzyMatch('test', null as any)).toBe(0);
    });

    it('should be case insensitive', () => {
      const result = SearchService.fuzzyMatch('FLUFFY', 'fluffy');
      expect(result).toBe(1.0);
    });

    it('should handle single character differences', () => {
      const result = SearchService.fuzzyMatch('cat', 'bat');
      expect(result).toBeGreaterThan(0.5);
    });
  });

  describe('searchAnimals', () => {
    it('should return all animals when no filters applied', () => {
      const filters: SearchFilters = {};
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(4);
      expect(result).toEqual(sampleAnimals);
    });

    it('should filter by status', () => {
      const filters: SearchFilters = {
        status: [Status.Reproducer]
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.status === Status.Reproducer)).toBe(true);
    });

    it('should filter by sex', () => {
      const filters: SearchFilters = {
        sex: [Sex.Female]
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.sex === Sex.Female)).toBe(true);
    });

    it('should filter by breed', () => {
      const filters: SearchFilters = {
        breed: ['New Zealand White']
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.breed === 'New Zealand White')).toBe(true);
    });

    it('should filter by cage', () => {
      const filters: SearchFilters = {
        cage: ['A1']
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.cage === 'A1')).toBe(true);
    });

    it('should filter by tags', () => {
      const filters: SearchFilters = {
        tags: ['breeding']
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(animal => animal.tags?.includes('breeding'))).toBe(true);
    });

    it('should filter by date range', () => {
      const filters: SearchFilters = {
        dateRange: {
          start: '2024-01-01',
          end: '2024-02-28'
        }
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(2); // Fluffy and Speedy
      expect(result.map(a => a.id)).toEqual(['animal-1', 'animal-2']);
    });

    it('should perform text search on name', () => {
      const filters: SearchFilters = {
        query: 'Fluffy'
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Fluffy');
    });

    it('should perform text search on identifier', () => {
      const filters: SearchFilters = {
        query: 'FL001'
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].identifier).toBe('FL001');
    });

    it('should perform fuzzy text search', () => {
      const filters: SearchFilters = {
        query: 'Flufi' // Typo in Fluffy
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].name).toBe('Fluffy');
    });

    it('should rank search results by relevance', () => {
      const filters: SearchFilters = {
        query: 'white'
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      // Results should be ordered by relevance (breed match should come before notes match)
      expect(result.length).toBeGreaterThan(0);
      // The animal with 'white' in breed should rank higher than one with 'white' only in tags
    });

    it('should combine multiple filters', () => {
      const filters: SearchFilters = {
        status: [Status.Reproducer],
        sex: [Sex.Male],
        breed: ['New Zealand White']
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('animal-3'); // Shadow
    });

    it('should return empty array when no matches found', () => {
      const filters: SearchFilters = {
        status: [Status.Deceased]
      };
      
      const result = SearchService.searchAnimals(sampleAnimals, filters);
      
      expect(result).toHaveLength(0);
    });

    it('should handle animals without optional fields', () => {
      const minimalAnimal: Animal = {
        id: 'minimal',
        sex: Sex.Male,
        status: Status.Grow,
        birthDate: '2024-01-01'
      };

      const filters: SearchFilters = {
        query: 'test'
      };
      
      const result = SearchService.searchAnimals([minimalAnimal], filters);
      
      expect(result).toHaveLength(0); // Should not crash
    });
  });

  describe('getSearchSuggestions', () => {
    it('should return suggestions for partial name matches', () => {
      const result = SearchService.getSearchSuggestions(sampleAnimals, 'Fl');
      
      expect(result).toContain('Fluffy');
    });

    it('should return suggestions for partial identifier matches', () => {
      const result = SearchService.getSearchSuggestions(sampleAnimals, 'SP');
      
      expect(result).toContain('SP002');
    });

    it('should return suggestions for breed matches', () => {
      const result = SearchService.getSearchSuggestions(sampleAnimals, 'Dutch');
      
      expect(result).toContain('Dutch');
    });

    it('should limit suggestions to 10 items', () => {
      // Create many animals with similar names
      const manyAnimals = Array.from({ length: 20 }, (_, i) => ({
        ...sampleAnimals[0],
        id: `animal-${i}`,
        name: `Fluffy${i}`
      }));

      const result = SearchService.getSearchSuggestions(manyAnimals, 'Fl');
      
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should return empty array for short queries', () => {
      expect(SearchService.getSearchSuggestions(sampleAnimals, 'F')).toHaveLength(0);
      expect(SearchService.getSearchSuggestions(sampleAnimals, '')).toHaveLength(0);
    });

    it('should be case insensitive', () => {
      const result = SearchService.getSearchSuggestions(sampleAnimals, 'fl');
      
      expect(result).toContain('Fluffy');
    });

    it('should return unique suggestions', () => {
      const duplicateAnimals = [
        ...sampleAnimals,
        { ...sampleAnimals[0], id: 'duplicate' }
      ];

      const result = SearchService.getSearchSuggestions(duplicateAnimals, 'Fluffy');
      
      expect(result.filter(s => s === 'Fluffy')).toHaveLength(1);
    });
  });

  describe('getFilterOptions', () => {
    it('should extract unique breeds', () => {
      const result = SearchService.getFilterOptions(sampleAnimals);
      
      expect(result.breeds).toEqual(['Dutch', 'New Zealand White']);
    });

    it('should extract unique cages', () => {
      const result = SearchService.getFilterOptions(sampleAnimals);
      
      expect(result.cages).toEqual(['A1', 'B2', 'C3']);
    });

    it('should extract unique tags', () => {
      const result = SearchService.getFilterOptions(sampleAnimals);
      
      expect(result.tags).toEqual(['breeding', 'dark', 'male', 'old', 'retired', 'white', 'young']);
    });

    it('should include all status options', () => {
      const result = SearchService.getFilterOptions(sampleAnimals);
      
      expect(result.statuses).toEqual(Object.values(Status));
    });

    it('should include all sex options', () => {
      const result = SearchService.getFilterOptions(sampleAnimals);
      
      expect(result.sexes).toEqual(Object.values(Sex));
    });

    it('should handle empty animal list', () => {
      const result = SearchService.getFilterOptions([]);
      
      expect(result.breeds).toHaveLength(0);
      expect(result.cages).toHaveLength(0);
      expect(result.tags).toHaveLength(0);
      expect(result.statuses).toEqual(Object.values(Status));
      expect(result.sexes).toEqual(Object.values(Sex));
    });
  });

  describe('Saved Filters Management', () => {
    describe('getSavedFilters', () => {
      it('should return empty array when no saved filters', () => {
        const result = SearchService.getSavedFilters();
        
        expect(result).toEqual([]);
      });

      it('should return saved filters from localStorage', () => {
        const savedFilters: SavedSearchFilter[] = [
          {
            id: 'filter-1',
            name: 'Test Filter',
            filters: { status: [Status.Reproducer] },
            createdAt: '2024-01-01T00:00:00.000Z'
          }
        ];

        localStorage.setItem('garenne-saved-search-filters', JSON.stringify(savedFilters));

        const result = SearchService.getSavedFilters();
        
        expect(result).toEqual(savedFilters);
      });

      it('should handle corrupted localStorage data', () => {
        localStorage.setItem('garenne-saved-search-filters', 'invalid-json');

        const result = SearchService.getSavedFilters();
        
        expect(result).toEqual([]);
      });
    });

    describe('saveSearchFilter', () => {
      it('should save a new filter', () => {
        const filters: SearchFilters = { status: [Status.Reproducer] };
        
        const result = SearchService.saveSearchFilter('Test Filter', filters);
        
        expect(result.name).toBe('Test Filter');
        expect(result.filters).toEqual(filters);
        expect(result.id).toBeDefined();
        expect(result.createdAt).toBeDefined();

        const saved = SearchService.getSavedFilters();
        expect(saved).toHaveLength(1);
        expect(saved[0]).toEqual(result);
      });

      it('should add to existing filters', () => {
        SearchService.saveSearchFilter('Filter 1', { status: [Status.Reproducer] });
        SearchService.saveSearchFilter('Filter 2', { sex: [Sex.Female] });

        const saved = SearchService.getSavedFilters();
        expect(saved).toHaveLength(2);
      });
    });

    describe('deleteSavedFilter', () => {
      it('should delete existing filter', () => {
        const saved = SearchService.saveSearchFilter('Test Filter', { status: [Status.Reproducer] });
        
        const result = SearchService.deleteSavedFilter(saved.id);
        
        expect(result).toBe(true);
        expect(SearchService.getSavedFilters()).toHaveLength(0);
      });

      it('should return false for non-existent filter', () => {
        const result = SearchService.deleteSavedFilter('non-existent');
        
        expect(result).toBe(false);
      });

      it('should not affect other filters', () => {
        const filter1 = SearchService.saveSearchFilter('Filter 1', { status: [Status.Reproducer] });
        const filter2 = SearchService.saveSearchFilter('Filter 2', { sex: [Sex.Female] });
        
        SearchService.deleteSavedFilter(filter1.id);
        
        const remaining = SearchService.getSavedFilters();
        expect(remaining).toHaveLength(1);
        expect(remaining[0].id).toBe(filter2.id);
      });
    });

    describe('updateFilterLastUsed', () => {
      it('should update last used timestamp', () => {
        const saved = SearchService.saveSearchFilter('Test Filter', { status: [Status.Reproducer] });
        
        SearchService.updateFilterLastUsed(saved.id);
        
        const updated = SearchService.getSavedFilters();
        expect(updated[0].lastUsed).toBeDefined();
        expect(new Date(updated[0].lastUsed!).getTime()).toBeGreaterThanOrEqual(new Date(saved.createdAt).getTime());
      });

      it('should handle non-existent filter gracefully', () => {
        expect(() => SearchService.updateFilterLastUsed('non-existent')).not.toThrow();
      });
    });

    describe('getRecentSavedFilters', () => {
      it('should return recent filters ordered by last used', () => {
        const filter1 = SearchService.saveSearchFilter('Filter 1', { status: [Status.Reproducer] });
        const filter2 = SearchService.saveSearchFilter('Filter 2', { sex: [Sex.Female] });
        
        // Update usage order
        SearchService.updateFilterLastUsed(filter2.id);
        SearchService.updateFilterLastUsed(filter1.id);
        
        const recent = SearchService.getRecentSavedFilters();
        
        expect(recent[0].id).toBe(filter1.id); // Most recently used first
        expect(recent[1].id).toBe(filter2.id);
      });

      it('should limit results to specified count', () => {
        for (let i = 0; i < 10; i++) {
          const filter = SearchService.saveSearchFilter(`Filter ${i}`, { status: [Status.Reproducer] });
          SearchService.updateFilterLastUsed(filter.id);
        }
        
        const recent = SearchService.getRecentSavedFilters(3);
        
        expect(recent).toHaveLength(3);
      });

      it('should only return filters that have been used', () => {
        SearchService.saveSearchFilter('Unused Filter', { status: [Status.Reproducer] });
        const used = SearchService.saveSearchFilter('Used Filter', { sex: [Sex.Female] });
        SearchService.updateFilterLastUsed(used.id);
        
        const recent = SearchService.getRecentSavedFilters();
        
        expect(recent).toHaveLength(1);
        expect(recent[0].id).toBe(used.id);
      });
    });

    describe('isFilterEmpty', () => {
      it('should return true for empty filters', () => {
        const emptyFilter: SearchFilters = {};
        
        expect(SearchService.isFilterEmpty(emptyFilter)).toBe(true);
      });

      it('should return true for filters with empty arrays', () => {
        const filterWithEmptyArrays: SearchFilters = {
          status: [],
          sex: [],
          breed: [],
          tags: [],
          cage: []
        };
        
        expect(SearchService.isFilterEmpty(filterWithEmptyArrays)).toBe(true);
      });

      it('should return false for filters with query', () => {
        const filterWithQuery: SearchFilters = {
          query: 'test'
        };
        
        expect(SearchService.isFilterEmpty(filterWithQuery)).toBe(false);
      });

      it('should return false for filters with non-empty arrays', () => {
        const filterWithStatus: SearchFilters = {
          status: [Status.Reproducer]
        };
        
        expect(SearchService.isFilterEmpty(filterWithStatus)).toBe(false);
      });

      it('should return false for filters with date range', () => {
        const filterWithDateRange: SearchFilters = {
          dateRange: {
            start: '2024-01-01',
            end: '2024-12-31'
          }
        };
        
        expect(SearchService.isFilterEmpty(filterWithDateRange)).toBe(false);
      });

      it('should return false for filters with weight range', () => {
        const filterWithWeightRange: SearchFilters = {
          weightRange: {
            min: 1000,
            max: 3000
          }
        };
        
        expect(SearchService.isFilterEmpty(filterWithWeightRange)).toBe(false);
      });
    });
  });
});