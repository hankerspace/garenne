import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import { AccessibleButton } from './AccessibleButton';

interface ConsumptionConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConsumptionConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm 
}: ConsumptionConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('animals.confirmConsumption')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('animals.confirmConsumption')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <AccessibleButton 
          onClick={onClose}
          ariaLabel="Annuler la suppression"
        >
          {t('common.cancel')}
        </AccessibleButton>
        <AccessibleButton 
          onClick={onConfirm}
          color="error"
          variant="contained"
          ariaLabel="Confirmer la suppression définitive"
          isDestructive
        >
          {t('common.confirm')}
        </AccessibleButton>
      </DialogActions>
    </Dialog>
  );
};