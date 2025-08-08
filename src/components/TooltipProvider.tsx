import { ReactNode, ReactElement, cloneElement } from 'react';
import { Tooltip, useMediaQuery, useTheme } from '@mui/material';

export interface EnhancedTooltipProps {
  /** Child element to wrap with tooltip */
  children: ReactElement;
  /** Tooltip title */
  title: string;
  /** Keyboard shortcut to display */
  shortcut?: string;
  /** Whether to show tooltip on desktop only */
  desktopOnly?: boolean;
  /** Tooltip placement */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing tooltip */
  enterDelay?: number;
}

/**
 * Enhanced tooltip component with keyboard shortcut support
 * Automatically hides on mobile devices for better UX
 */
export const EnhancedTooltip = ({
  children,
  title,
  shortcut,
  desktopOnly = true,
  placement = 'top',
  enterDelay = 500,
}: EnhancedTooltipProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Hide tooltips on mobile unless explicitly requested
  if (desktopOnly && isMobile) {
    return children;
  }

  const tooltipTitle = shortcut ? `${title} (${shortcut})` : title;

  return (
    <Tooltip
      title={tooltipTitle}
      placement={placement}
      enterDelay={enterDelay}
      arrow
    >
      {children}
    </Tooltip>
  );
};

export interface TooltipProviderProps {
  children: ReactNode;
  /** Whether to enable keyboard shortcuts globally */
  enableShortcuts?: boolean;
}

/**
 * Provider component for managing global tooltip behavior
 * Can be extended to handle global keyboard shortcuts
 */
export const TooltipProvider = ({ 
  children, 
  enableShortcuts = true 
}: TooltipProviderProps) => {
  // Future: Add global keyboard shortcut handling here
  
  return <>{children}</>;
};