import React from 'react';
import { Button } from './Button';

/**
 * Hook pour gérer l'état d'ouverture/fermeture des modales
 */
export const useModal = (initialOpen = false) => {
  const [open, setOpen] = React.useState(initialOpen);

  const openModal = React.useCallback(() => setOpen(true), []);
  const closeModal = React.useCallback(() => setOpen(false), []);
  const toggleModal = React.useCallback(() => setOpen(prev => !prev), []);

  return {
    open,
    openModal,
    closeModal,
    toggleModal,
  };
};

/**
 * Composants d'actions prédéfinies pour les modales
 */
export const ModalActions = {
  /** Actions de confirmation (Annuler/Confirmer) */
  Confirm: ({ 
    onCancel, 
    onConfirm, 
    cancelText = 'Annuler',
    confirmText = 'Confirmer',
    confirmColor = 'primary',
    loading = false 
  }: {
    onCancel: () => void;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
    confirmColor?: 'primary' | 'error' | 'warning';
    loading?: boolean;
  }) => (
    <>
      <Button variant="outlined" onClick={onCancel} disabled={loading}>
        {cancelText}
      </Button>
      <Button 
        variant="contained" 
        color={confirmColor}
        onClick={onConfirm}
        loading={loading}
      >
        {confirmText}
      </Button>
    </>
  ),

  /** Actions de sauvegarde (Annuler/Sauvegarder) */
  Save: ({ 
    onCancel, 
    onSave, 
    cancelText = 'Annuler',
    saveText = 'Sauvegarder',
    loading = false 
  }: {
    onCancel: () => void;
    onSave: () => void;
    cancelText?: string;
    saveText?: string;
    loading?: boolean;
  }) => (
    <>
      <Button variant="outlined" onClick={onCancel} disabled={loading}>
        {cancelText}
      </Button>
      <Button 
        variant="contained" 
        color="primary"
        onClick={onSave}
        loading={loading}
      >
        {saveText}
      </Button>
    </>
  ),
};