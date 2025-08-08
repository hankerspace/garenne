import { createContext } from 'react';

export interface KeyboardShortcut {
  id: string;
  keys: string;
  description: string;
  action: () => void;
  global?: boolean;
  category?: string;
  disabled?: boolean;
}

export interface KeyboardShortcutsContextType {
  shortcuts: KeyboardShortcut[];
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (id: string) => void;
  toggleShortcutsHelp: () => void;
  isHelpVisible: boolean;
}

export const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);