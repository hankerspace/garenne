import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Event as EventIcon,
  Add as AddIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  ChildCare as BabyIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../state/store';
import { getLiveAnimals, getActiveBreeders } from '../state/selectors';
import { Animal, Breeding, Litter, Sex, Status } from '../models/types';
import { BreedingModal } from '../components/modals/BreedingModal';
import { addDaysToDate, formatDate, getDifferenceInDays } from '../utils/dates';
import { useTranslation } from '../hooks/useTranslation';

interface PlanningEvent {
  id: string;
  type: 'breeding' | 'diagnosis' | 'kindling' | 'weaning' | 'rebreeding';
  title: string;
  description: string;
  date: string;
  animal?: Animal;
  breeding?: Breeding;
  litter?: Litter;
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'today' | 'overdue' | 'completed';
}

const ReproductionPlanningPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  const [showBreedingModal, setShowBreedingModal] = useState(false);
  const [selectedFemale, setSelectedFemale] = useState<Animal | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3months'>('month');

  const { animals, breedings, litters, settings } = useAppStore();
  const activeBreeders = getActiveBreeders(useAppStore());

  // Calculate all planning events
  const planningEvents = useMemo(() => {
    const events: PlanningEvent[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Process breedings
    breedings.forEach((breeding: Breeding) => {
      const female = animals.find((a: Animal) => a.id === breeding.femaleId);
      if (!female) return;

      const breedingDate = breeding.date;
      const gestationDays = settings.gestationDuration || 31;
      const expectedKindlingDate = addDaysToDate(breedingDate, gestationDays);
      const diagnosisDate = addDaysToDate(breedingDate, 14); // Pregnancy diagnosis at 14 days

      // Add breeding event
      events.push({
        id: `breeding-${breeding.id}`,
        type: 'breeding',
        title: `Saillie - ${female.name || female.identifier}`,
        description: `Saillie réalisée`,
        date: breedingDate,
        animal: female,
        breeding,
        priority: 'medium',
        status: 'completed',
      });

      // Add diagnosis event if not done yet
      if (!breeding.diagnosis || breeding.diagnosis === 'UNKNOWN') {
        const daysSinceDiagnosis = getDifferenceInDays(today, diagnosisDate);
        events.push({
          id: `diagnosis-${breeding.id}`,
          type: 'diagnosis',
          title: `Diagnostic gestation - ${female.name || female.identifier}`,
          description: `Diagnostic de gestation recommandé`,
          date: diagnosisDate,
          animal: female,
          breeding,
          priority: daysSinceDiagnosis >= 0 ? 'high' : 'medium',
          status: daysSinceDiagnosis > 7 ? 'overdue' : daysSinceDiagnosis >= 0 ? 'today' : 'upcoming',
        });
      }

      // Add expected kindling event if pregnant or unknown
      if (breeding.diagnosis !== 'NOT_PREGNANT') {
        const daysUntilKindling = getDifferenceInDays(expectedKindlingDate, today);
        const hasLitter = litters.some((l: Litter) => l.motherId === female.id && 
          Math.abs(getDifferenceInDays(l.kindlingDate, expectedKindlingDate)) <= 3);

        if (!hasLitter) {
          events.push({
            id: `kindling-${breeding.id}`,
            type: 'kindling',
            title: `Mise-bas attendue - ${female.name || female.identifier}`,
            description: `Mise-bas prévue (J+${gestationDays})`,
            date: expectedKindlingDate,
            animal: female,
            breeding,
            priority: daysUntilKindling <= 3 ? 'high' : 'medium',
            status: daysUntilKindling < -7 ? 'overdue' : daysUntilKindling <= 0 ? 'today' : 'upcoming',
          });
        }
      }
    });

    // Process litters for weaning events
    litters.forEach((litter: Litter) => {
      const mother = animals.find((a: Animal) => a.id === litter.motherId);
      if (!mother) return;

      const weaningDays = settings.weaningDuration || 28;
      const estimatedWeaningDate = litter.estimatedWeaningDate || addDaysToDate(litter.kindlingDate, weaningDays);

      // Add weaning event if not done yet
      if (!litter.weaningDate) {
        const daysUntilWeaning = getDifferenceInDays(estimatedWeaningDate, today);
        events.push({
          id: `weaning-${litter.id}`,
          type: 'weaning',
          title: `Sevrage prévu - ${mother.name || mother.identifier}`,
          description: `Sevrage des ${litter.bornAlive} lapereaux`,
          date: estimatedWeaningDate,
          animal: mother,
          litter,
          priority: daysUntilWeaning <= 3 ? 'high' : 'medium',
          status: daysUntilWeaning < -7 ? 'overdue' : daysUntilWeaning <= 0 ? 'today' : 'upcoming',
        });
      }

      // Add rebreeding recommendation
      const rebreedingReadyDays = settings.reproductionReadyDuration || 42;
      const rebreedingDate = addDaysToDate(litter.kindlingDate, rebreedingReadyDays);
      const daysUntilRebreeding = getDifferenceInDays(rebreedingDate, today);

      // Only suggest rebreeding if no recent breeding
      const hasRecentBreeding = breedings.some((b: Breeding) => 
        b.femaleId === mother.id && 
        getDifferenceInDays(b.date, litter.kindlingDate) > 0 &&
        getDifferenceInDays(today, b.date) <= 90
      );

      if (!hasRecentBreeding && daysUntilRebreeding <= 30 && daysUntilRebreeding >= -30) {
        events.push({
          id: `rebreeding-${litter.id}`,
          type: 'rebreeding',
          title: `Remise à la reproduction - ${mother.name || mother.identifier}`,
          description: `Femelle prête pour nouvelle saillie`,
          date: rebreedingDate,
          animal: mother,
          litter,
          priority: daysUntilRebreeding <= 0 ? 'medium' : 'low',
          status: daysUntilRebreeding <= 0 ? 'today' : 'upcoming',
        });
      }
    });

    // Sort events by date
    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, [animals, breedings, litters, settings]);

  // Filter events by time range
  const filteredEvents = useMemo(() => {
    const today = new Date();
    const endDate = new Date();

    switch (timeRange) {
      case 'week':
        endDate.setDate(today.getDate() + 7);
        break;
      case 'month':
        endDate.setDate(today.getDate() + 30);
        break;
      case '3months':
        endDate.setDate(today.getDate() + 90);
        break;
    }

    return planningEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate <= endDate;
    });
  }, [planningEvents, timeRange]);

  // Group events by priority and status
  const eventsByPriority = useMemo(() => {
    const urgent = filteredEvents.filter(e => e.status === 'overdue' || (e.status === 'today' && e.priority === 'high'));
    const important = filteredEvents.filter(e => e.status === 'today' || e.priority === 'high');
    const upcoming = filteredEvents.filter(e => e.status === 'upcoming');

    return { urgent, important, upcoming };
  }, [filteredEvents]);

  // Statistics
  const stats = useMemo(() => {
    const activeFemales = activeBreeders.filter((a: Animal) => a.sex === Sex.Female).length;
    const activeMales = activeBreeders.filter((a: Animal) => a.sex === Sex.Male).length;
    const activeBreedings = breedings.filter((b: Breeding) => {
      const breedingDate = new Date(b.date);
      const daysSince = getDifferenceInDays(new Date().toISOString().split('T')[0], b.date);
      return daysSince <= 35; // Active if within gestation period
    }).length;
    const expectedKindlings = eventsByPriority.urgent.filter(e => e.type === 'kindling').length +
                            eventsByPriority.important.filter(e => e.type === 'kindling').length;

    return { activeFemales, activeMales, activeBreedings, expectedKindlings };
  }, [activeBreeders, breedings, eventsByPriority]);

  const handleScheduleBreeding = (female?: Animal) => {
    setSelectedFemale(female || null);
    setShowBreedingModal(true);
  };

  const getEventIcon = (type: PlanningEvent['type']) => {
    switch (type) {
      case 'breeding': return <FemaleIcon sx={{ color: '#e91e63' }} />;
      case 'diagnosis': return <ScheduleIcon sx={{ color: '#ff9800' }} />;
      case 'kindling': return <BabyIcon sx={{ color: '#4caf50' }} />;
      case 'weaning': return <ScheduleIcon sx={{ color: '#2196f3' }} />;
      case 'rebreeding': return <EventIcon sx={{ color: '#9c27b0' }} />;
      default: return <EventIcon />;
    }
  };

  const getEventColor = (event: PlanningEvent) => {
    switch (event.status) {
      case 'overdue': return 'error';
      case 'today': return 'warning';
      case 'upcoming': return 'info';
      default: return 'default';
    }
  };

  const EventCard: React.FC<{ event: PlanningEvent }> = ({ event }) => {
    const daysFromToday = getDifferenceInDays(event.date, new Date().toISOString().split('T')[0]);
    const relativeDate = daysFromToday === 0 ? 'Aujourd\'hui' : 
                        daysFromToday === 1 ? 'Demain' : 
                        daysFromToday === -1 ? 'Hier' :
                        daysFromToday > 0 ? `Dans ${daysFromToday} jours` :
                        `Il y a ${Math.abs(daysFromToday)} jours`;

    return (
      <Card sx={{ 
        mb: 2, 
        border: event.status === 'overdue' ? 2 : 1,
        borderColor: event.status === 'overdue' ? 'error.main' : 'divider',
        '&:hover': { boxShadow: 4 }
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
              {getEventIcon(event.type)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.description}
              </Typography>
            </Box>
            <Chip 
              label={relativeDate}
              color={getEventColor(event)}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              📅 {formatDate(event.date)}
            </Typography>
            {event.animal && (
              <Button
                size="small"
                onClick={() => navigate(`/animals/${event.animal!.id}`)}
              >
                Voir l'animal
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, sm: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.75rem', sm: '2.125rem' },
          fontWeight: 'bold',
        }}>
          📅 Planning de Reproduction
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              label="Période"
            >
              <MenuItem value="week">7 jours</MenuItem>
              <MenuItem value="month">30 jours</MenuItem>
              <MenuItem value="3months">3 mois</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleScheduleBreeding()}
            size={isMobile ? 'small' : 'medium'}
          >
            Programmer saillie
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.activeFemales}
              </Typography>
              <Typography variant="body2">
                Femelles reproductrices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'secondary.main', color: 'secondary.contrastText' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.activeMales}
              </Typography>
              <Typography variant="body2">
                Mâles reproducteurs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'info.main', color: 'info.contrastText' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.activeBreedings}
              </Typography>
              <Typography variant="body2">
                Saillies actives
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'warning.main', color: 'warning.contrastText' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.expectedKindlings}
              </Typography>
              <Typography variant="body2">
                Mise-bas attendues
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Priority Events */}
      <Grid container spacing={3}>
        {/* Urgent Events */}
        {eventsByPriority.urgent.length > 0 && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: 'error.50', border: '1px solid', borderColor: 'error.main' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'error.main', fontWeight: 'bold' }}>
                🚨 Urgent ({eventsByPriority.urgent.length})
              </Typography>
              {eventsByPriority.urgent.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </Paper>
          </Grid>
        )}

        {/* Important Events */}
        {eventsByPriority.important.length > 0 && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: 'warning.50', border: '1px solid', borderColor: 'warning.main' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                ⚠️ Important ({eventsByPriority.important.length})
              </Typography>
              {eventsByPriority.important.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </Paper>
          </Grid>
        )}

        {/* Upcoming Events */}
        <Grid item xs={12} md={eventsByPriority.urgent.length + eventsByPriority.important.length > 0 ? 4 : 12}>
          <Paper sx={{ p: 2, backgroundColor: 'info.50', border: '1px solid', borderColor: 'info.main' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'info.main', fontWeight: 'bold' }}>
              📅 À venir ({eventsByPriority.upcoming.length})
            </Typography>
            {eventsByPriority.upcoming.length > 0 ? (
              eventsByPriority.upcoming.slice(0, 10).map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <Alert severity="info">
                Aucun événement programmé pour la période sélectionnée
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Available Females for Breeding */}
      {activeBreeders.filter((a: Animal) => a.sex === Sex.Female).length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            🐰 Femelles disponibles pour saillie
          </Typography>
          <Grid container spacing={2}>
            {activeBreeders
              .filter((a: Animal) => a.sex === Sex.Female)
              .filter((female: Animal) => {
                // Filter out females with recent breedings (within 35 days)
                const hasRecentBreeding = breedings.some((b: Breeding) => 
                  b.femaleId === female.id && 
                  getDifferenceInDays(new Date().toISOString().split('T')[0], b.date) <= 35
                );
                return !hasRecentBreeding;
              })
              .map((female: Animal) => (
                <Grid item xs={12} sm={6} md={4} key={female.id}>
                  <Card sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                    transition: 'all 0.2s ease-in-out'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'pink' }}>
                          <FemaleIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                            {female.name || female.identifier}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {female.breed && `${female.breed} • `}
                            {female.cage && `Cage ${female.cage}`}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => handleScheduleBreeding(female)}
                        startIcon={<AddIcon />}
                      >
                        Programmer saillie
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/animals/${female.id}`)}
                      >
                        Détails
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      )}

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'grey.50',
          borderRadius: 3,
          border: '2px dashed',
          borderColor: 'divider',
          mt: 4
        }}>
          <CalendarIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
            Aucun événement planifié
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Programmez vos premières saillies pour commencer à utiliser le planning de reproduction
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleScheduleBreeding()}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 3,
            }}
          >
            Programmer ma première saillie
          </Button>
        </Box>
      )}

      {/* Breeding Modal */}
      <BreedingModal
        open={showBreedingModal}
        onClose={() => {
          setShowBreedingModal(false);
          setSelectedFemale(null);
        }}
        preselectedFemale={selectedFemale || undefined}
      />
    </Container>
  );
};

export default ReproductionPlanningPage;