import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface LazyImageProps {
  /** URL de l'image source */
  src: string;
  /** Texte alternatif */
  alt: string;
  /** URL de l'image placeholder en basse résolution (optionnel) */
  placeholder?: string;
  /** Largeur de l'image */
  width?: number | string;
  /** Hauteur de l'image */
  height?: number | string;
  /** Classes CSS personnalisées */
  className?: string;
  /** Styles personnalisés */
  sx?: SxProps<Theme>;
  /** Callback appelé quand l'image est chargée */
  onLoad?: () => void;
  /** Callback appelé en cas d'erreur de chargement */
  onError?: () => void;
  /** Seuil de visibilité pour l'Intersection Observer (0-1) */
  threshold?: number;
  /** Marge autour du viewport pour déclencher le chargement */
  rootMargin?: string;
}

/**
 * Composant d'image avec lazy loading utilisant l'Intersection Observer API
 * 
 * Features:
 * - Chargement différé quand l'image entre dans le viewport
 * - Support des placeholders et skeletons
 * - Gestion des erreurs de chargement
 * - Optimisation des performances avec Intersection Observer
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  width,
  height,
  className,
  sx,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [actualSrc, setActualSrc] = useState(placeholder || '');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer pour détecter quand l'image entre dans le viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // Chargement de l'image une fois qu'elle est dans le viewport
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      const img = new Image();
      
      img.onload = () => {
        setActualSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      
      img.onerror = () => {
        setHasError(true);
        onError?.();
      };
      
      img.src = src;
    }
  }, [isInView, isLoaded, hasError, src, onLoad, onError]);

  const containerStyles = {
    width,
    height,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    ...sx
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0.7
  };

  return (
    <Box ref={containerRef} sx={containerStyles} className={className}>
      {!isInView || (!isLoaded && !hasError) ? (
        // Afficher le skeleton ou placeholder tant que l'image n'est pas chargée
        placeholder ? (
          <img
            src={placeholder}
            alt={alt}
            style={{
              ...imageStyles,
              filter: 'blur(5px)',
              opacity: 0.5
            }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )
      ) : hasError ? (
        // Afficher un placeholder en cas d'erreur
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'grey.500'
          }}
        >
          Image non disponible
        </Box>
      ) : (
        // Afficher l'image chargée
        <img
          ref={imgRef}
          src={actualSrc}
          alt={alt}
          style={imageStyles}
          loading="lazy" // Support natif du navigateur en fallback
        />
      )}
    </Box>
  );
};

export default LazyImage;