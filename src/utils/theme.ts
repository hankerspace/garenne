import { createTheme, Theme } from '@mui/material/styles';
import { frFR } from '@mui/material/locale';
import { colors, typography, borderRadius, shadows } from './tokens';

// Define the theme colors and typography using design tokens
export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[500],
    },
    secondary: {
      main: colors.secondary[200],
      light: colors.secondary[100],
      dark: colors.secondary[300],
    },
    background: {
      default: colors.neutral[50],
      paper: '#ffffff',
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    info: {
      main: colors.info[500],
      light: colors.info[300],
      dark: colors.info[700],
    },
  },
  typography: {
    fontFamily: typography.fontFamily.sans.join(', '),
    h4: {
      fontWeight: typography.fontWeight.semibold,
    },
    h5: {
      fontWeight: typography.fontWeight.semibold,
    },
    h6: {
      fontWeight: typography.fontWeight.semibold,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          boxShadow: shadows.base,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.base,
          textTransform: 'none',
          fontWeight: typography.fontWeight.semibold,
          // Ensure minimum touch target size (44px per WCAG guidelines)
          minHeight: '44px',
          '@media (max-width: 600px)': {
            minHeight: '48px', // Larger touch targets on mobile
            fontSize: '0.875rem',
          },
        },
        sizeSmall: {
          minHeight: '36px',
          '@media (max-width: 600px)': {
            minHeight: '44px',
            padding: '8px 16px',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          // Ensure good touch target for FAB
          width: '56px',
          height: '56px',
          '@media (max-width: 600px)': {
            width: '60px',
            height: '60px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Ensure minimum touch target for icon buttons
          minHeight: '44px',
          minWidth: '44px',
          '@media (max-width: 600px)': {
            minHeight: '48px',
            minWidth: '48px',
          },
        },
        sizeSmall: {
          minHeight: '36px',
          minWidth: '36px',
          '@media (max-width: 600px)': {
            minHeight: '44px',
            minWidth: '44px',
          },
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          // Ensure good touch targets for bottom navigation
          minHeight: '56px',
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            '@media (max-width: 480px)': {
              fontSize: '0.625rem', // Smaller text on very small screens
            },
          },
        },
      },
    },
  },
}, frFR);

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[300],
      light: colors.primary[200],
      dark: colors.primary[400],
    },
    secondary: {
      main: colors.secondary[300],
      light: colors.secondary[200],
      dark: colors.secondary[400],
    },
    background: {
      default: colors.neutral[900],
      paper: colors.neutral[800],
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    info: {
      main: colors.info[500],
      light: colors.info[300],
      dark: colors.info[700],
    },
  },
  typography: {
    fontFamily: typography.fontFamily.sans.join(', '),
    h4: {
      fontWeight: typography.fontWeight.semibold,
    },
    h5: {
      fontWeight: typography.fontWeight.semibold,
    },
    h6: {
      fontWeight: typography.fontWeight.semibold,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          boxShadow: shadows.lg,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.base,
          textTransform: 'none',
          fontWeight: typography.fontWeight.semibold,
          // Ensure minimum touch target size (44px per WCAG guidelines)
          minHeight: '44px',
          '@media (max-width: 600px)': {
            minHeight: '48px', // Larger touch targets on mobile
            fontSize: '0.875rem',
          },
        },
        sizeSmall: {
          minHeight: '36px',
          '@media (max-width: 600px)': {
            minHeight: '44px',
            padding: '8px 16px',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          // Ensure good touch target for FAB
          width: '56px',
          height: '56px',
          '@media (max-width: 600px)': {
            width: '60px',
            height: '60px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Ensure minimum touch target for icon buttons
          minHeight: '44px',
          minWidth: '44px',
          '@media (max-width: 600px)': {
            minHeight: '48px',
            minWidth: '48px',
          },
        },
        sizeSmall: {
          minHeight: '36px',
          minWidth: '36px',
          '@media (max-width: 600px)': {
            minHeight: '44px',
            minWidth: '44px',
          },
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          // Ensure good touch targets for bottom navigation
          minHeight: '56px',
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            '@media (max-width: 480px)': {
              fontSize: '0.625rem', // Smaller text on very small screens
            },
          },
        },
      },
    },
  },
}, frFR);