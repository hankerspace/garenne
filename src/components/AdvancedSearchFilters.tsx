import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Button,
  Collapse,
  Paper,
  Typography,
  InputAdornment,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { SearchFilters } from '../services/search.service';
import { Sex, Status } from '../models/types';
import { useTranslation } from '../hooks/useTranslation';
import { useDebounce } from '../hooks/usePerformance';

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  suggestions: string[];
  filterOptions: {
    breeds: string[];
    cages: string[];
    tags: string[];
    statuses: Status[];
    sexes: Sex[];
  };
}

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  suggestions,
  filterOptions,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  // Local state for immediate UI updates
  const [localQuery, setLocalQuery] = useState(filters.query || '');
  
  // Debounced query for actual filtering
  const debouncedQuery = useDebounce(localQuery, 300);
  
  // Update filters when debounced query changes
  React.useEffect(() => {
    onFiltersChange({
      ...filters,
      query: debouncedQuery || undefined,
    });
  }, [debouncedQuery, filters, onFiltersChange]);
  
  // Update local query when external filters change
  React.useEffect(() => {
    if (filters.query !== localQuery) {
      setLocalQuery(filters.query || '');
    }
  }, [filters.query, localQuery]);

  const handleQueryChange = (newQuery: string) => {
    setLocalQuery(newQuery);
  };

  const handleStatusChange = (statuses: Status[]) => {
    onFiltersChange({
      ...filters,
      status: statuses.length > 0 ? statuses : undefined,
    });
  };

  const handleSexChange = (sexes: Sex[]) => {
    onFiltersChange({
      ...filters,
      sex: sexes.length > 0 ? sexes : undefined,
    });
  };

  const handleBreedChange = (breeds: string[]) => {
    onFiltersChange({
      ...filters,
      breed: breeds.length > 0 ? breeds : undefined,
    });
  };

  const handleCageChange = (cages: string[]) => {
    onFiltersChange({
      ...filters,
      cage: cages.length > 0 ? cages : undefined,
    });
  };

  const handleTagChange = (tags: string[]) => {
    onFiltersChange({
      ...filters,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  const handleDateRangeChange = (start?: string, end?: string) => {
    if (start && end) {
      onFiltersChange({
        ...filters,
        dateRange: { start, end },
      });
    } else {
      const newFilters = { ...filters };
      delete newFilters.dateRange;
      onFiltersChange(newFilters);
    }
  };

  const handleWeightRangeChange = (min?: number, max?: number) => {
    if (min !== undefined && max !== undefined && !isNaN(min) && !isNaN(max)) {
      onFiltersChange({
        ...filters,
        weightRange: { min, max },
      });
    } else {
      const newFilters = { ...filters };
      delete newFilters.weightRange;
      onFiltersChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some(key => {
      const value = filters[key as keyof SearchFilters];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return true;
      return value !== undefined && value !== '';
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.status?.length) count++;
    if (filters.sex?.length) count++;
    if (filters.breed?.length) count++;
    if (filters.cage?.length) count++;
    if (filters.tags?.length) count++;
    if (filters.dateRange) count++;
    if (filters.weightRange) count++;
    return count;
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* Main Search Bar */}
      <Box sx={{ mb: 2 }}>
        <Autocomplete
          freeSolo
          options={suggestions}
          value={localQuery}
          onInputChange={(_, newValue) => handleQueryChange(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              placeholder={t('search.intelligentPlaceholder')}
              size="medium"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* Filter Toggle and Clear */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Button
          startIcon={<FilterIcon />}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setExpanded(!expanded)}
          variant="outlined"
          size="small"
        >
          {t('search.advancedFilters')} {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </Button>

        {hasActiveFilters() && (
          <Button
            startIcon={<ClearIcon />}
            onClick={clearAllFilters}
            size="small"
            color="error"
          >
            {t('search.clearFilters')}
          </Button>
        )}
      </Box>

      {/* Advanced Filters */}
      <Collapse in={expanded}>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t('animals.status')}</InputLabel>
              <Select
                multiple
                value={filters.status || []}
                onChange={(e) => handleStatusChange(e.target.value as Status[])}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={t(`status.${value}`)} size="small" />
                    ))}
                  </Box>
                )}
              >
                {filterOptions.statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`status.${status}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sex Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t('animals.sex')}</InputLabel>
              <Select
                multiple
                value={filters.sex || []}
                onChange={(e) => handleSexChange(e.target.value as Sex[])}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={t(`sex.${value}`)} size="small" />
                    ))}
                  </Box>
                )}
              >
                {filterOptions.sexes.map((sex) => (
                  <MenuItem key={sex} value={sex}>
                    {t(`sex.${sex}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Breed Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={filterOptions.breeds}
              value={filters.breed || []}
              onChange={(_, newValue) => handleBreedChange(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label={t('animals.breed')} />
              )}
            />
          </Grid>

          {/* Cage Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={filterOptions.cages}
              value={filters.cage || []}
              onChange={(_, newValue) => handleCageChange(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label={t('cages.title')} />
              )}
            />
          </Grid>

          {/* Tags Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={filterOptions.tags}
              value={filters.tags || []}
              onChange={(_, newValue) => handleTagChange(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label={t('animals.tags')} />
              )}
            />
          </Grid>

          {/* Date Range Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" gutterBottom>
              {t('search.birthDateRange')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label={t('common.from')}
                type="date"
                size="small"
                value={filters.dateRange?.start || ''}
                onChange={(e) => handleDateRangeChange(e.target.value, filters.dateRange?.end)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t('common.to')}
                type="date"
                size="small"
                value={filters.dateRange?.end || ''}
                onChange={(e) => handleDateRangeChange(filters.dateRange?.start, e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          {/* Weight Range Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" gutterBottom>
              {t('search.weightRange')} (g)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label={t('common.min')}
                type="number"
                size="small"
                value={filters.weightRange?.min || ''}
                onChange={(e) => {
                  const min = parseInt(e.target.value);
                  handleWeightRangeChange(
                    !isNaN(min) ? min : undefined, 
                    filters.weightRange?.max
                  );
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
              <TextField
                label={t('common.max')}
                type="number"
                size="small"
                value={filters.weightRange?.max || ''}
                onChange={(e) => {
                  const max = parseInt(e.target.value);
                  handleWeightRangeChange(
                    filters.weightRange?.min,
                    !isNaN(max) ? max : undefined
                  );
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Search Tips */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 {t('search.tips')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {t('search.tip1')}<br />
            • {t('search.tip2')}<br />
            • {t('search.tip3')}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};