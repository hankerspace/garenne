import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../state/store';
import { Cage } from '../../models/types';

const cageSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire').max(50, 'Le nom est trop long'),
  description: z.string().optional(),
  capacity: z.number().min(1, 'La capacité doit être d\'au moins 1').optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type CageFormData = z.infer<typeof cageSchema>;

const CageFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { cages, addCage, updateCage } = useAppStore();
  
  const isEditing = Boolean(id);
  const cage = cages.find(c => c.id === id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CageFormData>({
    resolver: zodResolver(cageSchema),
    defaultValues: {
      name: '',
      description: '',
      capacity: undefined,
      location: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isEditing && cage) {
      reset({
        name: cage.name,
        description: cage.description || '',
        capacity: cage.capacity,
        location: cage.location || '',
        notes: cage.notes || '',
      });
    }
  }, [cage, isEditing, reset]);

  const onSubmit = async (data: CageFormData) => {
    try {
      if (isEditing && cage) {
        updateCage(cage.id, data);
      } else {
        addCage(data);
      }
      navigate('/cages');
    } catch (error) {
      console.error('Error saving cage:', error);
    }
  };

  const handleCancel = () => {
    navigate('/cages');
  };

  if (isEditing && !cage) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Cage non trouvée
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Modifier la cage' : 'Nouvelle cage'}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nom de la cage"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Emplacement"
                    fullWidth
                    placeholder="Ex: Bâtiment A, Rangée 2"
                    error={!!errors.location}
                    helperText={errors.location?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="capacity"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    label="Capacité"
                    type="number"
                    fullWidth
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    inputProps={{ min: 1 }}
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message || 'Nombre maximum d\'animaux'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Description de la cage..."
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notes"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Notes supplémentaires..."
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CageFormPage;