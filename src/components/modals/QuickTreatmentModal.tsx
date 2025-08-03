import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Autocomplete,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAppStore } from '../../state/store';
import { getLiveAnimals } from '../../state/selectors';
import { Route, Animal } from '../../models/types';
import { useTranslation } from '../../hooks/useTranslation';

interface QuickTreatmentModalProps {
  open: boolean;
  onClose: () => void;
  preselectedAnimal?: Animal;
}

export const QuickTreatmentModal: React.FC<QuickTreatmentModalProps> = ({ open, onClose, preselectedAnimal }) => {
  const { t } = useTranslation();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(preselectedAnimal || null);
  const [product, setProduct] = useState('');
  const [dose, setDose] = useState('');
  const [route, setRoute] = useState<Route>(Route.Oral);
  const [reason, setReason] = useState('');
  const [withdrawalDays, setWithdrawalDays] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const state = useAppStore();
  const animals = getLiveAnimals(state);
  const addTreatment = useAppStore((state) => state.addTreatment);

  const handleSubmit = () => {
    if (!selectedAnimal) {
      setError(t('modals.treatment.errorSelectAnimal'));
      return;
    }

    if (!product.trim()) {
      setError(t('modals.treatment.errorEnterProduct'));
      return;
    }

    try {
      const today = new Date();
      let withdrawalUntil: string | undefined;
      
      if (withdrawalDays) {
        const days = parseInt(withdrawalDays);
        if (!isNaN(days) && days > 0) {
          const withdrawalDate = new Date(today);
          withdrawalDate.setDate(withdrawalDate.getDate() + days);
          withdrawalUntil = withdrawalDate.toISOString();
        }
      }

      addTreatment({
        animalId: selectedAnimal.id,
        date: today.toISOString(),
        product: product.trim(),
        dose: dose.trim() || undefined,
        route,
        reason: reason.trim() || undefined,
        withdrawalUntil,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setSelectedAnimal(preselectedAnimal || null);
      setProduct('');
      setDose('');
      setRoute(Route.Oral);
      setReason('');
      setWithdrawalDays('');
      setNotes('');
      setError('');
      onClose();
    } catch {
      setError(t('modals.treatment.errorSavingTreatment'));
    }
  };

  const handleClose = () => {
    setSelectedAnimal(preselectedAnimal || null);
    setProduct('');
    setDose('');
    setRoute(Route.Oral);
    setReason('');
    setWithdrawalDays('');
    setNotes('');
    setError('');
    onClose();
  };

  const routeLabels = {
    [Route.Oral]: t('modals.treatment.routes.oral'),
    [Route.SC]: t('modals.treatment.routes.subcutaneous'),
    [Route.IM]: t('modals.treatment.routes.intramuscular'),
    [Route.Other]: t('modals.treatment.routes.other'),
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('modals.treatment.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <Autocomplete
            options={animals}
            getOptionLabel={(animal) => `${animal.name || animal.identifier || `Animal ${animal.id.slice(0, 8)}`} (${animal.breed || 'Race inconnue'})`}
            value={selectedAnimal}
            onChange={(_, newValue) => setSelectedAnimal(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('modals.treatment.animal')}
                placeholder={t('modals.treatment.animalPlaceholder')}
                required
              />
            )}
          />

          <TextField
            label={t('modals.treatment.product')}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder={t('modals.treatment.productPlaceholder')}
            required
          />

          <TextField
            label={t('modals.treatment.dose')}
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder={t('modals.treatment.dosePlaceholder')}
          />

          <FormControl>
            <InputLabel>{t('modals.treatment.route')}</InputLabel>
            <Select
              value={route}
              onChange={(e) => setRoute(e.target.value as Route)}
              label={t('modals.treatment.route')}
            >
              {Object.entries(routeLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t('modals.treatment.reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('modals.treatment.reasonPlaceholder')}
          />

          <TextField
            label={t('modals.treatment.withdrawalDays')}
            type="number"
            value={withdrawalDays}
            onChange={(e) => setWithdrawalDays(e.target.value)}
            placeholder={t('modals.treatment.withdrawalPlaceholder')}
            inputProps={{ min: 0 }}
            helperText={t('modals.treatment.withdrawalHelperText')}
          />

          <TextField
            label={t('modals.treatment.notesOptional')}
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('modals.treatment.notesPlaceholder')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common.cancel')}</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!selectedAnimal || !product.trim()}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};