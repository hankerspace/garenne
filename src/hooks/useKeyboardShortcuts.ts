/**
 * Keyboard shortcuts hooks
 * Exports only the hooks for use in components
 */

import { useContext, useEffect } from 'react';
import { KeyboardShortcutsContext, type KeyboardShortcut } from '../contexts/KeyboardShortcutsContext';

/**
 * Hook to use keyboard shortcuts
 */
export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  }
  return context;
};

/**
 * Hook to register a keyboard shortcut
 */
export const useKeyboardShortcut = (shortcut: Omit<KeyboardShortcut, 'id'> & { id?: string }) => {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();
  
  useEffect(() => {
    const id = shortcut.id || `shortcut-${Date.now()}-${Math.random()}`;
    const fullShortcut = { ...shortcut, id };
    
    registerShortcut(fullShortcut);
    
    return () => unregisterShortcut(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcut.keys, shortcut.description, shortcut.disabled, registerShortcut, unregisterShortcut]);
};

export type { KeyboardShortcut };