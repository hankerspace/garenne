import React, { useRef, useEffect } from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useAccessibility, useScreenReaderAnnouncement } from '../hooks/useAccessibility';
import { ANIMATION_CONSTANTS } from '../constants';

export interface AccessibleSearchProps extends Omit<TextFieldProps, 'onChange'> {
  /** Valeur de recherche */
  value: string;
  /** Fonction appelée lors du changement de valeur */
  onChange: (value: string) => void;
  /** Raccourci clavier pour focus sur le champ (ex: "ctrl+k") */
  keyboardShortcut?: string;
  /** Nombre de résultats trouvés */
  resultCount?: number;
  /** Texte affiché pour annoncer les résultats aux lecteurs d'écran */
  resultAnnouncement?: string;
}

/**
 * Composant de recherche avec accessibilité améliorée
 */
export const AccessibleSearch: React.FC<AccessibleSearchProps> = ({
  value,
  onChange,
  keyboardShortcut = 'ctrl+k',
  resultCount,
  resultAnnouncement,
  placeholder = 'Rechercher...',
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { announce } = useScreenReaderAnnouncement();
  
  const { getAccessibilityProps } = useAccessibility({
    ariaLabel: `Champ de recherche${keyboardShortcut ? ` (${keyboardShortcut})` : ''}`,
    keyboardShortcut,
    onKeyboardActivation: () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  });

  // Annoncer les résultats de recherche
  useEffect(() => {
    if (resultAnnouncement && value) {
      const announcement = resultAnnouncement || 
        (resultCount !== undefined 
          ? `${resultCount} résultat${resultCount !== 1 ? 's' : ''} trouvé${resultCount !== 1 ? 's' : ''}`
          : 'Résultats mis à jour');
      
      // Délai pour éviter trop d'annonces pendant la saisie
      const timeoutId = setTimeout(() => {
        announce(announcement, 'polite');
      }, ANIMATION_CONSTANTS.SEARCH_DEBOUNCE_DELAY);

      return () => clearTimeout(timeoutId);
    }
  }, [resultCount, resultAnnouncement, value, announce]);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
    announce('Recherche effacée', 'polite');
  };

  return (
    <TextField
      {...props}
      {...getAccessibilityProps()}
      inputRef={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" aria-hidden="true" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              aria-label="Effacer la recherche"
              onClick={handleClear}
              edge="end"
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
        // Améliorer l'accessibilité du champ
        role: 'searchbox',
        'aria-autocomplete': 'list',
        'aria-expanded': Boolean(value),
        'aria-owns': value ? 'search-results' : undefined,
        ...props.InputProps
      }}
      // Ajouter des informations sur les résultats pour les lecteurs d'écran
      helperText={
        value && resultCount !== undefined 
          ? `${resultCount} résultat${resultCount !== 1 ? 's' : ''} trouvé${resultCount !== 1 ? 's' : ''}`
          : props.helperText
      }
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main'
          },
          '&.Mui-focused fieldset': {
            borderWidth: 2
          }
        },
        ...props.sx
      }}
    />
  );
};

export default AccessibleSearch;