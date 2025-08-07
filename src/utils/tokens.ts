/**
 * Design System Tokens for Garenne Application
 * 
 * These tokens provide a consistent foundation for the design system,
 * making it easy to maintain visual consistency across components.
 */

// Color palette
export const colors = {
  // Primary colors (rabbit-themed browns)
  primary: {
    50: '#F5EFDF',
    100: '#E8D9C0',
    200: '#D4C5A8',
    300: '#C4905A',
    400: '#A4703A',
    500: '#84502A',
    600: '#6B4122',
    700: '#52321A',
    800: '#392313',
    900: '#20140B',
  },
  
  // Secondary colors (warm tones)
  secondary: {
    50: '#FEFCF9',
    100: '#F9F4EC',
    200: '#F2E8D5',
    300: '#E8D9C0',
    400: '#DCC9A8',
    500: '#C4A57B',
    600: '#A08660',
    700: '#7D6847',
    800: '#5A4A32',
    900: '#382D1F',
  },
  
  // Status colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

// Spacing scale (based on 4px grid)
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
};

// Typography scale
export const typography = {
  fontFamily: {
    sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    mono: ['Roboto Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Border radius
export const borderRadius = {
  none: '0px',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Component variants
export const variants = {
  button: {
    sizes: {
      xs: {
        padding: `${spacing[1]} ${spacing[3]}`,
        fontSize: typography.fontSize.xs,
        borderRadius: borderRadius.sm,
      },
      sm: {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: typography.fontSize.sm,
        borderRadius: borderRadius.base,
      },
      md: {
        padding: `${spacing[3]} ${spacing[6]}`,
        fontSize: typography.fontSize.base,
        borderRadius: borderRadius.base,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[8]}`,
        fontSize: typography.fontSize.lg,
        borderRadius: borderRadius.md,
      },
    },
  },
  
  input: {
    sizes: {
      sm: {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm,
        borderRadius: borderRadius.sm,
      },
      md: {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
        borderRadius: borderRadius.base,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[5]}`,
        fontSize: typography.fontSize.lg,
        borderRadius: borderRadius.base,
      },
    },
  },
  
  card: {
    sizes: {
      sm: {
        padding: spacing[4],
        borderRadius: borderRadius.md,
      },
      md: {
        padding: spacing[6],
        borderRadius: borderRadius.lg,
      },
      lg: {
        padding: spacing[8],
        borderRadius: borderRadius.xl,
      },
    },
  },
};

// Transitions and animations
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Export all tokens as a single object for easy consumption
export const tokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  variants,
  transitions,
};

export default tokens;