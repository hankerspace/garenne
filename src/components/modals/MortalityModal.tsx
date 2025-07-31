import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import { useAppStore } from '../../state/store';
import { Animal } from '../../models/types';
import { formatDate } from '../../utils/dates';

interface MortalityModalProps {
  open: boolean;
  onClose: () => void;
  animal: Animal;
}

export const MortalityModal: React.FC<MortalityModalProps> = ({ 
  open, 
  onClose, 
  animal 
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [suspectedCause, setSuspectedCause] = useState('');
  const [necropsy, setNecropsy] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const addMortality = useAppStore((state) => state.addMortality);

  const handleSubmit = () => {
    if (!date) {
      setError('Veuillez entrer une date de décès');
      return;
    }

    // Check if death date is not in the future
    const deathDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (deathDate > today) {
      setError('La date de décès ne peut pas être dans le futur');
      return;
    }

    // Check if death date is not before birth date
    if (animal.birthDate) {
      const birthDate = new Date(animal.birthDate);
      if (deathDate < birthDate) {
        setError('La date de décès ne peut pas être antérieure à la naissance');
        return;
      }
    }

    try {
      addMortality({
        animalId: animal.id,
        date,
        suspectedCause: suspectedCause.trim() || undefined,
        necropsy,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setSuspectedCause('');
      setNecropsy(false);
      setNotes('');
      setError('');
      
      onClose();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du décès');
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Enregistrer le décès</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <Alert severity="warning">
            Cette action marquera l'animal comme décédé et ne peut pas être annulée facilement.
          </Alert>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Animal: {animal.name || 'Sans nom'}
            </Typography>
            {animal.birthDate && (
              <Typography variant="body2" color="text.secondary">
                Né le {formatDate(animal.birthDate)}
              </Typography>
            )}
          </Box>

          <TextField
            label="Date de décès"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            helperText="Ne peut pas être dans le futur"
          />

          <TextField
            label="Cause suspectée"
            value={suspectedCause}
            onChange={(e) => setSuspectedCause(e.target.value)}
            placeholder="Maladie, accident, vieillesse..."
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={necropsy}
                onChange={(e) => setNecropsy(e.target.checked)}
              />
            }
            label="Nécropsie réalisée"
          />

          <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Circonstances, observations..."
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="error"
        >
          Enregistrer le décès
        </Button>
      </DialogActions>
    </Dialog>
  );
};