import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../state/store';
import { Sex, Status } from '../../models/types';
import { toISODate } from '../../utils/dates';

const animalSchema = z.object({
  name: z.string().optional(),
  identifier: z.string().optional(),
  sex: z.nativeEnum(Sex),
  breed: z.string().optional(),
  birthDate: z.string().optional(),
  origin: z.enum(['BORN_HERE', 'PURCHASED']).optional(),
  motherId: z.string().optional(),
  fatherId: z.string().optional(),
  cage: z.string().optional(),
  status: z.nativeEnum(Status),
  notes: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

const AnimalFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== 'new' && id !== undefined;
  
  const animals = useAppStore((state) => state.animals);
  const addAnimal = useAppStore((state) => state.addAnimal);
  const updateAnimal = useAppStore((state) => state.updateAnimal);
  
  const existingAnimal = isEdit ? animals.find(a => a.id === id) : null;
  
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: existingAnimal ? {
      name: existingAnimal.name || '',
      identifier: existingAnimal.identifier || '',
      sex: existingAnimal.sex,
      breed: existingAnimal.breed || '',
      birthDate: existingAnimal.birthDate || '',
      origin: existingAnimal.origin || 'PURCHASED',
      motherId: existingAnimal.motherId || '',
      fatherId: existingAnimal.fatherId || '',
      cage: existingAnimal.cage || '',
      status: existingAnimal.status,
      notes: existingAnimal.notes || '',
    } : {
      sex: Sex.Female,
      status: Status.Grow,
      origin: 'PURCHASED',
    },
  });

  const selectedOrigin = watch('origin');
  const selectedSex = watch('sex');

  // Get available parents
  const availableParents = animals.filter(animal => 
    animal.status === Status.Reproducer && animal.id !== id
  );
  const availableMothers = availableParents.filter(animal => animal.sex === Sex.Female);
  const availableFathers = availableParents.filter(animal => animal.sex === Sex.Male);

  const onSubmit = async (data: AnimalFormData) => {
    try {
      setSubmitError(null);
      
      // Clean up empty strings and ensure required fields are present
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '')
      ) as Partial<AnimalFormData>;

      // Ensure required fields are present
      const animalData = {
        sex: data.sex,
        status: data.status,
        ...cleanedData,
      };

      if (isEdit && existingAnimal) {
        updateAnimal(existingAnimal.id, animalData);
      } else {
        addAnimal(animalData);
      }
      
      navigate('/animals');
    } catch (error) {
      setSubmitError('Erreur lors de la sauvegarde de l\'animal');
      console.error('Error saving animal:', error);
    }
  };

  if (isEdit && !existingAnimal) {
    return (
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Alert severity="error">Animal non trouvé</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/animals')}
          sx={{ mr: 2 }}
        >
          Retour
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? `Modifier ${existingAnimal?.name || 'l\'animal'}` : 'Nouvel animal'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de base
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nom"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Identifiant / Tatouage"
                    fullWidth
                    error={!!errors.identifier}
                    helperText={errors.identifier?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sex}>
                    <InputLabel>Sexe</InputLabel>
                    <Select {...field} label="Sexe">
                      <MenuItem value={Sex.Female}>Femelle</MenuItem>
                      <MenuItem value={Sex.Male}>Mâle</MenuItem>
                      <MenuItem value={Sex.Unknown}>Inconnu</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Statut</InputLabel>
                    <Select {...field} label="Statut">
                      <MenuItem value={Status.Grow}>Croissance</MenuItem>
                      <MenuItem value={Status.Reproducer}>Reproducteur</MenuItem>
                      <MenuItem value={Status.Retired}>Retraité</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="breed"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Race"
                    fullWidth
                    error={!!errors.breed}
                    helperText={errors.breed?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date de naissance"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      max: toISODate(new Date()),
                    }}
                    error={!!errors.birthDate}
                    helperText={errors.birthDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="cage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cage"
                    fullWidth
                    error={!!errors.cage}
                    helperText={errors.cage?.message}
                  />
                )}
              />
            </Grid>

            {/* Origin and Parents */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Origine et parenté
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="origin"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.origin}>
                    <InputLabel>Origine</InputLabel>
                    <Select {...field} label="Origine">
                      <MenuItem value="BORN_HERE">Né ici</MenuItem>
                      <MenuItem value="PURCHASED">Acheté</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {selectedOrigin === 'BORN_HERE' && (
              <>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="motherId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.motherId}>
                        <InputLabel>Mère</InputLabel>
                        <Select {...field} label="Mère">
                          <MenuItem value="">Aucune</MenuItem>
                          {availableMothers.map(mother => (
                            <MenuItem key={mother.id} value={mother.id}>
                              {mother.name || mother.identifier || mother.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="fatherId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.fatherId}>
                        <InputLabel>Père</InputLabel>
                        <Select {...field} label="Père">
                          <MenuItem value="">Aucun</MenuItem>
                          {availableFathers.map(father => (
                            <MenuItem key={father.id} value={father.id}>
                              {father.name || father.identifier || father.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </>
            )}

            {/* Notes */}
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes"
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />
            </Grid>

            {/* Error Display */}
            {submitError && (
              <Grid item xs={12}>
                <Alert severity="error">{submitError}</Alert>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/animals')}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AnimalFormPage;