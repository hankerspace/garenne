import React, { forwardRef } from 'react';
import { Card, CardProps, CardActionArea } from '@mui/material';
import { useKeyboardNavigation } from '../hooks/useAccessibility';

export interface AccessibleCardProps extends CardProps {
  /** Fonction appelée lors du clic/activation de la carte */
  onActivate?: () => void;
  /** Index de la carte dans une liste (pour la navigation clavier) */
  index?: number;
  /** Description pour les lecteurs d'écran */
  ariaLabel?: string;
  /** Indique si la carte est sélectionnée */
  selected?: boolean;
  /** Rôle ARIA personnalisé */
  role?: string;
}

/**
 * Carte améliorée avec navigation clavier et accessibilité
 */
export const AccessibleCard = forwardRef<HTMLDivElement, AccessibleCardProps>(
  ({ 
    children, 
    onActivate, 
    index, 
    ariaLabel, 
    selected, 
    role = onActivate ? 'button' : undefined,
    ...props 
  }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (onActivate && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onActivate();
      }
    };

    if (onActivate) {
      return (
        <Card 
          {...props}
          ref={ref}
          sx={{
            ...props.sx,
            // Améliorer l'indication de focus
            '&:focus-within': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px'
            },
            // Indiquer visuellement les cartes sélectionnées
            ...(selected && {
              borderColor: 'primary.main',
              borderWidth: 2,
              backgroundColor: 'primary.50'
            }),
            // Améliorer l'affordance pour les cartes cliquables
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 2
            }
          }}
        >
          <CardActionArea 
            onClick={onActivate}
            onKeyDown={handleKeyDown}
            role={role}
            aria-label={ariaLabel}
            aria-pressed={selected}
            data-index={index}
            sx={{ height: '100%' }}
          >
            {children}
          </CardActionArea>
        </Card>
      );
    }

    return (
      <Card 
        {...props}
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        aria-pressed={selected}
        data-index={index}
        tabIndex={onActivate ? 0 : undefined}
        onKeyDown={onActivate ? handleKeyDown : undefined}
        sx={{
          ...props.sx,
          // Améliorer l'indication de focus
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px'
          },
          // Indiquer visuellement les cartes sélectionnées
          ...(selected && {
            borderColor: 'primary.main',
            borderWidth: 2,
            backgroundColor: 'primary.50'
          })
        }}
      >
        {children}
      </Card>
    );
  }
);

AccessibleCard.displayName = 'AccessibleCard';