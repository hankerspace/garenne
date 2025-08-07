import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Divider,
  DialogProps,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps extends Omit<DialogProps, 'onClose'> {
  /** Titre de la modale */
  title?: string;
  /** Contenu principal */
  children: React.ReactNode;
  /** Actions en bas de modale */
  actions?: React.ReactNode;
  /** Taille de la modale */
  size?: ModalSize;
  /** Fonction appelée à la fermeture */
  onClose?: () => void;
  /** Afficher le bouton de fermeture */
  showCloseButton?: boolean;
  /** Fermeture en cliquant à l'extérieur */
  closeOnBackdrop?: boolean;
  /** Styles personnalisés */
  sx?: SxProps<Theme>;
}

/**
 * Composant Modal réutilisable avec actions standardisées
 */
export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  actions,
  open = false,
  size = 'sm',
  onClose,
  showCloseButton = true,
  closeOnBackdrop = true,
  sx,
  ...props
}) => {
  const handleClose = (_: any, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && !closeOnBackdrop) {
      return;
    }
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={size}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          ...(sx as any),
        },
      }}
      {...props}
    >
      {title && (
        <>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1,
            }}
          >
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            {showCloseButton && (
              <IconButton
                aria-label="Fermer"
                onClick={onClose}
                sx={{
                  color: 'text.secondary',
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <Divider />
        </>
      )}

      <DialogContent
        sx={{
          py: title ? 3 : 2,
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <>
          <Divider />
          <DialogActions
            sx={{
              px: 3,
              py: 2,
              gap: 1,
            }}
          >
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default Modal;