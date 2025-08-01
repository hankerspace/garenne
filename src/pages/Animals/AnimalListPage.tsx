import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Pets as PetsIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { getLiveAnimals, getAnimalActiveTreatments } from '../../state/selectors';
import { Sex, Status } from '../../models/types';
import { calculateAgeText } from '../../utils/dates';
import { QuickWeightModal } from '../../components/modals/QuickWeightModal';
import { QuickTreatmentModal } from '../../components/modals/QuickTreatmentModal';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import { SearchService, SearchFilters } from '../../services/search.service';
import { AdvancedSearchFilters } from '../../components/AdvancedSearchFilters';
import { useTranslation } from '../../hooks/useTranslation';

const AnimalListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [showQuickWeight, setShowQuickWeight] = useState(false);
  const [showQuickTreatment, setShowQuickTreatment] = useState(false);
  const [consumptionDialog, setConsumptionDialog] = useState<{
    open: boolean;
    animalId: string | null;
  }>({ open: false, animalId: null });

  // Handle URL parameters for quick actions
  useEffect(() => {
    if (searchParams.get('quickWeight') === 'true') {
      setShowQuickWeight(true);
      // Clean up URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('quickWeight');
      setSearchParams(newParams, { replace: true });
    }
    
    if (searchParams.get('quickTreatment') === 'true') {
      setShowQuickTreatment(true);
      // Clean up URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('quickTreatment');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const state = useAppStore();
  const animals = getLiveAnimals(state);
  const settings = state.settings;
  const tags = state.tags;
  const cages = state.cages;
  const { markAnimalConsumed } = useAppStore();

  // Get filter options and search suggestions
  const filterOptions = useMemo(() => 
    SearchService.getFilterOptions(animals), [animals]
  );

  const searchSuggestions = useMemo(() => 
    SearchService.getSearchSuggestions(animals, searchFilters.query || ''), [animals, searchFilters.query]
  );

  // Filter animals using intelligent search
  const filteredAnimals = useMemo(() => 
    SearchService.searchAnimals(animals, searchFilters), [animals, searchFilters]
  );

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Reproducer:
        return 'success';
      case Status.Grow:
        return 'info';
      case Status.Retired:
        return 'warning';
      case Status.Deceased:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Status) => {
    return t(`status.${status}`);
  };

  const hasActiveWithdrawal = (animalId: string) => {
    const treatments = getAnimalActiveTreatments(state, animalId);
    return treatments.length > 0;
  };

  const handleMarkConsumed = (animalId: string) => {
    setConsumptionDialog({ open: true, animalId });
  };

  const confirmConsumption = () => {
    if (consumptionDialog.animalId) {
      const today = new Date().toISOString().split('T')[0];
      markAnimalConsumed(consumptionDialog.animalId, today);
      setConsumptionDialog({ open: false, animalId: null });
    }
  };

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ xs: 2, sm: 3 }}>
        <Typography variant="h4" component="h2" sx={{
          fontSize: { xs: '1.75rem', sm: '2.125rem' }
        }}>
          {t('animals.title')} ({filteredAnimals.length})
        </Typography>
      </Box>

      {/* Enhanced Search and Filters */}
      <AdvancedSearchFilters
        filters={searchFilters}
        onFiltersChange={setSearchFilters}
        suggestions={searchSuggestions}
        filterOptions={filterOptions}
      />

      {/* Animals Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {filteredAnimals.map((animal) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={animal.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, bgcolor: animal.sex === Sex.Female ? 'pink' : 'lightblue' }}>
                    {animal.sex === Sex.Female ? <FemaleIcon /> : <MaleIcon />}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                      {animal.name || t('animals.name')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {animal.identifier || t('animals.identifier')}
                    </Typography>
                  </Box>
                  {settings.enableQR && (
                    <Box ml={1}>
                      <QRCodeDisplay animal={animal} size="small" />
                    </Box>
                  )}
                  {hasActiveWithdrawal(animal.id) && (
                    <WarningIcon color="warning" sx={{ ml: 1 }} />
                  )}
                </Box>

                <Box mb={2}>
                  <Chip
                    label={getStatusLabel(animal.status)}
                    color={getStatusColor(animal.status)}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {animal.sex === Sex.Female && (
                    <Chip
                      label="♀"
                      color="secondary"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                  {animal.sex === Sex.Male && (
                    <Chip
                      label="♂"
                      color="primary"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                  {/* Display animal tags */}
                  {animal.tags && animal.tags.map((tagId) => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? (
                      <Chip
                        key={tagId}
                        label={tag.name}
                        size="small"
                        sx={{ 
                          mr: 1, 
                          mb: 1,
                          backgroundColor: tag.color || '#e0e0e0',
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                    ) : null;
                  })}
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>{t('animals.breed')}:</strong> {animal.breed || t('common.none')}
                </Typography>
                
                {animal.birthDate && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Âge:</strong> {calculateAgeText(animal.birthDate)}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>{t('animals.cage')}:</strong> {
                    animal.cage 
                      ? (cages.find(c => c.id === animal.cage)?.name || 'aucun')
                      : 'aucun'
                  }
                </Typography>

                {animal.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {animal.notes}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions sx={{ 
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: { xs: 0.5, sm: 1 }
              }}>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/animals/${animal.id}`)}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Détails
                </Button>
                <Button 
                  size="small" 
                  color="secondary"
                  onClick={() => navigate(`/animals/${animal.id}?tab=weights`)}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Peser
                </Button>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => navigate(`/animals/${animal.id}/edit`)}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {t('common.edit')}
                </Button>
                {animal.status === Status.Grow && (
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleMarkConsumed(animal.id)}
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {t('animals.markConsumed')}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAnimals.length === 0 && (
        <Box textAlign="center" py={4}>
          <PetsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun animal trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {animals.length === 0 
              ? 'Commencez par ajouter votre premier animal'
              : 'Essayez de modifier vos filtres de recherche'
            }
          </Typography>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add animal"
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 80, sm: 16 }, 
          right: 16,
          zIndex: 1000
        }}
        onClick={() => navigate('/animals/new')}
      >
        <AddIcon />
      </Fab>

      {/* Quick Action Modals */}
      <QuickWeightModal 
        open={showQuickWeight} 
        onClose={() => setShowQuickWeight(false)} 
      />
      <QuickTreatmentModal 
        open={showQuickTreatment} 
        onClose={() => setShowQuickTreatment(false)} 
      />

      {/* Consumption Confirmation Dialog */}
      <Dialog
        open={consumptionDialog.open}
        onClose={() => setConsumptionDialog({ open: false, animalId: null })}
      >
        <DialogTitle>{t('animals.confirmConsumption')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('animals.confirmConsumption')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConsumptionDialog({ open: false, animalId: null })}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={confirmConsumption}
            color="error"
            variant="contained"
          >
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnimalListPage;