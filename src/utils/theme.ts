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
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
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
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
        },
      },
    },
  },
}, frFR);