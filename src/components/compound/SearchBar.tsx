import { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Autocomplete,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  activeFiltersCount?: number;
}

/**
 * Reusable search bar with suggestions and filter toggle
 */
export const SearchBar = ({
  value,
  onChange,
  suggestions = [],
  onSuggestionSelect,
  placeholder = 'Rechercher...',
  disabled = false,
  fullWidth = true,
  showFilters = false,
  onToggleFilters,
  activeFiltersCount = 0,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedSearch = useDebounce(onChange, 300);

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue);
    debouncedSearch(newValue);
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    setInputValue('');
    onChange('');
  }, [onChange]);

  const renderInput = (params: any) => (
    <TextField
      {...params}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth={fullWidth}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {value && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  disabled={disabled}
                  aria-label="Effacer la recherche"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              {showFilters && (
                <IconButton
                  size="small"
                  onClick={onToggleFilters}
                  disabled={disabled}
                  aria-label="Basculer les filtres"
                  color={activeFiltersCount > 0 ? 'primary' : 'default'}
                >
                  <FilterIcon fontSize="small" />
                  {activeFiltersCount > 0 && (
                    <Chip
                      size="small"
                      label={activeFiltersCount}
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        minWidth: 16,
                        height: 16,
                        fontSize: '0.625rem',
                      }}
                    />
                  )}
                </IconButton>
              )}
            </Box>
          </InputAdornment>
        ),
      }}
    />
  );

  if (suggestions.length > 0) {
    return (
      <Autocomplete
        freeSolo
        options={suggestions}
        value={value}
        inputValue={inputValue}
        onInputChange={(_, newValue) => handleInputChange(newValue)}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            onChange(newValue);
            onSuggestionSelect?.(newValue);
          }
        }}
        renderInput={renderInput}
        PaperComponent={({ children, ...props }) => (
          <Paper {...props} elevation={2}>
            {children}
          </Paper>
        )}
        disabled={disabled}
      />
    );
  }

  return renderInput({
    InputProps: {},
    value: inputValue,
    onChange: (e: any) => handleInputChange(e.target.value),
  });
};