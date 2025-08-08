import { describe, it, expect, vi } from 'vitest';
import {
  isString,
  isNumber,
  isBoolean,
  isDate,
  isArray,
  isObject,
  isSex,
  isStatus,
  isAnimal,
  isCage,
  isTag,
  isLitter,
  isTreatment,
  isAnimalArray,
  isCageArray,
  isTagArray,
  isLitterArray,
  isTreatmentArray,
  isUILoadingState,
  isUIErrorState,
  validateRequired,
  validateString,
  validateNumber,
  validatePositiveNumber,
  validateDateString,
  validateEmail,
  validateLength,
  validateRange,
  safeAccess,
  validateAPIResponse,
  assertType
} from '../utils/typeGuards';
import { Sex, Status } from '../models/types';

describe('Basic Type Guards', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('123')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(true)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(123.45)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
    });

    it('should return false for non-numbers and NaN', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber('123')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber(true)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean('false')).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean({})).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for valid Date objects', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2024-01-01'))).toBe(true);
      expect(isDate(new Date(0))).toBe(true);
    });

    it('should return false for invalid dates and non-dates', () => {
      expect(isDate(new Date('invalid'))).toBe(false);
      expect(isDate('2024-01-01')).toBe(false);
      expect(isDate(1234567890)).toBe(false);
      expect(isDate(null)).toBe(false);
      expect(isDate(undefined)).toBe(false);
      expect(isDate({})).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays without item guard', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', 'b', 'c'])).toBe(true);
      expect(isArray([1, 'a', true])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('abc')).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });

    it('should validate array items with item guard', () => {
      expect(isArray([1, 2, 3], isNumber)).toBe(true);
      expect(isArray(['a', 'b', 'c'], isString)).toBe(true);
      expect(isArray([1, 'a', 3], isNumber)).toBe(false);
      expect(isArray([], isString)).toBe(true); // Empty array is valid
    });
  });

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject({ nested: { prop: 'value' } })).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(new Date())).toBe(true); // Date is an object in the implementation
    });
  });
});

describe('Enum Type Guards', () => {
  describe('isSex', () => {
    it('should return true for valid Sex enum values', () => {
      expect(isSex(Sex.Male)).toBe(true);
      expect(isSex(Sex.Female)).toBe(true);
      expect(isSex(Sex.Unknown)).toBe(true);
      expect(isSex('M')).toBe(true);
      expect(isSex('F')).toBe(true);
      expect(isSex('U')).toBe(true);
    });

    it('should return false for invalid Sex values', () => {
      expect(isSex('male')).toBe(false);
      expect(isSex('female')).toBe(false);
      expect(isSex('X')).toBe(false);
      expect(isSex(null)).toBe(false);
      expect(isSex(undefined)).toBe(false);
      expect(isSex(123)).toBe(false);
    });
  });

  describe('isStatus', () => {
    it('should return true for valid Status enum values', () => {
      expect(isStatus(Status.Reproducer)).toBe(true);
      expect(isStatus(Status.Grow)).toBe(true);
      expect(isStatus(Status.Retired)).toBe(true);
      expect(isStatus(Status.Deceased)).toBe(true);
      expect(isStatus(Status.Consumed)).toBe(true);
      expect(isStatus('REPRO')).toBe(true);
      expect(isStatus('GROW')).toBe(true);
    });

    it('should return false for invalid Status values', () => {
      expect(isStatus('active')).toBe(false);
      expect(isStatus('inactive')).toBe(false);
      expect(isStatus('INVALID')).toBe(false);
      expect(isStatus(null)).toBe(false);
      expect(isStatus(undefined)).toBe(false);
      expect(isStatus(123)).toBe(false);
    });
  });
});

