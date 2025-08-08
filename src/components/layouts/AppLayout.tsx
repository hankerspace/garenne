import { ReactNode } from 'react';
import { Container, Box, ContainerProps, useTheme, useMediaQuery } from '@mui/material';

export interface AppLayoutProps {
  children: ReactNode;
  maxWidth?: ContainerProps['maxWidth'];
  disableGutters?: boolean;
  sx?: Record<string, any>;
  /** Enable multi-column layout for large screens */
  enableMultiColumn?: boolean;
  /** Sidebar content for multi-column layout */
  sidebar?: ReactNode;
}

/**
 * Consistent application layout wrapper
 * Provides standardized spacing, container width, and responsive behavior
 * Supports multi-column layouts for desktop screens
 */
export const AppLayout = ({ 
  children, 
  maxWidth = 'xl', 
  disableGutters = false,
  sx = {},
  enableMultiColumn = false,
  sidebar
}: AppLayoutProps) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const showMultiColumn = enableMultiColumn && sidebar && isLargeScreen;

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
        // Better space utilization on large screens
        ...(isLargeScreen && {
          px: { lg: 4, xl: 6 },
          py: { lg: 4 },
        }),
        ...sx
      }}
    >
      {showMultiColumn ? (
        <Box sx={{ 
          display: 'flex', 
          gap: 4, 
          flexGrow: 1,
          alignItems: 'flex-start',
        }}>
          <Box sx={{ flex: 1 }}>
            {children}
          </Box>
          <Box sx={{ 
            width: '300px',
            position: 'sticky',
            top: theme.spacing(2),
          }}>
            {sidebar}
          </Box>
        </Box>
      ) : (
        children
      )}
    </Container>
  );
};