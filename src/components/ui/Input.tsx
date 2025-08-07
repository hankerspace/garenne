import React, { forwardRef } from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export type InputVariant = 'outlined' | 'filled' | 'standard';
export type InputSize = 'small' | 'medium';

export interface InputProps extends Omit<TextFieldProps, 'variant' | 'size'> {
  /** Variante d'apparence */
  variant?: InputVariant;
  /** Taille de l'input */
  size?: InputSize;
  /** Icône de début */
  startIcon?: React.ReactNode;
  /** Icône de fin */
  endIcon?: React.ReactNode;
  /** État d'erreur avec message */
  error?: boolean;
  /** Message d'aide */
  helperText?: string;
  /** Message d'erreur spécifique */
  errorText?: string;
  /** Largeur complète */
  fullWidth?: boolean;
  /** Styles personnalisés */
  sx?: SxProps<Theme>;
}

/**
 * Composant Input réutilisable avec variants standardisés
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    variant = 'outlined',
    size = 'medium',
    startIcon,
    endIcon,
    error,
    helperText,
    errorText,
    sx,
    InputProps,
    ...props
  }, ref) => {
    return (
      <TextField
        ref={ref}
        variant={variant}
        size={size}
        error={error}
        helperText={error ? errorText : helperText}
        InputProps={{
          startAdornment: startIcon && (
            <InputAdornment position="start">
              {startIcon}
            </InputAdornment>
          ),
          endAdornment: endIcon && (
            <InputAdornment position="end">
              {endIcon}
            </InputAdornment>
          ),
          ...InputProps,
        }}
        sx={{
          // Styles par défaut
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
            },
          },
          
          // État d'erreur
          ...(error && {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'error.main',
              },
            },
          }),
          
          ...sx
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;