describe('Entity Type Guards', () => {
  describe('isAnimal', () => {
    const validAnimal = {
      id: 'animal-1',
      identifier: 'A001',
      sex: Sex.Female,
      status: Status.Reproducer,
      name: 'Test Animal',
      breed: 'Test Breed',
      birthDate: '2024-01-01',
      notes: 'Test notes',
      cage: 'A1',
      father: 'father-id',
      mother: 'mother-id',
      tags: ['tag1', 'tag2'],
      photos: ['photo1.jpg', 'photo2.jpg']
    };

    it('should return true for valid animal objects', () => {
      expect(isAnimal(validAnimal)).toBe(true);
    });

    it('should return true for minimal animal objects', () => {
      const minimalAnimal = {
        id: 'animal-1',
        identifier: 'A001',
        sex: Sex.Male,
        status: Status.Grow
      };
      expect(isAnimal(minimalAnimal)).toBe(true);
    });

    it('should return false for invalid animal objects', () => {
      expect(isAnimal({})).toBe(false);
      expect(isAnimal({ id: 123 })).toBe(false); // id should be string
      expect(isAnimal({ id: 'valid', sex: 'invalid' })).toBe(false); // invalid sex
      expect(isAnimal({ id: 'valid', sex: Sex.Male, status: 'invalid' })).toBe(false); // invalid status
    });

    it('should return false for non-objects', () => {
      expect(isAnimal(null)).toBe(false);
      expect(isAnimal(undefined)).toBe(false);
      expect(isAnimal('string')).toBe(false);
      expect(isAnimal([])).toBe(false);
    });

    it('should validate optional array fields', () => {
      const animalWithInvalidTags = {
        ...validAnimal,
        tags: ['valid', 123] // invalid tag type
      };
      expect(isAnimal(animalWithInvalidTags)).toBe(false);

      const animalWithInvalidPhotos = {
        ...validAnimal,
        photos: ['valid.jpg', null] // invalid photo type
      };
      expect(isAnimal(animalWithInvalidPhotos)).toBe(false);
    });
  });

  describe('isCage', () => {
    const validCage = {
      id: 'cage-1',
      name: 'Cage A1',
      description: 'Large cage',
      capacity: 2,
      location: 'Building A'
    };

    it('should return true for valid cage objects', () => {
      expect(isCage(validCage)).toBe(true);
    });

    it('should return true for minimal cage objects', () => {
      const minimalCage = {
        id: 'cage-1',
        name: 'Cage A1'
      };
      expect(isCage(minimalCage)).toBe(true);
    });

    it('should return false for invalid cage objects', () => {
      expect(isCage({})).toBe(false);
      expect(isCage({ id: 123 })).toBe(false); // id should be string
      expect(isCage({ id: 'valid', name: 123 })).toBe(false); // name should be string
      expect(isCage({ id: 'valid', name: 'valid', capacity: 'invalid' })).toBe(false); // capacity should be number
    });
  });

  describe('isTag', () => {
    const validTag = {
      id: 'tag-1',
      name: 'Breeding Stock',
      color: '#FF5722',
      description: 'Animals for breeding'
    };

    it('should return true for valid tag objects', () => {
      expect(isTag(validTag)).toBe(true);
    });

    it('should return true for minimal tag objects', () => {
      const minimalTag = {
        id: 'tag-1',
        name: 'Tag'
      };
      expect(isTag(minimalTag)).toBe(true);
    });

    it('should return false for invalid tag objects', () => {
      expect(isTag({})).toBe(false);
      expect(isTag({ id: 123 })).toBe(false); // id should be string
      expect(isTag({ id: 'valid', name: 123 })).toBe(false); // name should be string
    });
  });

  describe('isLitter', () => {
    const validLitter = {
      id: 'litter-1',
      father: 'father-id',
      mother: 'mother-id',
      birthDate: '2024-01-01',
      weaningDate: '2024-01-28',
      totalBorn: 8,
      totalAlive: 7,
      notes: 'Good litter'
    };

    it('should return true for valid litter objects', () => {
      expect(isLitter(validLitter)).toBe(true);
    });

    it('should return true for minimal litter objects', () => {
      const minimalLitter = {
        id: 'litter-1',
        father: 'father-id',
        mother: 'mother-id',
        birthDate: '2024-01-01',
        totalBorn: 8,
        totalAlive: 7
      };
      expect(isLitter(minimalLitter)).toBe(true);
    });

    it('should return false for invalid litter objects', () => {
      expect(isLitter({})).toBe(false);
      expect(isLitter({ id: 123 })).toBe(false); // id should be string
      expect(isLitter({ id: 'valid', totalBorn: 'invalid' })).toBe(false); // totalBorn should be number
    });
  });

  describe('isTreatment', () => {
    const validTreatment = {
      id: 'treatment-1',
      animalId: 'animal-1',
      type: 'vaccination',
      date: '2024-01-01',
      product: 'Vaccine A',
      dosage: '1ml',
      withdrawalPeriod: 7,
      notes: 'Annual vaccination',
      veterinarian: 'Dr. Smith'
    };

    it('should return true for valid treatment objects', () => {
      expect(isTreatment(validTreatment)).toBe(true);
    });

    it('should return true for minimal treatment objects', () => {
      const minimalTreatment = {
        id: 'treatment-1',
        animalId: 'animal-1',
        type: 'vaccination',
        date: '2024-01-01'
      };
      expect(isTreatment(minimalTreatment)).toBe(true);
    });

    it('should return false for invalid treatment objects', () => {
      expect(isTreatment({})).toBe(false);
      expect(isTreatment({ id: 123 })).toBe(false); // id should be string
      expect(isTreatment({ id: 'valid', withdrawalPeriod: 'invalid' })).toBe(false); // withdrawalPeriod should be number
    });
  });
});

