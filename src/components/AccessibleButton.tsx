import React, { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, Tooltip } from '@mui/material';
import { useAccessibility } from '../hooks/useAccessibility';

export interface AccessibleButtonProps extends MuiButtonProps {
  /** Description pour les lecteurs d'écran */
  ariaLabel?: string;
  /** Description détaillée affichée au survol */
  tooltip?: string;
  /** Raccourci clavier pour ce bouton */
  keyboardShortcut?: string;
  /** Indique si l'action est destructive */
  isDestructive?: boolean;
}

/**
 * Bouton amélioré avec meilleure accessibilité
 */
export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ ariaLabel, tooltip, keyboardShortcut, isDestructive, children, onClick, ...props }, ref) => {
    const { getAccessibilityProps } = useAccessibility({
      ariaLabel,
      ariaDescription: tooltip,
      keyboardShortcut,
      onKeyboardActivation: onClick as (() => void) | undefined
    });

    const accessibilityProps = getAccessibilityProps();
    
    // Ajouter un aria-describedby pour les actions destructives
    if (isDestructive) {
      accessibilityProps['aria-describedby'] = 'destructive-action-warning';
    }

    // Si on utilise un Tooltip, on ne veut pas de title sur l'élément
    // car MUI Tooltip gère cela lui-même
    const buttonProps = { ...accessibilityProps };
    if (tooltip || keyboardShortcut) {
      delete buttonProps.title;
    }

    const button = (
      <MuiButton
        ref={ref}
        {...props}
        {...buttonProps}
        onClick={onClick}
        // Améliorer le contraste pour les actions destructives
        color={isDestructive ? 'error' : props.color}
      >
        {children}
        {/* Avertissement invisible pour les lecteurs d'écran sur les actions destructives */}
        {isDestructive && (
          <span 
            id="destructive-action-warning" 
            className="sr-only"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden'
            }}
          >
            Action irréversible
          </span>
        )}
      </MuiButton>
    );

    // Envelopper dans un Tooltip si nécessaire
    if (tooltip || keyboardShortcut) {
      const tooltipText = [
        tooltip,
        keyboardShortcut && `Raccourci: ${keyboardShortcut}`
      ].filter(Boolean).join(' - ');

      return (
        <Tooltip title={tooltipText} arrow>
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);

AccessibleButton.displayName = 'AccessibleButton';