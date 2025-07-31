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
} from '@mui/material';
import { useAppStore } from '../../state/store';
import { getLiveAnimals } from '../../state/selectors';
import { Animal } from '../../models/types';

interface QuickWeightModalProps {
  open: boolean;
  onClose: () => void;
  preselectedAnimal?: Animal;
}

export const QuickWeightModal: React.FC<QuickWeightModalProps> = ({ open, onClose, preselectedAnimal }) => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(preselectedAnimal || null);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const state = useAppStore();
  const animals = getLiveAnimals(state);
  const addWeight = useAppStore((state) => state.addWeight);

  const handleSubmit = () => {
    if (!selectedAnimal) {
      setError('Veuillez sélectionner un animal');
      return;
    }

    const weightValue = parseFloat(weight);
    if (!weight || isNaN(weightValue) || weightValue <= 0) {
      setError('Veuillez entrer un poids valide');
      return;
    }

    try {
      addWeight({
        animalId: selectedAnimal.id,
        date: new Date().toISOString(),
        weightGrams: Math.round(weightValue),
        notes: notes.trim() || undefined,
      });

      // Reset form
      setSelectedAnimal(preselectedAnimal || null);
      setWeight('');
      setNotes('');
      setError('');
      onClose();
    } catch {
      setError('Erreur lors de l\'enregistrement de la pesée');
    }
  };

  const handleClose = () => {
    setSelectedAnimal(preselectedAnimal || null);
    setWeight('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pesée rapide</DialogTitle>
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
            label="Poids (en grammes)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="ex: 2500"
            required
            inputProps={{ min: 1, step: 1 }}
          />

          <TextField
            label="Notes (optionnel)"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Commentaires sur la pesée..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!selectedAnimal || !weight}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};