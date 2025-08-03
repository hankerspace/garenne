import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Typography,
  Grid,
} from '@mui/material';
import { useAppStore } from '../../state/store';
import { Animal, Breeding, Sex, Status } from '../../models/types';
import { formatDate, calculateEstimatedWeaningDate } from '../../utils/dates';
import { useTranslation } from '../../hooks/useTranslation';

interface LitterModalProps {
  open: boolean;
  onClose: () => void;
  breeding?: Breeding;
  preselectedMother?: Animal;
}

export const LitterModal: React.FC<LitterModalProps> = ({ 
  open, 
  onClose, 
  breeding, 
  preselectedMother 
}) => {
  const { t } = useTranslation();
  const [kindlingDate, setKindlingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bornAlive, setBornAlive] = useState<number>(0);
  const [stillborn, setStillborn] = useState<number>(0);
  const [malesToCreate, setMalesToCreate] = useState<number>(0);
  const [femalesToCreate, setFemalesToCreate] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const createOffspring = true;

  const state = useAppStore();
  const addLitter = useAppStore((state) => state.addLitter);
  const addAnimal = useAppStore((state) => state.addAnimal);

  // Get the mother and father animals
  const mother = breeding ? state.animals.find(a => a.id === breeding.femaleId) : preselectedMother;
  const father = breeding?.maleId ? state.animals.find(a => a.id === breeding.maleId) : undefined;

  useEffect(() => {
    if (breeding?.expectedKindlingDate) {
      setKindlingDate(breeding.expectedKindlingDate);
    }
  }, [breeding]);

  useEffect(() => {
    // Auto-adjust males and females to not exceed born alive
    const total = malesToCreate + femalesToCreate;
    if (total > bornAlive) {
      const ratio = bornAlive > 0 ? malesToCreate / total : 0.5;
      setMalesToCreate(Math.floor(bornAlive * ratio));
      setFemalesToCreate(bornAlive - Math.floor(bornAlive * ratio));
    }
  }, [bornAlive, malesToCreate, femalesToCreate]);

  const handleSubmit = async () => {
    if (!mother) {
      setError('Mère non trouvée');
      return;
    }

    if (!kindlingDate) {
      setError('Veuillez entrer une date de mise bas');
      return;
    }

    if (bornAlive < 0 || stillborn < 0) {
      setError('Les nombres ne peuvent pas être négatifs');
      return;
    }

    if (createOffspring && (malesToCreate + femalesToCreate) > bornAlive) {
      setError('Le nombre total de petits à créer ne peut pas dépasser les nés vivants');
      return;
    }

    try {
      // Create the litter
      addLitter({
        motherId: mother.id,
        fatherId: father?.id,
        kindlingDate,
        bornAlive,
        stillborn,
        estimatedWeaningDate: calculateEstimatedWeaningDate(kindlingDate),
        notes: notes.trim() || undefined,
      });

      // Create offspring animals if requested
      if (createOffspring) {
        const baseDate = kindlingDate;
        
        // Create males
        for (let i = 0; i < malesToCreate; i++) {
          addAnimal({
            name: `${mother.name || 'Mère'} - Mâle ${i + 1}`,
            sex: Sex.Male,
            birthDate: baseDate,
            origin: 'BORN_HERE',
            motherId: mother.id,
            fatherId: father?.id,
            status: Status.Grow,
            breed: mother.breed,
          });
        }

        // Create females
        for (let i = 0; i < femalesToCreate; i++) {
          addAnimal({
            name: `${mother.name || 'Mère'} - Femelle ${i + 1}`,
            sex: Sex.Female,
            birthDate: baseDate,
            origin: 'BORN_HERE',
            motherId: mother.id,
            fatherId: father?.id,
            status: Status.Grow,
            breed: mother.breed,
          });
        }
      }

      // Update breeding diagnosis if this was from a breeding
      if (breeding) {
        const updateBreeding = useAppStore.getState().updateBreeding;
        updateBreeding(breeding.id, {
          diagnosis: 'PREGNANT',
          diagnosisDate: kindlingDate,
        });
      }

      // Reset form
      setKindlingDate(new Date().toISOString().split('T')[0]);
      setBornAlive(0);
      setStillborn(0);
      setMalesToCreate(0);
      setFemalesToCreate(0);
      setNotes('');
      setError('');
      
      onClose();
    } catch (_) {
      setError('Erreur lors de l\'enregistrement de la portée');
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleBornAliveChange = (value: number) => {
    setBornAlive(value);
    // Auto-suggest equal distribution
    const half = Math.floor(value / 2);
    setMalesToCreate(half);
    setFemalesToCreate(value - half);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {breeding ? 'Enregistrer la mise bas' : 'Nouvelle portée'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          {breeding && (
            <Alert severity="info">
              Saillie du {formatDate(breeding.date)}
              {breeding.expectedKindlingDate && 
                ` - Mise bas prévue le ${formatDate(breeding.expectedKindlingDate)}`}
            </Alert>
          )}
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Mère: {mother?.name || 'Non spécifiée'}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Père: {father?.name || 'Non spécifié'}
            </Typography>
          </Box>

          <TextField
            label={t('modals.litter.kindlingDate')}
            type="date"
            value={kindlingDate}
            onChange={(e) => setKindlingDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label={t('modals.litter.bornAlive')}
                type="number"
                value={bornAlive}
                onChange={(e) => handleBornAliveChange(Math.max(0, parseInt(e.target.value) || 0))}
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t('modals.litter.stillborn')}
                type="number"
                value={stillborn}
                onChange={(e) => setStillborn(Math.max(0, parseInt(e.target.value) || 0))}
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Grid>
          </Grid>

          {bornAlive > 0 && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Créer automatiquement les lapereaux
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Mâles à créer"
                    type="number"
                    value={malesToCreate}
                    onChange={(e) => setMalesToCreate(Math.max(0, Math.min(bornAlive, parseInt(e.target.value) || 0)))}
                    inputProps={{ min: 0, max: bornAlive }}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Femelles à créer"
                    type="number"
                    value={femalesToCreate}
                    onChange={(e) => setFemalesToCreate(Math.max(0, Math.min(bornAlive, parseInt(e.target.value) || 0)))}
                    inputProps={{ min: 0, max: bornAlive }}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary">
                Total: {malesToCreate + femalesToCreate} / {bornAlive}
              </Typography>
            </Box>
          )}

          <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observations sur la mise bas, santé des petits..."
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Enregistrer la portée
        </Button>
      </DialogActions>
    </Dialog>
  );
};