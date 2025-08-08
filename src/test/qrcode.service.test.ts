import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QRCodeService } from '../services/qrcode.service';
import { Animal, Sex, Status } from '../models/types';
import QRCode from 'qrcode';

// Mock QRCode module
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(),
    toString: vi.fn(),
  },
}));

// Mock window.location
const mockLocation = {
  origin: 'http://localhost:3000',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock import.meta.env
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        PROD: false,
      },
    },
  },
  configurable: true,
});

describe('QRCodeService', () => {
  const mockAnimal: Animal = {
    id: 'test-animal-123',
    name: 'Test Rabbit',
    sex: Sex.Male,
    birthDate: '2023-01-01',
    identifier: 'TR001',
    breed: 'Test Breed',
    status: Status.Grow,
    origin: 'BORN_HERE',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment mock
    import.meta.env.PROD = false;
    // Reset location mock
    mockLocation.origin = 'http://localhost:3000';
  });

  describe('generateAnimalUrl', () => {
    it('should generate correct URL for development environment', () => {
      import.meta.env.PROD = false;
      const url = QRCodeService.generateAnimalUrl(mockAnimal.id);
      expect(url).toBe('http://localhost:3000/animals/test-animal-123');
    });

    it('should generate correct URL for production environment', () => {
      import.meta.env.PROD = true;
      const url = QRCodeService.generateAnimalUrl(mockAnimal.id);
      expect(url).toBe('http://localhost:3000/garenne/animals/test-animal-123');
    });

    it('should handle different origins', () => {
      mockLocation.origin = 'https://example.com';
      import.meta.env.PROD = true;
      const url = QRCodeService.generateAnimalUrl(mockAnimal.id);
      expect(url).toBe('https://example.com/garenne/animals/test-animal-123');
    });
  });

  describe('generateQRCode', () => {
    beforeEach(() => {
      // Reset mocks for each test in this suite
      vi.clearAllMocks();
      mockLocation.origin = 'http://localhost:3000';
    });

    it('should generate QR code successfully', async () => {
      const mockDataUrl = 'data:image/png;base64,mock-qr-code';
      (QRCode.toDataURL as any).mockResolvedValue(mockDataUrl);

      const result = await QRCodeService.generateQRCode(mockAnimal);

      expect(result).toBe(mockDataUrl);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        'http://localhost:3000/animals/test-animal-123',
        {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }
      );
    });

    it('should throw error when QR code generation fails', async () => {
      const mockError = new Error('QR generation failed');
      (QRCode.toDataURL as any).mockRejectedValue(mockError);

      await expect(QRCodeService.generateQRCode(mockAnimal))
        .rejects.toThrow('Failed to generate QR code');
    });
  });

  describe('generatePrintQRCode', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockLocation.origin = 'http://localhost:3000';
    });

    it('should generate print QR code with higher resolution', async () => {
      const mockDataUrl = 'data:image/png;base64,mock-print-qr-code';
      (QRCode.toDataURL as any).mockResolvedValue(mockDataUrl);

      const result = await QRCodeService.generatePrintQRCode(mockAnimal);

      expect(result).toBe(mockDataUrl);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        'http://localhost:3000/animals/test-animal-123',
        {
          width: 300,
          margin: 4,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }
      );
    });

    it('should throw error when print QR code generation fails', async () => {
      const mockError = new Error('Print QR generation failed');
      (QRCode.toDataURL as any).mockRejectedValue(mockError);

      await expect(QRCodeService.generatePrintQRCode(mockAnimal))
        .rejects.toThrow('Failed to generate print QR code');
    });
  });

  describe('generateQRCodeSVG', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockLocation.origin = 'http://localhost:3000';
    });

    it('should generate SVG QR code successfully', async () => {
      const mockSvg = '<svg>mock-svg-qr-code</svg>';
      (QRCode.toString as any).mockResolvedValue(mockSvg);

      const result = await QRCodeService.generateQRCodeSVG(mockAnimal);

      expect(result).toBe(mockSvg);
      expect(QRCode.toString).toHaveBeenCalledWith(
        'http://localhost:3000/animals/test-animal-123',
        {
          type: 'svg',
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }
      );
    });

    it('should throw error when SVG QR code generation fails', async () => {
      const mockError = new Error('SVG QR generation failed');
      (QRCode.toString as any).mockRejectedValue(mockError);

      await expect(QRCodeService.generateQRCodeSVG(mockAnimal))
        .rejects.toThrow('Failed to generate SVG QR code');
    });
  });
});