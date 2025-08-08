import { ReactNode } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  HelpOutline as QuestionIcon,
} from '@mui/icons-material';
import { Modal, ModalProps } from '../ui/Modal';
import { ConfirmHandler, CancelHandler } from '../../types/events';

export type ConfirmDialogVariant = 'default' | 'success' | 'warning' | 'error';

export interface ConfirmDialogProps extends Omit<ModalProps, 'children' | 'actions'> {
  /** Message de confirmation */
  message: string;
  /** Description détaillée (optionnelle) */
  description?: string;
  /** Variante déterminant l'icône et la couleur */
  variant?: ConfirmDialogVariant;
  /** Texte du bouton de confirmation */
  confirmText?: string;
  /** Texte du bouton d'annulation */
  cancelText?: string;
  /** Désactiver le bouton de confirmation */
  confirmDisabled?: boolean;
  /** État de chargement */
  loading?: boolean;
  /** Fonction appelée lors de la confirmation */
  onConfirm?: ConfirmHandler;
  /** Fonction appelée lors de l'annulation */
  onCancel?: CancelHandler;
  /** Masquer le bouton d'annulation */
  hideCancelButton?: boolean;
}

const variantConfig = {
  default: {
    icon: QuestionIcon,
    color: 'primary' as const,
  },
  success: {
    icon: SuccessIcon,
    color: 'success' as const,
  },
  warning: {
    icon: WarningIcon,
    color: 'warning' as const,
  },
  error: {
    icon: ErrorIcon,
    color: 'error' as const,
  },
};

/**
 * Dialog de confirmation standardisé avec différentes variantes
 */
export const ConfirmDialog = ({
  message,
  description,
  variant = 'default',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmDisabled = false,
  loading = false,
  onConfirm,
  onCancel,
  hideCancelButton = false,
  open = false,
  onClose,
  ...modalProps
}: ConfirmDialogProps) => {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  const handleConfirm = async () => {
    if (loading || confirmDisabled) return;
    try {
      await onConfirm?.();
    } catch (error) {
      console.error('Confirm action failed:', error);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
    onClose?.();
  };

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const actions = (
    <>
      {!hideCancelButton && (
        <Button
          onClick={handleCancel}
          disabled={loading}
          variant="outlined"
          color="inherit"
        >
          {cancelText}
        </Button>
      )}
      <Button
        onClick={handleConfirm}
        disabled={confirmDisabled || loading}
        variant="contained"
        color={config.color}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      actions={actions}
      size="xs"
      closeOnBackdrop={!loading}
      showCloseButton={!loading}
      {...modalProps}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          py: 1,
        }}
      >
        <Box sx={{ flexShrink: 0, mt: 0.5 }}>
          <IconComponent 
            color={config.color} 
            sx={{ fontSize: 24 }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box
            component="p"
            sx={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {message}
          </Box>
          {description && (
            <Box
              component="p"
              sx={{
                margin: 0,
                mt: 1,
                fontSize: '0.875rem',
                color: 'text.secondary',
                lineHeight: 1.4,
              }}
            >
              {description}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};