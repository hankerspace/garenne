import QRCode from 'qrcode';
import { Animal } from '../models/types';

/**
 * Service for generating and managing QR codes for animals
 */
export class QRCodeService {
  /**
   * Generate URL for accessing an animal's detail page
   */
  static generateAnimalUrl(animalId: string): string {
    // Get the base URL with proper basename handling
    const origin = window.location.origin;
    
    // Determine the basename based on environment
    // In production, the basename is '/garenne', in development it's '/'
    const isProduction = import.meta.env.PROD;
    const basename = isProduction ? '/garenne' : '';
    
    return `${origin}${basename}/animals/${animalId}`;
  }

  /**
   * Generate QR code data URL for an animal
   */
  static async generateQRCode(animal: Animal): Promise<string> {
    const url = this.generateAnimalUrl(animal.id);
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code for printing (higher resolution)
   */
  static async generatePrintQRCode(animal: Animal): Promise<string> {
    const url = this.generateAnimalUrl(animal.id);
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating print QR code:', error);
      throw new Error('Failed to generate print QR code');
    }
  }

  /**
   * Generate QR code SVG for scalable printing
   */
  static async generateQRCodeSVG(animal: Animal): Promise<string> {
    const url = this.generateAnimalUrl(animal.id);
    
    try {
      const qrCodeSvg = await QRCode.toString(url, {
        type: 'svg',
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeSvg;
    } catch (error) {
      console.error('Error generating SVG QR code:', error);
      throw new Error('Failed to generate SVG QR code');
    }
  }
}