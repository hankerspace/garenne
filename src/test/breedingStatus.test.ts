import { describe, it, expect } from 'vitest';
import { calculateBreedingStatus, BreedingStatus } from '../utils/breedingStatus';
import { Animal, Breeding, Litter, Status, Sex, BreedingMethod } from '../models/types';

describe('breedingStatus', () => {
  const mockFemaleReproducer: Animal = {
    id: 'female-1',
    name: 'Bella',
    sex: Sex.Female,
    status: Status.Reproducer,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockMaleReproducer: Animal = {
    id: 'male-1',
    name: 'Max',
    sex: Sex.Male,
    status: Status.Reproducer,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockNonReproducer: Animal = {
    id: 'non-repro-1',
    name: 'Young',
    sex: Sex.Female,
    status: Status.Grow,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  it('should return NOT_REPRODUCTIVE for non-reproductive animals', () => {
    const result = calculateBreedingStatus(mockNonReproducer, [], [], 31);
    expect(result.status).toBe(BreedingStatus.NOT_REPRODUCTIVE);
  });

  it('should return AVAILABLE for male reproductive animals', () => {
    const result = calculateBreedingStatus(mockMaleReproducer, [], [], 31);
    expect(result.status).toBe(BreedingStatus.AVAILABLE);
  });

  it('should return WAITING_BREEDING for female reproductive animals with no breeding history', () => {
    const result = calculateBreedingStatus(mockFemaleReproducer, [], [], 31);
    expect(result.status).toBe(BreedingStatus.WAITING_BREEDING);
    expect(result.details).toBe('En attente de saillie');
  });

  it('should return PREGNANT for confirmed pregnant female', () => {
    // Set expected kindling date far enough in the future (more than 7 days)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 20); // 20 days from now

    const breeding: Breeding = {
      id: 'breeding-1',
      femaleId: 'female-1',
      maleId: 'male-1',
      method: BreedingMethod.Natural,
      date: '2024-01-01T00:00:00Z',
      diagnosis: 'PREGNANT',
      expectedKindlingDate: futureDate.toISOString().split('T')[0],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    const result = calculateBreedingStatus(mockFemaleReproducer, [breeding], [], 31);
    expect(result.status).toBe(BreedingStatus.PREGNANT);
    expect(result.details).toContain('Gestante');
  });

  it('should return WAITING_DIAGNOSIS for recent breeding without diagnosis', () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 12); // 12 days ago
    
    const breeding: Breeding = {
      id: 'breeding-1',
      femaleId: 'female-1',
      maleId: 'male-1',
      method: BreedingMethod.Natural,
      date: recentDate.toISOString(),
      diagnosis: 'UNKNOWN',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    const result = calculateBreedingStatus(mockFemaleReproducer, [breeding], [], 31);
    expect(result.status).toBe(BreedingStatus.WAITING_DIAGNOSIS);
    expect(result.details).toContain('En attente de diagnostic');
  });

  it('should return RECENTLY_KINDLED for recent mother with unweaned litter', () => {
    const recentKindlingDate = new Date();
    recentKindlingDate.setDate(recentKindlingDate.getDate() - 10); // 10 days ago

    const litter: Litter = {
      id: 'litter-1',
      motherId: 'female-1',
      fatherId: 'male-1',
      kindlingDate: recentKindlingDate.toISOString().split('T')[0],
      bornAlive: 6,
      stillborn: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    const result = calculateBreedingStatus(mockFemaleReproducer, [], [litter], 31);
    expect(result.status).toBe(BreedingStatus.RECENTLY_KINDLED);
    expect(result.details).toContain('Mise bas il y a 10 jours');
  });

  it('should return KINDLING_SOON for pregnant female near term', () => {
    const nearTermDate = new Date();
    nearTermDate.setDate(nearTermDate.getDate() + 3); // 3 days from now

    const breeding: Breeding = {
      id: 'breeding-1',
      femaleId: 'female-1',
      maleId: 'male-1',
      method: BreedingMethod.Natural,
      date: '2024-01-01T00:00:00Z',
      diagnosis: 'PREGNANT',
      expectedKindlingDate: nearTermDate.toISOString().split('T')[0],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    const result = calculateBreedingStatus(mockFemaleReproducer, [breeding], [], 31);
    expect(result.status).toBe(BreedingStatus.KINDLING_SOON);
    expect(result.details).toContain('Mise bas dans');
    expect(result.daysUntil).toBeLessThanOrEqual(7);
  });

  it('should return AVAILABLE for female with unsuccessful recent breeding', () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 3); // 3 days ago
    
    const breeding: Breeding = {
      id: 'breeding-1',
      femaleId: 'female-1',
      maleId: 'male-1',
      method: BreedingMethod.Natural,
      date: recentDate.toISOString(),
      diagnosis: 'NOT_PREGNANT',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    const result = calculateBreedingStatus(mockFemaleReproducer, [breeding], [], 31);
    expect(result.status).toBe(BreedingStatus.AVAILABLE);
  });
});