import { ReactNode } from 'react';
import { Container, Box, ContainerProps } from '@mui/material';

export interface AppLayoutProps {
  children: ReactNode;
  maxWidth?: ContainerProps['maxWidth'];
  disableGutters?: boolean;
  sx?: Record<string, any>;
}

/**
 * Consistent application layout wrapper
 * Provides standardized spacing, container width, and responsive behavior
 */
export const AppLayout = ({ 
  children, 
  maxWidth = 'xl', 
  disableGutters = false,
  sx = {}
}: AppLayoutProps) => {
  return (
    <Container 
      maxWidth={maxWidth} 
      disableGutters={disableGutters}
      sx={{
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        minHeight: 'calc(100vh - 64px - 56px)', // Account for AppBar and BottomNavigation
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {children}
    </Container>
  );
};