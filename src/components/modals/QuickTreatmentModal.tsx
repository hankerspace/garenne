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

interface QuickTreatmentModalProps {
  open: boolean;
  onClose: () => void;
  preselectedAnimal?: Animal;
}

export const QuickTreatmentModal: React.FC<QuickTreatmentModalProps> = ({ open, onClose, preselectedAnimal }) => {
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
      setError('Veuillez sélectionner un animal');
      return;
    }

    if (!product.trim()) {
      setError('Veuillez entrer le nom du produit');
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
      setError('Erreur lors de l\'enregistrement du traitement');
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
    [Route.Oral]: 'Oral',
    [Route.SC]: 'Sous-cutané',
    [Route.IM]: 'Intramusculaire',
    [Route.Other]: 'Autre',
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Traitement rapide</DialogTitle>
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
                label="Animal"
                placeholder="Sélectionner un animal"
                required
              />
            )}
          />

          <TextField
            label="Produit"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Nom du médicament ou traitement"
            required
          />

          <TextField
            label="Dose"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="ex: 0.5ml, 1 comprimé"
          />

          <FormControl>
            <InputLabel>Voie d'administration</InputLabel>
            <Select
              value={route}
              onChange={(e) => setRoute(e.target.value as Route)}
              label="Voie d'administration"
            >
              {Object.entries(routeLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Motif"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Raison du traitement"
          />

          <TextField
            label="Délai d'attente (jours)"
            type="number"
            value={withdrawalDays}
            onChange={(e) => setWithdrawalDays(e.target.value)}
            placeholder="ex: 30"
            inputProps={{ min: 0 }}
            helperText="Nombre de jours d'attente avant consommation"
          />

          <TextField
            label="Notes (optionnel)"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Commentaires sur le traitement..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!selectedAnimal || !product.trim()}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};