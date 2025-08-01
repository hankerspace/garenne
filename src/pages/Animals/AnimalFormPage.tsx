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
  Autocomplete,
  Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../state/store';
import { Sex, Status } from '../../models/types';
import { toISODate } from '../../utils/dates';
import { useTranslation } from '../../hooks/useTranslation';

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
  tags: z.array(z.string()).optional(),
  consumedDate: z.string().optional(),
  consumedWeight: z.number().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

const AnimalFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id !== 'new' && id !== undefined;
  const { t } = useTranslation();
  
  const animals = useAppStore((state) => state.animals);
  const cages = useAppStore((state) => state.cages);
  const tags = useAppStore((state) => state.tags);
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
      tags: existingAnimal.tags || [],
      consumedDate: existingAnimal.consumedDate || '',
      consumedWeight: existingAnimal.consumedWeight || undefined,
    } : {
      sex: Sex.Female,
      status: Status.Grow,
      origin: 'PURCHASED',
      tags: [],
    },
  });

  const selectedOrigin = watch('origin');
  const selectedStatus = watch('status');

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
        Object.entries(data).filter(([, value]) => value !== '')
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
      setSubmitError(t('messages.operationFailed'));
      console.error('Error saving animal:', error);
    }
  };

  if (isEdit && !existingAnimal) {
    return (
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Alert severity="error">{t('messages.operationFailed')}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/animals')}
          sx={{ mr: 2 }}
          size="small"
        >
          {t('common.cancel')}
        </Button>
        <Typography variant="h4" component="h1" sx={{
          fontSize: { xs: '1.5rem', sm: '2.125rem' }
        }}>
          {isEdit ? t('animals.editAnimal') : t('animals.addAnimal')}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
                {t('animals.animalDetails')}
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
                    label={t('animals.name')}
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
                    label={t('animals.identifier')}
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
                    <InputLabel>{t('animals.sex')}</InputLabel>
                    <Select {...field} label={t('animals.sex')}>
                      <MenuItem value={Sex.Female}>{t('sex.F')}</MenuItem>
                      <MenuItem value={Sex.Male}>{t('sex.M')}</MenuItem>
                      <MenuItem value={Sex.Unknown}>{t('sex.U')}</MenuItem>
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
                    <InputLabel>{t('animals.status')}</InputLabel>
                    <Select {...field} label={t('animals.status')}>
                      <MenuItem value={Status.Grow}>{t('status.GROW')}</MenuItem>
                      <MenuItem value={Status.Reproducer}>{t('status.REPRO')}</MenuItem>
                      <MenuItem value={Status.Retired}>{t('status.RETIRED')}</MenuItem>
                      <MenuItem value={Status.Deceased}>{t('status.DEAD')}</MenuItem>
                      <MenuItem value={Status.Consumed}>{t('status.CONSUMED')}</MenuItem>
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
                    label={t('animals.breed')}
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
                    label={t('animals.birthDate')}
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
                  <FormControl fullWidth error={!!errors.cage}>
                    <InputLabel>{t('animals.cage')}</InputLabel>
                    <Select {...field} label={t('animals.cage')}>
                      <MenuItem value="">{t('common.none')}</MenuItem>
                      {cages.map(cage => (
                        <MenuItem key={cage.id} value={cage.id}>
                          {cage.name} ({cage.location || 'N/A'})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Consumption details if status is CONSUMED */}
            {selectedStatus === Status.Consumed && (
              <>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="consumedDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('animals.consumedDate')}
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          max: toISODate(new Date()),
                        }}
                        error={!!errors.consumedDate}
                        helperText={errors.consumedDate?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="consumedWeight"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('animals.consumedWeight')}
                        type="number"
                        fullWidth
                        inputProps={{ min: 0, step: 50 }}
                        error={!!errors.consumedWeight}
                        helperText={errors.consumedWeight?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            {/* Origin and Parents */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                mt: { xs: 1, sm: 2 },
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}>
                {t('animals.origin')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="origin"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.origin}>
                    <InputLabel>{t('animals.origin')}</InputLabel>
                    <Select {...field} label={t('animals.origin')}>
                      <MenuItem value="BORN_HERE">{t('origin.BORN_HERE')}</MenuItem>
                      <MenuItem value="PURCHASED">{t('origin.PURCHASED')}</MenuItem>
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
                        <InputLabel>{t('animals.mother')}</InputLabel>
                        <Select {...field} label={t('animals.mother')}>
                          <MenuItem value="">{t('common.none')}</MenuItem>
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
                        <InputLabel>{t('animals.father')}</InputLabel>
                        <Select {...field} label={t('animals.father')}>
                          <MenuItem value="">{t('common.none')}</MenuItem>
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

            {/* Tags */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                mt: { xs: 1, sm: 2 },
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}>
                {t('animals.tags')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={tags.map(tag => tag.id)}
                    getOptionLabel={(tagId) => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag?.name || tagId;
                    }}
                    value={field.value || []}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((tagId, index) => {
                        const tag = tags.find(t => t.id === tagId);
                        return (
                          <Chip
                            key={tagId}
                            label={tag?.name || tagId}
                            {...getTagProps({ index })}
                            style={{
                              backgroundColor: tag?.color || '#gray',
                              color: 'white'
                            }}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('animals.tags')}
                        placeholder={t('animals.tags')}
                        error={!!errors.tags}
                        helperText={errors.tags?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('animals.notes')}
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
              <Box display="flex" gap={2} justifyContent="flex-end" sx={{
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/animals')}
                  disabled={isSubmitting}
                  sx={{ order: { xs: 2, sm: 1 } }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                  sx={{ order: { xs: 1, sm: 2 } }}
                >
                  {isSubmitting ? t('common.loading') : t('common.save')}
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