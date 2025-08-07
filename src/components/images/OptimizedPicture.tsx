import { ImgHTMLAttributes, ReactNode } from 'react';
import { Box, Skeleton } from '@mui/material';
import { getSupportedFormats, getOptimizedImage, ImageSources } from '../../utils/imageUtils';

export interface OptimizedPictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Nom de l'image (pour les images prédéfinies) */
  imageName?: 'icon' | 'icon_with_title';
  /** Sources d'images personnalisées */
  sources?: ImageSources;
  /** Texte alternatif (obligatoire pour l'accessibilité) */
  alt: string;
  /** Affichage pendant le chargement */
  loading?: boolean;
  /** Fallback en cas d'erreur */
  fallback?: ReactNode;
  /** Lazy loading */
  lazy?: boolean;
  /** Tailles responsives */
  sizes?: string;
  /** Media queries pour différentes tailles */
  srcSet?: {
    avif?: string;
    webp?: string;
    fallback?: string;
  };
}

/**
 * Composant Picture optimisé avec support AVIF/WebP et fallbacks
 */
export const OptimizedPicture = ({
  imageName,
  sources: customSources,
  alt,
  loading = false,
  fallback,
  lazy = true,
  sizes,
  srcSet,
  style,
  ...imgProps
}: OptimizedPictureProps) => {
  const supportedFormats = getSupportedFormats();
  
  // Obtenir les sources d'images
  const sources = customSources || (imageName ? getOptimizedImage(imageName) : null);
  
  if (!sources) {
    console.warn('OptimizedPicture: Aucune source d\'image fournie');
    return fallback || <Box sx={{ bgcolor: 'grey.200', minHeight: 40 }} />;
  }

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          width: imgProps.width || '100%',
          height: imgProps.height || 'auto',
          ...style,
        }}
      />
    );
  }

  return (
    <picture>
      {/* Source AVIF */}
      {sources.avif && supportedFormats.avif && (
        <source
          srcSet={srcSet?.avif || sources.avif}
          type="image/avif"
          sizes={sizes}
        />
      )}
      
      {/* Source WebP */}
      {sources.webp && supportedFormats.webp && (
        <source
          srcSet={srcSet?.webp || sources.webp}
          type="image/webp"
          sizes={sizes}
        />
      )}
      
      {/* Fallback PNG/JPEG */}
      <img
        src={srcSet?.fallback || sources.fallback}
        alt={alt}
        loading={lazy ? 'lazy' : undefined}
        style={style}
        onError={(e) => {
          console.warn('Erreur de chargement de l\'image:', e);
          if (fallback) {
            (e.target as HTMLImageElement).style.display = 'none';
          }
        }}
        {...imgProps}
      />
    </picture>
  );
};

/**
 * Composant d'avatar optimisé
 */
export interface OptimizedAvatarProps extends Omit<OptimizedPictureProps, 'alt'> {
  /** Nom de la personne/entité (pour l'alt text) */
  name: string;
  /** Taille de l'avatar */
  size?: number;
  /** Variante circulaire */
  circular?: boolean;
}

export const OptimizedAvatar = ({
  name,
  size = 40,
  circular = true,
  style,
  ...props
}: OptimizedAvatarProps) => {
  return (
    <OptimizedPicture
      alt={`Avatar de ${name}`}
      style={{
        width: size,
        height: size,
        borderRadius: circular ? '50%' : undefined,
        objectFit: 'cover',
        ...style,
      }}
      {...props}
    />
  );
};