describe('Collection Type Guards', () => {
  it('should validate animal arrays', () => {
    const validAnimals = [
      { id: 'a1', identifier: 'A001', sex: Sex.Male, status: Status.Grow },
      { id: 'a2', identifier: 'A002', sex: Sex.Female, status: Status.Reproducer }
    ];
    expect(isAnimalArray(validAnimals)).toBe(true);
    expect(isAnimalArray([])).toBe(true);
    expect(isAnimalArray([{}])).toBe(false);
  });

  it('should validate cage arrays', () => {
    const validCages = [
      { id: 'c1', name: 'Cage 1' },
      { id: 'c2', name: 'Cage 2' }
    ];
    expect(isCageArray(validCages)).toBe(true);
    expect(isCageArray([])).toBe(true);
    expect(isCageArray([{}])).toBe(false);
  });

  it('should validate tag arrays', () => {
    const validTags = [
      { id: 't1', name: 'Tag 1' },
      { id: 't2', name: 'Tag 2' }
    ];
    expect(isTagArray(validTags)).toBe(true);
    expect(isTagArray([])).toBe(true);
    expect(isTagArray([{}])).toBe(false);
  });

  it('should validate litter arrays', () => {
    const validLitters = [
      { id: 'l1', father: 'f1', mother: 'm1', birthDate: '2024-01-01', totalBorn: 5, totalAlive: 4 }
    ];
    expect(isLitterArray(validLitters)).toBe(true);
    expect(isLitterArray([])).toBe(true);
    expect(isLitterArray([{}])).toBe(false);
  });

  it('should validate treatment arrays', () => {
    const validTreatments = [
      { id: 't1', animalId: 'a1', type: 'vaccination', date: '2024-01-01' }
    ];
    expect(isTreatmentArray(validTreatments)).toBe(true);
    expect(isTreatmentArray([])).toBe(true);
    expect(isTreatmentArray([{}])).toBe(false);
  });
});

describe('UI State Type Guards', () => {
  describe('isUILoadingState', () => {
    it('should validate UI loading states', () => {
      expect(isUILoadingState({ loading: true })).toBe(true);
      expect(isUILoadingState({ loading: false, message: 'Loading...' })).toBe(true);
      expect(isUILoadingState({ loading: true, message: 'Loading...', progress: 50 })).toBe(true);
    });

    it('should reject invalid loading states', () => {
      expect(isUILoadingState({})).toBe(false);
      expect(isUILoadingState({ loading: 'true' })).toBe(false);
      expect(isUILoadingState({ loading: true, message: 123 })).toBe(false);
      expect(isUILoadingState({ loading: true, progress: 'invalid' })).toBe(false);
    });
  });

  describe('isUIErrorState', () => {
    it('should validate UI error states', () => {
      expect(isUIErrorState({ hasError: true })).toBe(true);
      expect(isUIErrorState({ hasError: false, message: 'Error occurred' })).toBe(true);
      expect(isUIErrorState({ 
        hasError: true, 
        message: 'Error', 
        details: 'Details',
        code: 404,
        retryable: true 
      })).toBe(true);
      expect(isUIErrorState({ 
        hasError: true, 
        code: 'ERR001' 
      })).toBe(true);
    });

    it('should reject invalid error states', () => {
      expect(isUIErrorState({})).toBe(false);
      expect(isUIErrorState({ hasError: 'true' })).toBe(false);
      expect(isUIErrorState({ hasError: true, message: 123 })).toBe(false);
      expect(isUIErrorState({ hasError: true, retryable: 'true' })).toBe(false);
    });
  });
});

