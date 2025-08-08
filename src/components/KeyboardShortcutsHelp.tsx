import React, { useEffect } from 'react';
import { keyboardShortcuts } from '../utils/accessibility';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

/**
 * Keyboard shortcuts help modal component
 */
interface KeyboardShortcutsHelpProps {
  onClose: () => void;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ onClose }) => {
  const { shortcuts } = useKeyboardShortcuts();

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    const category = shortcut.category || 'Général';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(shortcut);
    return groups;
  }, {} as Record<string, import('../contexts/KeyboardShortcutsContext').KeyboardShortcut[]>);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1500,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-help-title"
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 24,
          maxWidth: 600,
          maxHeight: '80vh',
          overflow: 'auto',
          margin: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="shortcuts-help-title" style={{ marginTop: 0 }}>
          Raccourcis clavier
        </h2>
        
        {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
          <div key={category} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 12, color: '#666' }}>
              {category}
            </h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {categoryShortcuts.map((shortcut) => (
                <div
                  key={shortcut.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                  }}
                >
                  <span>{shortcut.description}</span>
                  <kbd
                    style={{
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #ccc',
                      borderRadius: 4,
                      padding: '4px 8px',
                      fontSize: 12,
                      fontFamily: 'monospace',
                    }}
                  >
                    {keyboardShortcuts.formatShortcut(shortcut.keys)}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Fermer (Échap)
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;