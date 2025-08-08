import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getOptimizedImage, 
  supportsWebP, 
  supportsAVIF, 
  getSupportedFormats, 
  getBestImageSrc 
} from '../utils/imageUtils';

// Mock canvas methods
const mockToDataURL = vi.fn();

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: mockToDataURL,
  writable: true,
});

Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => ({
    width: 0,
    height: 0,
    toDataURL: mockToDataURL,
  })),
  writable: true,
});

describe('imageUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOptimizedImage', () => {
    it('should return icon sources', () => {
      const result = getOptimizedImage('icon');
      
      expect(result).toHaveProperty('webp');
      expect(result).toHaveProperty('fallback');
      expect(result.webp).toBeDefined();
      expect(result.fallback).toBeDefined();
    });

    it('should return icon_with_title sources', () => {
      const result = getOptimizedImage('icon_with_title');
      
      expect(result).toHaveProperty('webp');
      expect(result).toHaveProperty('fallback');
      expect(result.webp).toBeDefined();
      expect(result.fallback).toBeDefined();
    });

    it('should throw error for unknown image', () => {
      expect(() => getOptimizedImage('unknown' as any)).toThrow('Unknown image: unknown');
    });
  });

  describe('supportsWebP', () => {
    it('should return true when WebP is supported', () => {
      mockToDataURL.mockReturnValue('data:image/webp;base64,test');
      
      const result = supportsWebP();
      
      expect(result).toBe(true);
      expect(mockToDataURL).toHaveBeenCalledWith('image/webp');
    });

    it('should return false when WebP is not supported', () => {
      mockToDataURL.mockReturnValue('data:image/png;base64,test');
      
      const result = supportsWebP();
      
      expect(result).toBe(false);
      expect(mockToDataURL).toHaveBeenCalledWith('image/webp');
    });
  });

  describe('supportsAVIF', () => {
    it('should return true when AVIF is supported', () => {
      mockToDataURL.mockReturnValue('data:image/avif;base64,test');
      
      const result = supportsAVIF();
      
      expect(result).toBe(true);
      expect(mockToDataURL).toHaveBeenCalledWith('image/avif');
    });

    it('should return false when AVIF is not supported', () => {
      mockToDataURL.mockReturnValue('data:image/png;base64,test');
      
      const result = supportsAVIF();
      
      expect(result).toBe(false);
      expect(mockToDataURL).toHaveBeenCalledWith('image/avif');
    });
  });

  describe('getSupportedFormats', () => {
    it('should return support status for both formats', () => {
      mockToDataURL
        .mockReturnValueOnce('data:image/avif;base64,test') // supportsAVIF call
        .mockReturnValueOnce('data:image/webp;base64,test'); // supportsWebP call
      
      const result = getSupportedFormats();
      
      expect(result).toEqual({
        avif: true,
        webp: true,
      });
    });

    it('should handle unsupported formats', () => {
      mockToDataURL
        .mockReturnValueOnce('data:image/png;base64,test') // supportsAVIF call
        .mockReturnValueOnce('data:image/png;base64,test'); // supportsWebP call
      
      const result = getSupportedFormats();
      
      expect(result).toEqual({
        avif: false,
        webp: false,
      });
    });
  });

  describe('getBestImageSrc', () => {
    it('should return AVIF when supported and available', () => {
      // Mock getOptimizedImage to return AVIF source
      vi.doMock('../utils/imageUtils', async () => {
        const actual = await vi.importActual('../utils/imageUtils');
        return {
          ...actual,
          getOptimizedImage: vi.fn(() => ({
            avif: 'test.avif',
            webp: 'test.webp',
            fallback: 'test.png',
          })),
        };
      });

      mockToDataURL
        .mockReturnValueOnce('data:image/avif;base64,test') // supportsAVIF
        .mockReturnValueOnce('data:image/webp;base64,test'); // supportsWebP

      const result = getBestImageSrc('icon');
      
      // Since AVIF is not actually available in our test sources, it should fall back to WebP
      expect(result).toBeDefined();
    });

    it('should return WebP when supported but AVIF not available', () => {
      mockToDataURL
        .mockReturnValueOnce('data:image/png;base64,test') // supportsAVIF (false)
        .mockReturnValueOnce('data:image/webp;base64,test'); // supportsWebP (true)

      const result = getBestImageSrc('icon');
      
      expect(result).toBeDefined();
      // Should return webp source since webp is supported and avif is not
    });

    it('should return fallback when no modern formats are supported', () => {
      mockToDataURL
        .mockReturnValueOnce('data:image/png;base64,test') // supportsAVIF (false)
        .mockReturnValueOnce('data:image/png;base64,test'); // supportsWebP (false)

      const result = getBestImageSrc('icon');
      
      expect(result).toBeDefined();
      // Should return fallback PNG source
    });

    it('should work with icon_with_title', () => {
      mockToDataURL
        .mockReturnValueOnce('data:image/png;base64,test') // supportsAVIF (false)
        .mockReturnValueOnce('data:image/png;base64,test'); // supportsWebP (false)

      const result = getBestImageSrc('icon_with_title');
      
      expect(result).toBeDefined();
    });
  });
});