import { Animal, Litter, Treatment, Status, Sex } from '../models/types';

export interface SearchFilters {
  query?: string;
  status?: Status[];
  sex?: Sex[];
  breed?: string[];
  tags?: string[];
  cage?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  weightRange?: {
    min: number;
    max: number;
  };
}

export class SearchService {
  /**
   * Fuzzy search algorithm to match text with typos and partial matches
   */
  static fuzzyMatch(text: string, query: string): number {
    if (!text || !query) return 0;
    
    text = text.toLowerCase();
    query = query.toLowerCase();
    
    // Exact match gets highest score
    if (text.includes(query)) {
      return text === query ? 1.0 : 0.9;
    }
    
    // Calculate Levenshtein distance for fuzzy matching
    const matrix: number[][] = [];
    const textLen = text.length;
    const queryLen = query.length;
    
    for (let i = 0; i <= textLen; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= queryLen; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= textLen; i++) {
      for (let j = 1; j <= queryLen; j++) {
        if (text[i - 1] === query[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    const distance = matrix[textLen][queryLen];
    const maxLen = Math.max(textLen, queryLen);
    
    // Return similarity score (0-1)
    return maxLen === 0 ? 0 : (maxLen - distance) / maxLen;
  }

  /**
   * Search animals with intelligent filtering and ranking
   */
  static searchAnimals(animals: Animal[], filters: SearchFilters): Animal[] {
    let results = animals;

    // Apply basic filters first
    if (filters.status && filters.status.length > 0) {
      results = results.filter(animal => filters.status!.includes(animal.status));
    }

    if (filters.sex && filters.sex.length > 0) {
      results = results.filter(animal => filters.sex!.includes(animal.sex));
    }

    if (filters.breed && filters.breed.length > 0) {
      results = results.filter(animal => 
        animal.breed && filters.breed!.includes(animal.breed)
      );
    }

    if (filters.cage && filters.cage.length > 0) {
      results = results.filter(animal => 
        animal.cage && filters.cage!.includes(animal.cage)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(animal => 
        animal.tags && filters.tags!.some(tag => animal.tags!.includes(tag))
      );
    }

    if (filters.dateRange) {
      results = results.filter(animal => {
        if (!animal.birthDate) return false;
        const birthDate = new Date(animal.birthDate);
        const start = new Date(filters.dateRange!.start);
        const end = new Date(filters.dateRange!.end);
        return birthDate >= start && birthDate <= end;
      });
    }

    // Text search with fuzzy matching
    if (filters.query && filters.query.trim()) {
      const query = filters.query.trim();
      
      results = results
        .map(animal => {
          let score = 0;
          let matches = 0;

          // Search in name
          if (animal.name) {
            const nameScore = this.fuzzyMatch(animal.name, query);
            if (nameScore > 0.4) {
              score += nameScore * 3; // Name has highest weight
              matches++;
            }
          }

          // Search in identifier
          if (animal.identifier) {
            const identifierScore = this.fuzzyMatch(animal.identifier, query);
            if (identifierScore > 0.4) {
              score += identifierScore * 2.5; // Identifier has high weight
              matches++;
            }
          }

          // Search in breed
          if (animal.breed) {
            const breedScore = this.fuzzyMatch(animal.breed, query);
            if (breedScore > 0.4) {
              score += breedScore * 1.5;
              matches++;
            }
          }

          // Search in cage
          if (animal.cage) {
            const cageScore = this.fuzzyMatch(animal.cage, query);
            if (cageScore > 0.4) {
              score += cageScore * 1;
              matches++;
            }
          }

          // Search in notes
          if (animal.notes) {
            const notesScore = this.fuzzyMatch(animal.notes, query);
            if (notesScore > 0.3) {
              score += notesScore * 0.5;
              matches++;
            }
          }

          return { animal, score: matches > 0 ? score / matches : 0 };
        })
        .filter(item => item.score > 0.4) // Only include reasonably good matches
        .sort((a, b) => b.score - a.score) // Sort by relevance
        .map(item => item.animal);
    }

    return results;
  }

  /**
   * Get suggestions for search autocomplete
   */
  static getSearchSuggestions(animals: Animal[], query: string): string[] {
    if (!query || query.length < 2) return [];

    const suggestions = new Set<string>();
    const lowerQuery = query.toLowerCase();

    animals.forEach(animal => {
      // Add name suggestions
      if (animal.name && animal.name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(animal.name);
      }

      // Add identifier suggestions
      if (animal.identifier && animal.identifier.toLowerCase().includes(lowerQuery)) {
        suggestions.add(animal.identifier);
      }

      // Add breed suggestions
      if (animal.breed && animal.breed.toLowerCase().includes(lowerQuery)) {
        suggestions.add(animal.breed);
      }

      // Add cage suggestions
      if (animal.cage && animal.cage.toLowerCase().includes(lowerQuery)) {
        suggestions.add(animal.cage);
      }
    });

    return Array.from(suggestions).slice(0, 10); // Limit to 10 suggestions
  }

  /**
   * Get unique values for filter options
   */
  static getFilterOptions(animals: Animal[]) {
    const breeds = new Set<string>();
    const cages = new Set<string>();
    const tags = new Set<string>();

    animals.forEach(animal => {
      if (animal.breed) breeds.add(animal.breed);
      if (animal.cage) cages.add(animal.cage);
      if (animal.tags) animal.tags.forEach(tag => tags.add(tag));
    });

    return {
      breeds: Array.from(breeds).sort(),
      cages: Array.from(cages).sort(),
      tags: Array.from(tags).sort(),
      statuses: Object.values(Status),
      sexes: Object.values(Sex)
    };
  }
}