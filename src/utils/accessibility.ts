/**
 * Accessibility utilities and constants
 * 
 * Provides centralized ARIA labels and accessibility helpers
 * to ensure consistent accessibility across the application.
 */

import { A11Y_CONSTANTS } from '../constants';

// ARIA labels for common UI elements
export const ARIA_LABELS = {
  // Navigation
  navigation: {
    main: 'Navigation principale',
    breadcrumb: 'Fil d\'ariane',
    pagination: 'Navigation de pagination',
    tabs: 'Onglets de navigation',
    search: 'Recherche',
    filter: 'Filtres',
    sort: 'Tri',
  },

  // Actions
  actions: {
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    open: 'Ouvrir',
    refresh: 'Actualiser',
    export: 'Exporter',
    import: 'Importer',
    print: 'Imprimer',
    share: 'Partager',
    copy: 'Copier',
    settings: 'Paramètres',
  },

  // Data and content
  content: {
    loading: 'Chargement en cours',
    error: 'Erreur',
    warning: 'Avertissement',
    success: 'Succès',
    info: 'Information',
    empty: 'Aucun élément',
    required: 'Champ requis',
    optional: 'Champ optionnel',
  },

  // Specific to Garenne app
  animals: {
    list: 'Liste des animaux',
    details: 'Détails de l\'animal',
    add: 'Ajouter un animal',
    edit: 'Modifier l\'animal',
    weight: 'Poids de l\'animal',
    gender: 'Sexe de l\'animal',
    birth: 'Date de naissance',
    cage: 'Cage de l\'animal',
    status: 'Statut de l\'animal',
    qrcode: 'QR Code de l\'animal',
  },

  litters: {
    list: 'Liste des portées',
    details: 'Détails de la portée',
    add: 'Ajouter une portée',
    edit: 'Modifier la portée',
    birth: 'Date de naissance de la portée',
    weaning: 'Date de sevrage',
    size: 'Taille de la portée',
  },

  cages: {
    list: 'Liste des cages',
    details: 'Détails de la cage',
    add: 'Ajouter une cage',
    edit: 'Modifier la cage',
    capacity: 'Capacité de la cage',
    occupancy: 'Occupation de la cage',
    type: 'Type de cage',
  },
} as const;

// Screen reader announcements
export const ANNOUNCEMENTS = {
  navigation: {
    pageChanged: (pageName: string) => `Navigation vers ${pageName}`,
    filterApplied: (filterName: string) => `Filtre ${filterName} appliqué`,
    sortChanged: (sortType: string) => `Tri modifié : ${sortType}`,
  },

  actions: {
    saved: 'Modifications enregistrées',
    deleted: 'Élément supprimé',
    added: 'Élément ajouté',
    error: 'Une erreur s\'est produite',
    loading: 'Chargement en cours, veuillez patienter',
    loadingComplete: 'Chargement terminé',
  },

  data: {
    resultsCount: (count: number) => 
      count === 0 
        ? 'Aucun résultat trouvé'
        : count === 1 
          ? '1 résultat trouvé'
          : `${count} résultats trouvés`,
    
    itemsSelected: (count: number) =>
      count === 0
        ? 'Aucun élément sélectionné'
        : count === 1
          ? '1 élément sélectionné'
          : `${count} éléments sélectionnés`,
  },
} as const;

/**
 * Generate ARIA describedby ID for a field
 */
export const getAriaDescribedBy = (fieldId: string, hasError?: boolean, hasHelp?: boolean) => {
  const ids: string[] = [];
  if (hasError) ids.push(`${fieldId}-error`);
  if (hasHelp) ids.push(`${fieldId}-help`);
  return ids.length > 0 ? ids.join(' ') : undefined;
};

/**
 * Generate ARIA labelledby ID for compound components
 */
export const getAriaLabelledBy = (componentId: string, ...suffixes: string[]) => {
  return suffixes.map(suffix => `${componentId}-${suffix}`).join(' ');
};

/**
 * Create accessible form field props
 */
export const getAccessibleFieldProps = (
  fieldId: string,
  label: string,
  options: {
    required?: boolean;
    error?: string;
    help?: string;
    ariaLabel?: string;
  } = {}
) => {
  const { required, error, help, ariaLabel } = options;
  
  return {
    id: fieldId,
    'aria-label': ariaLabel || label,
    'aria-required': required,
    'aria-invalid': !!error,
    'aria-describedby': getAriaDescribedBy(fieldId, !!error, !!help),
  };
};

/**
 * Create accessible button props
 */
export const getAccessibleButtonProps = (
  label: string,
  options: {
    expanded?: boolean;
    controls?: string;
    describedBy?: string;
    disabled?: boolean;
  } = {}
) => {
  const { expanded, controls, describedBy, disabled } = options;
  
  return {
    'aria-label': label,
    'aria-expanded': expanded,
    'aria-controls': controls,
    'aria-describedby': describedBy,
    'aria-disabled': disabled,
  };
};

/**
 * Create accessible table props
 */
export const getAccessibleTableProps = (
  caption: string,
  options: {
    sortable?: boolean;
    selectable?: boolean;
  } = {}
) => {
  const { sortable, selectable } = options;
  
  return {
    role: 'table',
    'aria-label': caption,
    'aria-describedby': sortable 
      ? 'table-sort-help' 
      : selectable 
        ? 'table-select-help' 
        : undefined,
  };
};

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Focus an element with timeout for better accessibility
   */
  focusElement: (element: HTMLElement | null, delay = A11Y_CONSTANTS.FOCUS_TIMEOUT) => {
    if (element) {
      setTimeout(() => {
        element.focus();
      }, delay);
    }
  },

  /**
   * Focus first focusable element in container
   */
  focusFirstFocusable: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      focusManagement.focusElement(firstElement);
    }
  },

  /**
   * Trap focus within a container (useful for modals)
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    focusManagement.focusElement(firstElement);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },
};

/**
 * Keyboard shortcuts management
 */
export const keyboardShortcuts = {
  /**
   * Parse keyboard shortcut string (e.g., "ctrl+k")
   */
  parseShortcut: (shortcut: string) => {
    const parts = shortcut.toLowerCase().split('+');
    return {
      ctrl: parts.includes('ctrl'),
      alt: parts.includes('alt'),
      shift: parts.includes('shift'),
      key: parts[parts.length - 1],
    };
  },

  /**
   * Check if keyboard event matches shortcut
   */
  matchesShortcut: (event: KeyboardEvent, shortcut: string) => {
    const parsed = keyboardShortcuts.parseShortcut(shortcut);
    return (
      event.ctrlKey === parsed.ctrl &&
      event.altKey === parsed.alt &&
      event.shiftKey === parsed.shift &&
      event.key.toLowerCase() === parsed.key
    );
  },

  /**
   * Format shortcut for display
   */
  formatShortcut: (shortcut: string) => {
    return shortcut
      .split('+')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' + ');
  },
};

export default {
  ARIA_LABELS,
  ANNOUNCEMENTS,
  getAriaDescribedBy,
  getAriaLabelledBy,
  getAccessibleFieldProps,
  getAccessibleButtonProps,
  getAccessibleTableProps,
  focusManagement,
  keyboardShortcuts,
};