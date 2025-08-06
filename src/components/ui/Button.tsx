import React, { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export type ButtonVariant = 'text' | 'outlined' | 'contained';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size' | 'color'> {
  /** Variante d'apparence du bouton */
  variant?: ButtonVariant;
  /** Taille du bouton */
  size?: ButtonSize;
  /** Couleur du bouton */
  color?: ButtonColor;
  /** Icône à afficher avant le texte */
  startIcon?: React.ReactNode;
  /** Icône à afficher après le texte */
  endIcon?: React.ReactNode;
  /** État de chargement */
  loading?: boolean;
  /** Largeur complète */
  fullWidth?: boolean;
  /** Styles personnalisés */
  sx?: SxProps<Theme>;
}

/**
 * Composant Button réutilisable avec variants standardisés
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'contained', 
    size = 'medium', 
    color = 'primary',
    loading = false,
    disabled,
    startIcon,
    endIcon,
    sx,
    ...props 
  }, ref) => {
    return (
      <MuiButton
        ref={ref}
        variant={variant}
        size={size}
        color={color}
        disabled={disabled || loading}
        startIcon={loading ? undefined : startIcon}
        endIcon={loading ? undefined : endIcon}
        sx={{
          // Styles par défaut
          minHeight: {
            small: '32px',
            medium: '40px', 
            large: '48px'
          }[size],
          
          // Animation de chargement
          ...(loading && {
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '16px',
              height: '16px',
              margin: 'auto',
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            },
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }),
          
          ...sx
        }}
        {...props}
      >
        {loading ? '' : children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;