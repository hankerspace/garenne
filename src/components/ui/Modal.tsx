import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Divider,
  DialogProps,
  Fade,
  Grow,
  Slide,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { 
  ARIA_LABELS, 
  focusManagement, 
  getAccessibleButtonProps 
} from '../../utils/accessibility';
import { useReducedMotion, ModalAnimationVariant } from '../../utils/modalAnimations';
import { ANIMATION_CONSTANTS } from '../../constants';

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
  /** Type d'animation */
  animationVariant?: ModalAnimationVariant;
  /** Désactiver les animations */
  disableAnimation?: boolean;
  /** Styles personnalisés */
  sx?: SxProps<Theme>;
  /** ID pour l'accessibilité */
  ariaLabelledBy?: string;
  /** Description pour l'accessibilité */
  ariaDescribedBy?: string;
}

/**
 * Create transition component based on animation variant
 */
const createTransition = (variant: ModalAnimationVariant, reducedMotion: boolean) => {
  if (reducedMotion) {
    return Fade;
  }

  switch (variant) {
    case 'zoom':
      return Grow;
    case 'slide':
    case 'slideRight':
      return React.forwardRef<HTMLDivElement, TransitionProps & { children: React.ReactElement }>((props, ref) => (
        <Slide direction={variant === 'slideRight' ? 'left' : 'up'} ref={ref} {...props} />
      ));
    case 'bounce':
    default:
      return Fade;
  }
};

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
  animationVariant = 'slide',
  disableAnimation = false,
  ariaLabelledBy,
  ariaDescribedBy,
  sx,
  ...props
}) => {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = !disableAnimation && !reducedMotion;
  const TransitionComponent = shouldAnimate ? createTransition(animationVariant, reducedMotion) : undefined;

  // Generate unique IDs for accessibility
  const titleId = ariaLabelledBy || (title ? `modal-title-${Math.random().toString(36).substr(2, 9)}` : undefined);
  const contentId = ariaDescribedBy || `modal-content-${Math.random().toString(36).substr(2, 9)}`;

  // Focus management
  useEffect(() => {
    if (open) {
      // Timeout to ensure modal is rendered
      const timeoutId = setTimeout(() => {
        const modalElement = document.querySelector('[role="dialog"]') as HTMLElement;
        if (modalElement) {
          focusManagement.trapFocus(modalElement);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [open]);

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
      TransitionComponent={TransitionComponent}
      transitionDuration={shouldAnimate ? ANIMATION_CONSTANTS.COLLAPSE_TIMEOUT : 0}
      aria-labelledby={titleId}
      aria-describedby={contentId}
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
            id={titleId}
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
                {...getAccessibleButtonProps(ARIA_LABELS.actions.close)}
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
        id={contentId}
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