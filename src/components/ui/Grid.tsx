import React from 'react';
import { Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export interface GridProps extends MuiGridProps {
  /** Espacement entre les éléments */
  spacing?: number;
  /** Alignement horizontal */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /** Alignement vertical */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  /** Styles personnalisés */
  sx?: SxProps<Theme>;
}

/**
 * Composant Grid conteneur
 */
export const GridContainer: React.FC<GridProps> = ({ 
  children, 
  spacing = 2,
  justify = 'flex-start',
  align = 'stretch',
  sx,
  ...props 
}) => (
  <MuiGrid 
    container 
    spacing={spacing}
    justifyContent={justify}
    alignItems={align}
    sx={sx}
    {...props}
  >
    {children}
  </MuiGrid>
);

/**
 * Composant Grid item avec props responsive simplifiées
 */
export interface GridItemProps extends MuiGridProps {
  /** Colonnes sur mobile (xs) */
  xs?: number | 'auto' | boolean;
  /** Colonnes sur tablette (sm) */
  sm?: number | 'auto' | boolean;
  /** Colonnes sur desktop (md) */
  md?: number | 'auto' | boolean;
  /** Colonnes sur large desktop (lg) */
  lg?: number | 'auto' | boolean;
  /** Colonnes sur extra large desktop (xl) */
  xl?: number | 'auto' | boolean;
  /** Styles personnalisés */
  sx?: SxProps<Theme>;
}

export const GridItem: React.FC<GridItemProps> = ({ 
  children,
  xs = 12,
  sm,
  md,
  lg,
  xl,
  sx,
  ...props 
}) => (
  <MuiGrid 
    item 
    xs={xs}
    sm={sm}
    md={md}
    lg={lg}
    xl={xl}
    sx={sx}
    {...props}
  >
    {children}
  </MuiGrid>
);

export default { Container: GridContainer, Item: GridItem };