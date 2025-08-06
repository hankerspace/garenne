/**
 * Hook pour améliorer l'accessibilité des composants
 */
import { useCallback, useEffect } from 'react';

export interface UseAccessibilityOptions {
  /** Description de l'élément pour les lecteurs d'écran */
  ariaLabel?: string;
  /** Description détaillée de l'élément */
  ariaDescription?: string;
  /** Raccourci clavier pour accéder à l'élément */
  keyboardShortcut?: string;
  /** Callback appelé lors de l'activation par raccourci clavier */
  onKeyboardActivation?: () => void;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    ariaLabel,
    ariaDescription,
    keyboardShortcut,
    onKeyboardActivation
  } = options;

  // Gestion des raccourcis clavier
  useEffect(() => {
    if (!keyboardShortcut || !onKeyboardActivation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Format: "ctrl+k", "alt+a", etc.
      const keys = keyboardShortcut.toLowerCase().split('+');
      const hasCtrl = keys.includes('ctrl');
      const hasAlt = keys.includes('alt');
      const hasShift = keys.includes('shift');
      const key = keys[keys.length - 1];

      if (
        event.key.toLowerCase() === key &&
        event.ctrlKey === hasCtrl &&
        event.altKey === hasAlt &&
        event.shiftKey === hasShift
      ) {
        event.preventDefault();
        onKeyboardActivation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcut, onKeyboardActivation]);

  // Créer les props d'accessibilité
  const getAccessibilityProps = useCallback(() => {
    const props: Record<string, any> = {};
    
    if (ariaLabel) {
      props['aria-label'] = ariaLabel;
    }
    
    if (ariaDescription) {
      props['aria-describedby'] = 'description';
      props['title'] = ariaDescription;
    }

    if (keyboardShortcut) {
      props['title'] = `${props['title'] || ariaLabel || ''} (${keyboardShortcut})`.trim();
    }

    return props;
  }, [ariaLabel, ariaDescription, keyboardShortcut]);

  return {
    getAccessibilityProps,
    keyboardShortcut
  };
};

/**
 * Hook pour la navigation au clavier dans les listes
 */
export const useKeyboardNavigation = <T>(
  items: T[],
  onSelect?: (item: T, index: number) => void
) => {
  const handleKeyDown = useCallback((
    event: React.KeyboardEvent,
    currentIndex: number
  ) => {
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = Math.max(currentIndex - 1, 0);
        break;
      
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      
      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;
      
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (onSelect && items[currentIndex]) {
          onSelect(items[currentIndex], currentIndex);
        }
        break;
    }

    // Focus sur l'élément suivant si l'index a changé
    if (nextIndex !== currentIndex) {
      const nextElement = document.querySelector(`[data-index="${nextIndex}"]`) as HTMLElement;
      nextElement?.focus();
    }
  }, [items, onSelect]);

  return { handleKeyDown };
};

/**
 * Hook pour annoncer les changements aux lecteurs d'écran
 */
export const useScreenReaderAnnouncement = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Créer un élément temporaire pour l'annonce
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    // Styles pour masquer visuellement mais garder accessible aux lecteurs d'écran
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    
    // Supprimer après annonce
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
};