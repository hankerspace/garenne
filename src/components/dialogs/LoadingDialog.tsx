import { ReactNode, useState } from 'react';
import { 
  Box, 
  LinearProgress, 
  Typography, 
  Button,
  Alert,
  AlertTitle 
} from '@mui/material';
import { Modal, ModalProps } from '../ui/Modal';
import { RetryHandler, CancelHandler } from '../../types/events';

export interface LoadingDialogProps extends Omit<ModalProps, 'children' | 'actions'> {
  /** Message principal affiché pendant le chargement */
  message?: string;
  /** Message de progression détaillé */
  progressMessage?: string;
  /** Valeur de progression (0-100) - si non fournie, progress indéterminé */
  progress?: number;
  /** Permet d'annuler l'opération */
  cancellable?: boolean;
  /** Texte du bouton d'annulation */
  cancelText?: string;
  /** Fonction appelée lors de l'annulation */
  onCancel?: CancelHandler;
  /** État d'erreur */
  error?: string | null;
  /** Fonction de retry en cas d'erreur */
  onRetry?: RetryHandler;
  /** Masquer automatiquement après succès */
  autoHideOnSuccess?: boolean;
  /** Contenu personnalisé à afficher */
  children?: ReactNode;
}

/**
 * Dialog de chargement standardisé avec gestion d'erreurs et progression
 */
export const LoadingDialog = ({
  message = 'Chargement en cours...',
  progressMessage,
  progress,
  cancellable = false,
  cancelText = 'Annuler',
  onCancel,
  error,
  onRetry,
  autoHideOnSuccess = false,
  children,
  open = false,
  onClose,
  ...modalProps
}: LoadingDialogProps) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const showProgress = !error;
  const canRetry = error && onRetry && !isRetrying;
  const canCancel = cancellable && !isRetrying;

  const actions = (
    <>
      {canCancel && (
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="inherit"
        >
          {cancelText}
        </Button>
      )}
      {canRetry && (
        <Button
          onClick={handleRetry}
          variant="contained"
          color="primary"
        >
          Réessayer
        </Button>
      )}
    </>
  );

  return (
    <Modal
      open={open}
      onClose={canCancel ? onClose : undefined}
      actions={actions}
      size="xs"
      closeOnBackdrop={false}
      showCloseButton={canCancel}
      {...modalProps}
    >
      <Box sx={{ py: 1 }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Erreur</AlertTitle>
            {error}
          </Alert>
        ) : (
          <>
            <Typography 
              variant="body1" 
              sx={{ mb: 2, fontWeight: 500 }}
            >
              {message}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant={progress !== undefined ? 'determinate' : 'indeterminate'}
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                }}
              />
            </Box>

            {progressMessage && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {progressMessage}
              </Typography>
            )}

            {progress !== undefined && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                {Math.round(progress)}%
              </Typography>
            )}
          </>
        )}

        {children}
      </Box>
    </Modal>
  );
};