describe('Validation Helper Functions', () => {
  describe('validateRequired', () => {
    it('should pass for non-null/undefined values', () => {
      expect(() => validateRequired('value', 'test')).not.toThrow();
      expect(() => validateRequired(0, 'test')).not.toThrow();
      expect(() => validateRequired(false, 'test')).not.toThrow();
      expect(() => validateRequired('', 'test')).not.toThrow();
    });

    it('should throw for null/undefined values', () => {
      expect(() => validateRequired(null, 'test')).toThrow('test is required');
      expect(() => validateRequired(undefined, 'test')).toThrow('test is required');
    });
  });

  describe('validateString', () => {
    it('should pass for strings', () => {
      expect(() => validateString('hello', 'test')).not.toThrow();
      expect(() => validateString('', 'test')).not.toThrow();
    });

    it('should throw for non-strings', () => {
      expect(() => validateString(123, 'test')).toThrow('test must be a string');
      expect(() => validateString(null, 'test')).toThrow('test must be a string');
    });
  });

  describe('validateNumber', () => {
    it('should pass for numbers', () => {
      expect(() => validateNumber(123, 'test')).not.toThrow();
      expect(() => validateNumber(0, 'test')).not.toThrow();
      expect(() => validateNumber(-123, 'test')).not.toThrow();
    });

    it('should throw for non-numbers', () => {
      expect(() => validateNumber('123', 'test')).toThrow('test must be a number');
      expect(() => validateNumber(NaN, 'test')).toThrow('test must be a number');
    });
  });

  describe('validatePositiveNumber', () => {
    it('should pass for positive numbers', () => {
      expect(() => validatePositiveNumber(123, 'test')).not.toThrow();
      expect(() => validatePositiveNumber(0.1, 'test')).not.toThrow();
    });

    it('should throw for non-positive numbers', () => {
      expect(() => validatePositiveNumber(0, 'test')).toThrow('test must be a positive number');
      expect(() => validatePositiveNumber(-123, 'test')).toThrow('test must be a positive number');
    });

    it('should throw for non-numbers', () => {
      expect(() => validatePositiveNumber('123', 'test')).toThrow('test must be a number');
    });
  });

  describe('validateDateString', () => {
    it('should pass for valid date strings', () => {
      expect(() => validateDateString('2024-01-01', 'test')).not.toThrow();
      expect(() => validateDateString('2024-12-31T23:59:59Z', 'test')).not.toThrow();
    });

    it('should throw for invalid date strings', () => {
      expect(() => validateDateString('invalid-date', 'test')).toThrow('test must be a valid date string');
      expect(() => validateDateString('2024-13-01', 'test')).toThrow('test must be a valid date string');
    });

    it('should throw for non-strings', () => {
      expect(() => validateDateString(123, 'test')).toThrow('test must be a string');
    });
  });

  describe('validateEmail', () => {
    it('should pass for valid email addresses', () => {
      expect(() => validateEmail('test@example.com', 'test')).not.toThrow();
      expect(() => validateEmail('user.name+tag@example.co.uk', 'test')).not.toThrow();
    });

    it('should throw for invalid email addresses', () => {
      expect(() => validateEmail('invalid-email', 'test')).toThrow('test must be a valid email address');
      expect(() => validateEmail('test@', 'test')).toThrow('test must be a valid email address');
      expect(() => validateEmail('@example.com', 'test')).toThrow('test must be a valid email address');
    });

    it('should throw for non-strings', () => {
      expect(() => validateEmail(123, 'test')).toThrow('test must be a string');
    });
  });

  describe('validateLength', () => {
    it('should pass for strings within length bounds', () => {
      expect(() => validateLength('hello', 1, 10, 'test')).not.toThrow();
      expect(() => validateLength('a', 1, 1, 'test')).not.toThrow();
    });

    it('should throw for strings outside length bounds', () => {
      expect(() => validateLength('', 1, 10, 'test')).toThrow('test must be between 1 and 10 characters');
      expect(() => validateLength('too long string', 1, 5, 'test')).toThrow('test must be between 1 and 5 characters');
    });
  });

  describe('validateRange', () => {
    it('should pass for numbers within range', () => {
      expect(() => validateRange(5, 1, 10, 'test')).not.toThrow();
      expect(() => validateRange(1, 1, 1, 'test')).not.toThrow();
    });

    it('should throw for numbers outside range', () => {
      expect(() => validateRange(0, 1, 10, 'test')).toThrow('test must be between 1 and 10');
      expect(() => validateRange(11, 1, 10, 'test')).toThrow('test must be between 1 and 10');
    });
  });
});

