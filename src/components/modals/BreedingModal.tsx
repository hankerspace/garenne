import { useState, useEffect } from 'react';
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
  Typography,
} from '@mui/material';
import { useAppStore } from '../../state/store';
import { getLiveAnimals } from '../../state/selectors';
import { Animal, Sex, BreedingMethod } from '../../models/types';
import { addDaysToDate, formatDate } from '../../utils/dates';

interface BreedingModalProps {
  open: boolean;
  onClose: () => void;
  preselectedFemale?: Animal;
}

// Rabbit gestation period is typically 31-32 days
const RABBIT_GESTATION_DAYS = 31;

export const BreedingModal: React.FC<BreedingModalProps> = ({ open, onClose, preselectedFemale }) => {
  const [selectedFemale, setSelectedFemale] = useState<Animal | null>(preselectedFemale || null);
  const [selectedMale, setSelectedMale] = useState<Animal | null>(null);
  const [method, setMethod] = useState<BreedingMethod>(BreedingMethod.Natural);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const state = useAppStore();
  const animals = getLiveAnimals(state);
  const addBreeding = useAppStore((state) => state.addBreeding);

  // Filter animals by sex
  const females = animals.filter(animal => animal.sex === Sex.Female);
  const males = animals.filter(animal => animal.sex === Sex.Male);

  // Calculate expected kindling date
  const expectedKindlingDate = addDaysToDate(date, RABBIT_GESTATION_DAYS);

  useEffect(() => {
    if (preselectedFemale) {
      setSelectedFemale(preselectedFemale);
    }
  }, [preselectedFemale]);

  const handleSubmit = () => {
    if (!selectedFemale) {
      setError('Veuillez sélectionner une femelle');
      return;
    }

    if (!date) {
      setError('Veuillez entrer une date de saillie');
      return;
    }

    try {
      addBreeding({
        femaleId: selectedFemale.id,
        maleId: selectedMale?.id,
        method,
        date,
        expectedKindlingDate,
        notes: notes.trim() || undefined,
        diagnosis: 'UNKNOWN',
      });

      // Reset form
      setSelectedFemale(preselectedFemale || null);
      setSelectedMale(null);
      setMethod(BreedingMethod.Natural);
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setError('');
      
      onClose();
    } catch (_) {
      setError('Erreur lors de l\'enregistrement de la saillie');
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nouvelle saillie</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <Autocomplete
            value={selectedFemale}
            onChange={(_, newValue) => setSelectedFemale(newValue)}
            options={females}
            getOptionLabel={(animal) => `${animal.name || 'Sans nom'} ${animal.identifier ? `(${animal.identifier})` : ''}`}
            disabled={!!preselectedFemale}
            renderInput={(params) => (
              <TextField {...params} label="Femelle *" />
            )}
          />

          <Autocomplete
            value={selectedMale}
            onChange={(_, newValue) => setSelectedMale(newValue)}
            options={males}
            getOptionLabel={(animal) => `${animal.name || 'Sans nom'} ${animal.identifier ? `(${animal.identifier})` : ''}`}
            renderInput={(params) => (
              <TextField {...params} label="Mâle" />
            )}
          />

          <FormControl>
            <InputLabel>Méthode</InputLabel>
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value as BreedingMethod)}
              label="Méthode"
            >
              <MenuItem value={BreedingMethod.Natural}>Naturelle</MenuItem>
              <MenuItem value={BreedingMethod.AI}>Insémination artificielle</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Date de saillie"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />

          {date && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Date de mise bas estimée: <strong>{formatDate(expectedKindlingDate)}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Gestation: {RABBIT_GESTATION_DAYS} jours)
              </Typography>
            </Box>
          )}

          <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observations, conditions particulières..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};