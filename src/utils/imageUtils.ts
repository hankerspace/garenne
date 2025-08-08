/**
 * Utility for loading optimized images with format fallbacks
 */

// Import optimized images
import iconPng from '../assets/optimized/icon.png';
import iconWebp from '../assets/optimized/icon.webp';
import iconWithTitlePng from '../assets/optimized/icon_with_title.png';
import iconWithTitleWebp from '../assets/optimized/icon_with_title.webp';

export interface ImageSources {
  webp?: string;
  avif?: string;
  fallback: string;
}

/**
 * Get optimized image sources with fallbacks
 */
export function getOptimizedImage(imageName: 'icon' | 'icon_with_title'): ImageSources {
  switch (imageName) {
    case 'icon':
      return {
        webp: iconWebp,
        fallback: iconPng
      };
    case 'icon_with_title':
      return {
        webp: iconWithTitleWebp,
        fallback: iconWithTitlePng
      };
    default:
      throw new Error(`Unknown image: ${imageName}`);
  }
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Check if browser supports AVIF format
 */
export function supportsAVIF(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
}

/**
 * Get all supported formats for an image
 */
export function getSupportedFormats() {
  return {
    avif: supportsAVIF(),
    webp: supportsWebP(),
  };
}

/**
 * Get the best supported image format
 */
export function getBestImageSrc(imageName: 'icon' | 'icon_with_title'): string {
  const sources = getOptimizedImage(imageName);
  const supportedFormats = getSupportedFormats();
  
  // Return AVIF if supported and available, then WebP, then fallback
  if (sources.avif && supportedFormats.avif) {
    return sources.avif;
  }
  
  if (sources.webp && supportedFormats.webp) {
    return sources.webp;
  }
  
  return sources.fallback;
}