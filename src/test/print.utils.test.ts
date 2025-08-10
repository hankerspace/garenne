import { describe, it, expect, vi, beforeEach } from 'vitest';
import { printRabbitSheet } from '../utils/print.utils';
import { Animal, Sex, Status } from '../models/types';

// Mock window.open
const mockWindow = {
  document: {
    write: vi.fn(),
    close: vi.fn(),
  },
  onload: null as (() => void) | null,
  focus: vi.fn(),
  print: vi.fn(),
  close: vi.fn(),
  onafterprint: null as (() => void) | null,
};

describe('Print Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.open to return our mock window
    vi.stubGlobal('window', {
      ...window,
      open: vi.fn().mockReturnValue(mockWindow),
    });
  });

  it('should open a print window and generate correct HTML content', () => {
    const testAnimal: Animal = {
      id: 'test-123',
      name: 'Test Rabbit',
      identifier: 'TR001',
      sex: Sex.Female,
      status: Status.Grow,
      breed: 'Rex',
      birthDate: '2024-01-15T00:00:00.000Z',
      origin: 'PURCHASED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fatherId: undefined,
      motherId: undefined,
      cage: undefined,
      notes: undefined,
      tags: [],
    };

    printRabbitSheet(testAnimal);

    // Verify window.open was called
    expect(window.open).toHaveBeenCalledWith('', '_blank', 'width=800,height=600');

    // Verify document.write was called
    expect(mockWindow.document.write).toHaveBeenCalledTimes(1);

    // Get the HTML content that was written
    const htmlContent = mockWindow.document.write.mock.calls[0][0];

    // Verify essential content is present
    expect(htmlContent).toContain('FICHE LAPIN');
    expect(htmlContent).toContain('Test Rabbit');
    expect(htmlContent).toContain('ID: TR001');
    expect(htmlContent).toContain('Femelle ♀');
    expect(htmlContent).toContain('15/01/2024');
    expect(htmlContent).toContain('Rex');
    expect(htmlContent).toContain('Code QR');
    expect(htmlContent).toContain('Garenne');

    // Verify CSS includes A6 page size
    expect(htmlContent).toContain('@page {');
    expect(htmlContent).toContain('size: A6;');
    expect(htmlContent).toContain('margin: 0.5cm;');

    // Verify document.close was called
    expect(mockWindow.document.close).toHaveBeenCalledTimes(1);
  });

  it('should handle missing animal data gracefully', () => {
    const testAnimal: Animal = {
      id: 'test-456',
      name: '',
      identifier: '',
      sex: Sex.Unknown,
      status: Status.Grow,
      breed: '',
      birthDate: '',
      origin: 'PURCHASED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fatherId: undefined,
      motherId: undefined,
      cage: undefined,
      notes: undefined,
      tags: [],
    };

    printRabbitSheet(testAnimal);

    const htmlContent = mockWindow.document.write.mock.calls[0][0];

    // Should handle empty data gracefully
    expect(htmlContent).toContain('Sans nom');
    expect(htmlContent).toContain('Inconnu'); // For unknown sex
    expect(htmlContent).toContain('Non renseignée'); // For missing birth date
  });

  it('should setup print handlers correctly', () => {
    const testAnimal: Animal = {
      id: 'test-789',
      name: 'Print Test',
      identifier: 'PT001',
      sex: Sex.Male,
      status: Status.Reproducer,
      breed: 'Angora',
      birthDate: '2023-06-10T00:00:00.000Z',
      origin: 'BORN_HERE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fatherId: undefined,
      motherId: undefined,
      cage: undefined,
      notes: undefined,
      tags: [],
    };

    printRabbitSheet(testAnimal);

    // Simulate onload event
    if (mockWindow.onload) {
      mockWindow.onload();
    }

    // Verify print-related functions were called
    expect(mockWindow.focus).toHaveBeenCalledTimes(1);
    expect(mockWindow.print).toHaveBeenCalledTimes(1);

    // Simulate onafterprint event
    if (mockWindow.onafterprint) {
      mockWindow.onafterprint();
    }

    // Verify window close was called after print
    expect(mockWindow.close).toHaveBeenCalledTimes(1);
  });

  it('should handle window.open failure gracefully', () => {
    // Mock window.open to return null (blocked by popup blocker)
    vi.stubGlobal('window', {
      ...window,
      open: vi.fn().mockReturnValue(null),
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const testAnimal: Animal = {
      id: 'test-blocked',
      name: 'Blocked Print',
      identifier: 'BP001',
      sex: Sex.Female,
      status: Status.Grow,
      breed: 'Dutch',
      birthDate: '2024-03-20T00:00:00.000Z',
      origin: 'PURCHASED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fatherId: undefined,
      motherId: undefined,
      cage: undefined,
      notes: undefined,
      tags: [],
    };

    // Should not throw an error
    expect(() => printRabbitSheet(testAnimal)).not.toThrow();

    // Should log an error message
    expect(consoleErrorSpy).toHaveBeenCalledWith('Could not open print window. Please check popup blockers.');

    consoleErrorSpy.mockRestore();
  });
});