describe('Utility Functions', () => {
  describe('safeAccess', () => {
    it('should return validated data when guard passes', () => {
      const result = safeAccess('hello', isString, 'fallback');
      expect(result).toBe('hello');
    });

    it('should return fallback when guard fails', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = safeAccess(123, isString, 'fallback', 'Custom error message');
      
      expect(result).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalledWith('Custom error message');
    });

    it('should handle exceptions gracefully', () => {
      const throwingGuard = () => { throw new Error('Guard error'); };
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = safeAccess('data', throwingGuard as any, 'fallback');
      
      expect(result).toBe('fallback');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Type validation error:', expect.any(Error));
    });
  });

  describe('validateAPIResponse', () => {
    it('should return validated response when guard passes', () => {
      const response = { data: 'test' };
      const result = validateAPIResponse(response, isObject, '/api/test');
      
      expect(result).toBe(response);
    });

    it('should throw error when guard fails', () => {
      expect(() => validateAPIResponse('invalid', isObject, '/api/test'))
        .toThrow('Invalid response from /api/test: response does not match expected type');
    });
  });

  describe('assertType', () => {
    it('should pass when guard succeeds', () => {
      expect(() => assertType('hello', isString, 'Must be string')).not.toThrow();
    });

    it('should throw when guard fails', () => {
      expect(() => assertType(123, isString, 'Must be string'))
        .toThrow('Must be string');
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle circular references safely', () => {
    const circular: any = { prop: 'value' };
    circular.self = circular;
    
    // Basic type guards should handle circular objects without issues
    expect(isObject(circular)).toBe(true);
  });

  it('should handle very large numbers', () => {
    expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(isNumber(Number.MIN_SAFE_INTEGER)).toBe(true);
    expect(isNumber(Number.MAX_VALUE)).toBe(true);
    expect(isNumber(Number.MIN_VALUE)).toBe(true);
  });

  it('should handle unicode strings', () => {
    expect(isString('🐰🥕')).toBe(true);
    expect(isString('café')).toBe(true);
    expect(isString('中文')).toBe(true);
  });

  it('should handle nested arrays', () => {
    const nestedArray = [[1, 2], [3, 4]];
    expect(isArray(nestedArray)).toBe(true);
    expect(isArray(nestedArray, (item) => isArray(item))).toBe(true);
  });

  it('should handle deeply nested objects', () => {
    const deepObject = {
      level1: {
        level2: {
          level3: {
            value: 'deep'
          }
        }
      }
    };
    expect(isObject(deepObject)).toBe(true);
  });

  it('should handle prototype pollution attempts', () => {
    const maliciousObject = JSON.parse('{"__proto__": {"isAdmin": true}}');
    expect(isObject(maliciousObject)).toBe(true);
    // The guard should still work normally
  });

  it('should handle non-enumerable properties', () => {
    const obj = {};
    Object.defineProperty(obj, 'hidden', {
      value: 'secret',
      enumerable: false
    });
    expect(isObject(obj)).toBe(true);
  });
});