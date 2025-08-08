import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { keyboardShortcuts } from '../utils/accessibility';
import { useScreenReaderAnnouncement } from '../hooks/useAccessibility';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { 
  KeyboardShortcutsContext, 
  type KeyboardShortcut, 
  type KeyboardShortcutsContextType 
} from '../contexts/KeyboardShortcutsContext';

/**
 * Default application shortcuts
 */
const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    id: 'search',
    keys: 'ctrl+k',
    description: 'Ouvrir la recherche',
    action: () => {
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    global: true,
    category: 'Navigation',
  },
  {
    id: 'home',
    keys: 'ctrl+h',
    description: 'Aller à l\'accueil',
    action: () => {
      window.location.href = '/';
    },
    global: true,
    category: 'Navigation',
  },
  {
    id: 'dashboard',
    keys: 'ctrl+d',
    description: 'Aller au tableau de bord',
    action: () => {
      window.location.href = '/dashboard';
    },
    global: true,
    category: 'Navigation',
  },
  {
    id: 'animals',
    keys: 'ctrl+a',
    description: 'Aller aux animaux',
    action: () => {
      window.location.href = '/animals';
    },
    global: true,
    category: 'Navigation',
  },
  {
    id: 'help',
    keys: 'ctrl+shift+?',
    description: 'Afficher l\'aide des raccourcis',
    action: () => {}, // Will be set by provider
    global: true,
    category: 'Aide',
  },
  {
    id: 'escape',
    keys: 'escape',
    description: 'Fermer les modales/menus',
    action: () => {
      // Close modals, dropdowns, etc.
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
    },
    global: true,
    category: 'Interface',
  },
];

export const KeyboardShortcutsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(DEFAULT_SHORTCUTS);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const { announce } = useScreenReaderAnnouncement();

  const registerShortcut = (shortcut: KeyboardShortcut) => {
    setShortcuts(prev => {
      const existing = prev.find(s => s.id === shortcut.id);
      if (existing) {
        // Update existing shortcut
        return prev.map(s => s.id === shortcut.id ? shortcut : s);
      }
      return [...prev, shortcut];
    });
  };

  const unregisterShortcut = (id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  };

  const toggleShortcutsHelp = useCallback(() => {
    setIsHelpVisible(prev => {
      const newState = !prev;
      announce(newState ? 'Aide des raccourcis ouverte' : 'Aide des raccourcis fermée');
      return newState;
    });
  }, [announce]);

  // Update help shortcut action
  useEffect(() => {
    setShortcuts(prev => 
      prev.map(s => 
        s.id === 'help' 
          ? { ...s, action: toggleShortcutsHelp }
          : s
      )
    );
  }, [toggleShortcutsHelp]);

  // Global keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Exception for specific shortcuts that should work in inputs
        if (!['escape', 'ctrl+k'].some(keys => keyboardShortcuts.matchesShortcut(event, keys))) {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        if (
          !shortcut.disabled &&
          shortcut.global &&
          keyboardShortcuts.matchesShortcut(event, shortcut.keys)
        ) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          
          // Announce shortcut activation for screen readers
          announce(`Raccourci activé : ${shortcut.description}`, 'polite');
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, announce]);

  const value: KeyboardShortcutsContextType = {
    shortcuts,
    registerShortcut,
    unregisterShortcut,
    toggleShortcutsHelp,
    isHelpVisible,
  };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      {isHelpVisible && <KeyboardShortcutsHelp onClose={() => setIsHelpVisible(false)} />}
    </KeyboardShortcutsContext.Provider>
  );
};

export default KeyboardShortcutsProvider;