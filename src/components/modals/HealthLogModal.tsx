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
} from '@mui/material';
import { useAppStore } from '../../state/store';
import { Animal } from '../../models/types';
import { useTranslation } from '../../hooks/useTranslation';

interface HealthLogModalProps {
  open: boolean;
  onClose: () => void;
  animal: Animal;
}

export const HealthLogModal: React.FC<HealthLogModalProps> = ({ open, onClose, animal }) => {
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [observation, setObservation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const addHealthLog = useAppStore((state) => state.addHealthLog);

  const handleSubmit = () => {
    if (!observation.trim()) {
      setError('L\'observation ne peut pas être vide.');
      return;
    }

    try {
      addHealthLog({
        animalId: animal.id,
        date,
        observation: observation.trim(),
        notes: notes.trim() || undefined,
      });

      // Reset form
      setObservation('');
      setNotes('');
      setError('');
      onClose();
    } catch {
      setError('Erreur lors de l\'enregistrement de l\'observation.');
    }
  };

  const handleClose = () => {
    setObservation('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ajouter une observation de santé</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <TextField
            label="Observation"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Ex: Diarrhée, boiterie, perte d'appétit..."
            required
          />

          <TextField
            label="Notes (optionnel)"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Détails supplémentaires..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!observation.trim()}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
