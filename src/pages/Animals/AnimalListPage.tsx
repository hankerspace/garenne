import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { getLiveAnimals, getAnimalActiveTreatments } from '../../state/selectors';
import { Status } from '../../models/types';
import { SearchService, SearchFilters } from '../../services/search.service';
import { AdvancedSearchFilters } from '../../components/AdvancedSearchFilters';
import { useTranslation } from '../../hooks/useTranslation';
import { useScreenReaderAnnouncement } from '../../hooks/useAccessibility';
import { QuickWeightModal } from '../../components/modals/QuickWeightModal';
import { QuickTreatmentModal } from '../../components/modals/QuickTreatmentModal';
import { AnimalCard } from '../../components/AnimalCard';
import { EmptyState } from '../../components/EmptyState';
import { ConsumptionConfirmationDialog } from '../../components/ConsumptionConfirmationDialog';

const AnimalListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const { announce } = useScreenReaderAnnouncement();
  const [showQuickWeight, setShowQuickWeight] = useState(false);
  const [showQuickTreatment, setShowQuickTreatment] = useState(false);
  const [consumptionDialog, setConsumptionDialog] = useState<{
    open: boolean;
    animalId: string | null;
  }>({ open: false, animalId: null });

  // Raccourci clavier pour ajouter un animal (Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        navigate('/animals/new');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

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

  // Annoncer les résultats de recherche aux lecteurs d'écran
  useEffect(() => {
    if (searchFilters.query || Object.keys(searchFilters).length > 0) {
      const announcement = `${filteredAnimals.length} animal${filteredAnimals.length !== 1 ? 'aux' : ''} trouvé${filteredAnimals.length !== 1 ? 's' : ''}`;
      const timer = setTimeout(() => announce(announcement, 'polite'), 500);
      return () => clearTimeout(timer);
    }
  }, [filteredAnimals.length, searchFilters, announce]);

  // Helper functions (kept for compatibility with current template)
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
        {filteredAnimals.map((animal, index) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={animal.id}>
            <AnimalCard
              animal={animal}
              index={index}
              cages={cages}
              tags={tags}
              onMarkConsumed={handleMarkConsumed}
            />
          </Grid>
        ))}
      </Grid>

      {filteredAnimals.length === 0 && (
        <EmptyState hasAnimals={animals.length > 0} />
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="Ajouter un nouvel animal (Ctrl+N)"
        title="Ajouter un nouvel animal (Ctrl+N)"
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
      <ConsumptionConfirmationDialog
        open={consumptionDialog.open}
        onClose={() => setConsumptionDialog({ open: false, animalId: null })}
        onConfirm={confirmConsumption}
      />
    </Container>
  );
};

export default AnimalListPage;