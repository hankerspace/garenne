import React, { forwardRef } from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardActions } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export type CardVariant = 'elevation' | 'outlined';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  /** Variante d'apparence */
  variant?: CardVariant;
  /** Contenu principal de la carte */
  children: React.ReactNode;
  /** Actions à afficher en bas de carte */
  actions?: React.ReactNode;
  /** Padding du contenu */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** État de survol interactif */
  hoverable?: boolean;
  /** État sélectionné */
  selected?: boolean;
  /** Styles personnalisés */
  sx?: SxProps<Theme>;
}

/**
 * Composant Card réutilisable avec variants standardisés
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children,
    actions,
    variant = 'elevation',
    padding = 'medium',
    hoverable = false,
    selected = false,
    sx,
    ...props
  }, ref) => {
    return (
      <MuiCard
        ref={ref}
        variant={variant}
        sx={{
          // Styles de base
          display: 'flex',
          flexDirection: 'column',
          
          // Effet de survol
          ...(hoverable && {
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: variant === 'elevation' ? 4 : 'none',
              borderColor: variant === 'outlined' ? 'primary.main' : undefined,
            },
          }),
          
          // État sélectionné
          ...(selected && {
            borderColor: 'primary.main',
            borderWidth: variant === 'outlined' ? 2 : 1,
            backgroundColor: 'primary.50',
            ...(variant === 'elevation' && {
              border: '2px solid',
              borderColor: 'primary.main',
            }),
          }),
          
          ...sx
        }}
        {...props}
      >
        <CardContent 
          sx={{ 
            flexGrow: 1,
            padding: {
              none: 0,
              small: 1,
              medium: 2,
              large: 3
            }[padding],
            '&:last-child': {
              paddingBottom: actions ? undefined : {
                none: 0,
                small: 1,
                medium: 2,
                large: 3
              }[padding]
            }
          }}
        >
          {children}
        </CardContent>
        
        {actions && (
          <CardActions 
            sx={{ 
              padding: {
                none: 0,
                small: 1,
                medium: 2,
                large: 3
              }[padding],
              paddingTop: 0
            }}
          >
            {actions}
          </CardActions>
        )}
      </MuiCard>
    );
  }
);

Card.displayName = 'Card';

export default Card;