import { ReactNode } from 'react';
import {
  Box,
  Paper,
  Collapse,
  Chip,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { ANIMATION_CONSTANTS } from '../../constants';

export interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  activeFilters?: Array<{
    label: string;
    value: string;
    onRemove: () => void;
  }>;
  onClearAll?: () => void;
}

/**
 * Reusable filter panel component
 * Provides collapsible filter interface with active filter display
 */
export const FilterPanel = ({
  open,
  onClose,
  title = 'Filtres',
  children,
  activeFilters = [],
  onClearAll,
}: FilterPanelProps) => {
  return (
    <Collapse in={open} timeout={ANIMATION_CONSTANTS.COLLAPSE_TIMEOUT}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mt: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon color="action" />
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            {activeFilters.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                ({activeFilters.length} actif{activeFilters.length > 1 ? 's' : ''})
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Fermer les filtres"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Filtres actifs:
              </Typography>
              {onClearAll && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={onClearAll}
                >
                  Tout effacer
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeFilters.map((filter, index) => (
                <Chip
                  key={`${filter.value}-${index}`}
                  label={filter.label}
                  onDelete={filter.onRemove}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
        )}

        {/* Filter Content */}
        <Box>{children}</Box>
      </Paper>
    </Collapse>
  );
};