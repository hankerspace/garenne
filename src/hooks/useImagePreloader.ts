import { getOptimizedImage, getSupportedFormats } from '../utils/imageUtils';

/**
 * Hook pour précharger des images
 */
export const useImagePreloader = (imageNames: Array<'icon' | 'icon_with_title'>) => {
  const preloadImages = () => {
    imageNames.forEach(imageName => {
      const sources = getOptimizedImage(imageName);
      const supportedFormats = getSupportedFormats();
      
      // Précharger le meilleur format supporté
      let srcToPreload = sources.fallback;
      if (sources.avif && supportedFormats.avif) {
        srcToPreload = sources.avif;
      } else if (sources.webp && supportedFormats.webp) {
        srcToPreload = sources.webp;
      }
      
      // Créer un élément image pour précharger
      const img = new Image();
      img.src = srcToPreload;
    });
  };

  return { preloadImages };
};