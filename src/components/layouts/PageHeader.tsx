import { ReactNode } from 'react';
import { Box, Typography, Divider } from '@mui/material';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

/**
 * Consistent page header component
 * Provides standardized title, subtitle, and action buttons layout
 */
export const PageHeader = ({ title, subtitle, actions, children }: PageHeaderProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
          mb: subtitle || children ? 2 : 0
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2rem' },
              fontWeight: 600,
              mb: subtitle ? 0.5 : 0
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {actions}
          </Box>
        )}
      </Box>
      {children}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};