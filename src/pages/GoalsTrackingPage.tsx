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
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  GpsFixed as TargetIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../state/store';
import { getLiveAnimals, getRecentLitters, getActiveBreeders } from '../state/selectors';
import { Goal, GoalType, GoalPeriod, GoalStatus, Animal, Litter } from '../models/types';
import { formatDate, getDifferenceInDays } from '../utils/dates';
import { useTranslation } from '../hooks/useTranslation';

interface GoalFormData {
  title: string;
  description: string;
  type: GoalType;
  period: GoalPeriod;
  targetValue: number;
  targetUnit: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  notes: string;
}

const GoalsTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteConfirmGoal, setDeleteConfirmGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<'low' | 'medium' | 'high' | 'ALL'>('ALL');

  const { goals, goalAchievements, animals, litters, breedings } = useAppStore();
  const { addGoal, updateGoal, deleteGoal, updateGoalProgress, completeGoal } = useAppStore();

  const [goalForm, setGoalForm] = useState<GoalFormData>({
    title: '',
    description: '',
    type: GoalType.Production,
    period: GoalPeriod.Monthly,
    targetValue: 0,
    targetUnit: 'animaux',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    priority: 'medium',
    category: '',
    notes: '',
  });

  // Calculate current progress for each goal
  const goalsWithProgress = useMemo(() => {
    return goals.map(goal => {
      let currentValue = 0;
      const today = new Date().toISOString().split('T')[0];
      
      switch (goal.type) {
        case GoalType.Production:
          // Count animals born/acquired in period
          currentValue = animals.filter(animal => 
            animal.birthDate && 
            animal.birthDate >= goal.startDate && 
            animal.birthDate <= today &&
            animal.birthDate <= goal.endDate
          ).length;
          break;
          
        case GoalType.LitterCount:
          // Count litters in period
          currentValue = litters.filter(litter =>
            litter.kindlingDate >= goal.startDate &&
            litter.kindlingDate <= today &&
            litter.kindlingDate <= goal.endDate
          ).length;
          break;
          
        case GoalType.SurvivalRate:
          // Calculate survival rate
          const periodLitters = litters.filter(litter =>
            litter.kindlingDate >= goal.startDate &&
            litter.kindlingDate <= today &&
            litter.kindlingDate <= goal.endDate
          );
          const totalBorn = periodLitters.reduce((sum, l) => sum + l.bornAlive, 0);
          const totalWeaned = periodLitters.reduce((sum, l) => sum + (l.weanedCount || 0), 0);
          currentValue = totalBorn > 0 ? Math.round((totalWeaned / totalBorn) * 100) : 0;
          break;
          
        case GoalType.AverageWeight:
          // This would need weight tracking implementation
          currentValue = goal.currentValue || 0;
          break;
          
        default:
          currentValue = goal.currentValue || 0;
      }
      
      // Update goal progress if it's different
      if (currentValue !== goal.currentValue) {
        updateGoalProgress(goal.id, currentValue);
      }
      
      const progressPercentage = Math.min((currentValue / goal.targetValue) * 100, 100);
      const daysRemaining = getDifferenceInDays(goal.endDate, today);
      const isOverdue = daysRemaining < 0;
      const isCompleted = currentValue >= goal.targetValue;
      
      return {
        ...goal,
        currentValue,
        progressPercentage,
        daysRemaining,
        isOverdue,
        isCompleted,
      };
    });
  }, [goals, animals, litters, updateGoalProgress]);

  // Filter goals
  const filteredGoals = useMemo(() => {
    return goalsWithProgress.filter(goal => {
      if (filterStatus !== 'ALL' && goal.status !== filterStatus) return false;
      if (filterPriority !== 'ALL' && goal.priority !== filterPriority) return false;
      return true;
    });
  }, [goalsWithProgress, filterStatus, filterPriority]);

  // Statistics
  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === GoalStatus.Active).length;
    const completedGoals = goals.filter(g => g.status === GoalStatus.Completed).length;
    const onTrackGoals = goalsWithProgress.filter(g => 
      g.status === GoalStatus.Active && 
      !g.isOverdue && 
      g.progressPercentage >= 25
    ).length;

    return { totalGoals, activeGoals, completedGoals, onTrackGoals };
  }, [goals, goalsWithProgress]);

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setGoalForm({
      title: '',
      description: '',
      type: GoalType.Production,
      period: GoalPeriod.Monthly,
      targetValue: 0,
      targetUnit: 'animaux',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      priority: 'medium',
      category: '',
      notes: '',
    });
    setShowGoalModal(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description || '',
      type: goal.type,
      period: goal.period,
      targetValue: goal.targetValue,
      targetUnit: goal.targetUnit,
      startDate: goal.startDate,
      endDate: goal.endDate,
      priority: goal.priority,
      category: goal.category || '',
      notes: goal.notes || '',
    });
    setShowGoalModal(true);
  };

  const handleSaveGoal = () => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalForm);
    } else {
      addGoal({
        ...goalForm,
        status: GoalStatus.Active,
      });
    }
    setShowGoalModal(false);
  };

  const handleDeleteGoal = (goal: Goal) => {
    setDeleteConfirmGoal(goal);
  };

  const confirmDeleteGoal = () => {
    if (deleteConfirmGoal) {
      deleteGoal(deleteConfirmGoal.id);
      setDeleteConfirmGoal(null);
    }
  };

  const getGoalTypeLabel = (type: GoalType) => {
    switch (type) {
      case GoalType.Production: return 'Production';
      case GoalType.LitterCount: return 'Portées';
      case GoalType.SurvivalRate: return 'Taux de survie';
      case GoalType.AverageWeight: return 'Poids moyen';
      case GoalType.ReproductionRate: return 'Taux reproduction';
      case GoalType.WeaningTime: return 'Temps sevrage';
      case GoalType.MortalityRate: return 'Taux mortalité';
      default: return 'Personnalisé';
    }
  };

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.Active: return <TrendingUpIcon color="primary" />;
      case GoalStatus.Completed: return <CheckCircleIcon color="success" />;
      case GoalStatus.Paused: return <PauseIcon color="warning" />;
      case GoalStatus.Failed: return <ErrorIcon color="error" />;
      default: return <FlagIcon />;
    }
  };

  const getStatusColor = (goal: any) => {
    if (goal.status === GoalStatus.Completed) return 'success';
    if (goal.isOverdue) return 'error';
    if (goal.progressPercentage >= 75) return 'success';
    if (goal.progressPercentage >= 50) return 'warning';
    return 'error';
  };

  const GoalCard: React.FC<{ goal: any }> = ({ goal }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
      transition: 'all 0.2s ease-in-out'
    }}>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: `${goal.priority}.main` }}>
            {getStatusIcon(goal.status)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
              {goal.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getGoalTypeLabel(goal.type)} • {goal.period}
            </Typography>
          </Box>
          <Chip 
            label={goal.priority} 
            size="small" 
            color={goal.priority === 'high' ? 'error' : goal.priority === 'medium' ? 'warning' : 'default'}
          />
        </Box>

        {goal.description && (
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {goal.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Progression
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {goal.currentValue} / {goal.targetValue} {goal.targetUnit}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={goal.progressPercentage} 
            color={getStatusColor(goal)}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {Math.round(goal.progressPercentage)}% • {goal.daysRemaining >= 0 
              ? `${goal.daysRemaining} jours restants` 
              : `${Math.abs(goal.daysRemaining)} jours de retard`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            📅 {formatDate(goal.startDate)} → {formatDate(goal.endDate)}
          </Typography>
          {goal.isCompleted && (
            <Chip 
              icon={<TrophyIcon />} 
              label="Réussi!" 
              color="success" 
              size="small" 
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Button size="small" onClick={() => handleEditGoal(goal)}>
          Modifier
        </Button>
        <Box>
          <IconButton size="small" onClick={() => handleDeleteGoal(goal)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );

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
          🎯 Objectifs & Suivi
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              label="Statut"
            >
              <MenuItem value="ALL">Tous</MenuItem>
              <MenuItem value={GoalStatus.Active}>Actif</MenuItem>
              <MenuItem value={GoalStatus.Completed}>Terminé</MenuItem>
              <MenuItem value={GoalStatus.Paused}>En pause</MenuItem>
              <MenuItem value={GoalStatus.Failed}>Échoué</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateGoal}
            size={isMobile ? 'small' : 'medium'}
          >
            Nouvel objectif
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalGoals}
              </Typography>
              <Typography variant="body2">
                Total objectifs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'info.main', color: 'info.contrastText' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.activeGoals}
              </Typography>
              <Typography variant="body2">
                En cours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'success.main', color: 'success.contrastText' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.completedGoals}
              </Typography>
              <Typography variant="body2">
                Terminés
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'warning.main', color: 'warning.contrastText' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.onTrackGoals}
              </Typography>
              <Typography variant="body2">
                Sur la bonne voie
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Goals Grid */}
      <Grid container spacing={3}>
        {filteredGoals.map((goal) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={goal.id}>
            <GoalCard goal={goal} />
          </Grid>
        ))}
      </Grid>

      {/* Empty state */}
      {filteredGoals.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'grey.50',
          borderRadius: 3,
          border: '2px dashed',
          borderColor: 'divider',
          mt: 4
        }}>
          <TargetIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
            Aucun objectif défini
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Définissez vos premiers objectifs d'élevage pour suivre vos performances et rester motivé
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateGoal}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 3,
            }}
          >
            Créer mon premier objectif
          </Button>
        </Box>
      )}

      {/* Goal Modal */}
      <Dialog open={showGoalModal} onClose={() => setShowGoalModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Modifier l\'objectif' : 'Nouvel objectif'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de l'objectif"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type d'objectif</InputLabel>
                <Select
                  value={goalForm.type}
                  onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value as GoalType })}
                  label="Type d'objectif"
                >
                  <MenuItem value={GoalType.Production}>Production d'animaux</MenuItem>
                  <MenuItem value={GoalType.LitterCount}>Nombre de portées</MenuItem>
                  <MenuItem value={GoalType.SurvivalRate}>Taux de survie (%)</MenuItem>
                  <MenuItem value={GoalType.AverageWeight}>Poids moyen</MenuItem>
                  <MenuItem value={GoalType.Custom}>Personnalisé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Période</InputLabel>
                <Select
                  value={goalForm.period}
                  onChange={(e) => setGoalForm({ ...goalForm, period: e.target.value as GoalPeriod })}
                  label="Période"
                >
                  <MenuItem value={GoalPeriod.Monthly}>Mensuel</MenuItem>
                  <MenuItem value={GoalPeriod.Quarterly}>Trimestriel</MenuItem>
                  <MenuItem value={GoalPeriod.Yearly}>Annuel</MenuItem>
                  <MenuItem value={GoalPeriod.OneTime}>Ponctuel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valeur cible"
                type="number"
                value={goalForm.targetValue}
                onChange={(e) => setGoalForm({ ...goalForm, targetValue: parseInt(e.target.value) || 0 })}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unité"
                value={goalForm.targetUnit}
                onChange={(e) => setGoalForm({ ...goalForm, targetUnit: e.target.value })}
                placeholder="Ex: animaux, portées, %"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de début"
                type="date"
                value={goalForm.startDate}
                onChange={(e) => setGoalForm({ ...goalForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de fin"
                type="date"
                value={goalForm.endDate}
                onChange={(e) => setGoalForm({ ...goalForm, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priorité</InputLabel>
                <Select
                  value={goalForm.priority}
                  onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value as any })}
                  label="Priorité"
                >
                  <MenuItem value="low">Faible</MenuItem>
                  <MenuItem value="medium">Moyenne</MenuItem>
                  <MenuItem value="high">Élevée</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Catégorie"
                value={goalForm.category}
                onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                placeholder="Ex: Production, Santé, Performance"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={goalForm.notes}
                onChange={(e) => setGoalForm({ ...goalForm, notes: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGoalModal(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveGoal} variant="contained">
            {editingGoal ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmGoal} onClose={() => setDeleteConfirmGoal(null)}>
        <DialogTitle>Supprimer l'objectif</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'objectif "{deleteConfirmGoal?.title}" ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmGoal(null)}>
            Annuler
          </Button>
          <Button onClick={confirmDeleteGoal} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add goal"
          sx={{ 
            position: 'fixed', 
            bottom: 80, 
            right: 16,
            zIndex: 1000,
          }}
          onClick={handleCreateGoal}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default GoalsTrackingPage;