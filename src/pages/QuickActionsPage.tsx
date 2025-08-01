import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
  Paper,
  Alert,
} from '@mui/material';
import {
  MonitorWeight as WeightIcon,
  MedicalServices as TreatmentIcon,
  Add as AddIcon,
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  FamilyRestroom as FamilyIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../state/store';
import { getLiveAnimals, getActiveBreeders } from '../state/selectors';
import { QuickWeightModal } from '../components/modals/QuickWeightModal';
import { QuickTreatmentModal } from '../components/modals/QuickTreatmentModal';
import { BreedingModal } from '../components/modals/BreedingModal';
import { useTranslation } from '../hooks/useTranslation';
import { Sex } from '../models/types';

const QuickActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  const [showQuickWeight, setShowQuickWeight] = useState(false);
  const [showQuickTreatment, setShowQuickTreatment] = useState(false);
  const [showBreeding, setShowBreeding] = useState(false);

  const { animals } = useAppStore();
  const liveAnimals = getLiveAnimals(useAppStore());
  const activeBreeders = getActiveBreeders(useAppStore());

  const quickActions = [
    {
      id: 'quick-weight',
      title: 'Pesée rapide',
      description: 'Enregistrer le poids d\'un animal',
      icon: <WeightIcon sx={{ fontSize: 40 }} />,
      color: 'primary',
      action: () => setShowQuickWeight(true),
      available: liveAnimals.length > 0,
      disabledReason: 'Aucun animal disponible',
    },
    {
      id: 'quick-treatment',
      title: 'Traitement rapide',
      description: 'Ajouter un traitement médical',
      icon: <TreatmentIcon sx={{ fontSize: 40 }} />,
      color: 'secondary',
      action: () => setShowQuickTreatment(true),
      available: liveAnimals.length > 0,
      disabledReason: 'Aucun animal disponible',
    },
    {
      id: 'quick-breeding',
      title: 'Programmer saillie',
      description: 'Planifier une reproduction',
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: 'success',
      action: () => setShowBreeding(true),
      available: activeBreeders.filter(a => a.sex === Sex.Female).length > 0,
      disabledReason: 'Aucune femelle reproductrice disponible',
    },
    {
      id: 'add-animal',
      title: 'Nouvel animal',
      description: 'Enregistrer un nouvel animal',
      icon: <AddIcon sx={{ fontSize: 40 }} />,
      color: 'info',
      action: () => navigate('/animals/new'),
      available: true,
      disabledReason: '',
    },
    {
      id: 'add-litter',
      title: 'Nouvelle portée',
      description: 'Enregistrer une naissance',
      icon: <FamilyIcon sx={{ fontSize: 40 }} />,
      color: 'warning',
      action: () => navigate('/litters/new'),
      available: activeBreeders.filter(a => a.sex === Sex.Female).length > 0,
      disabledReason: 'Aucune femelle reproductrice disponible',
    },
    {
      id: 'view-planning',
      title: 'Planning',
      description: 'Voir le planning de reproduction',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: 'info',
      action: () => navigate('/planning'),
      available: true,
      disabledReason: '',
    },
  ];

  const QuickActionCard: React.FC<{ action: typeof quickActions[0] }> = ({ action }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      opacity: action.available ? 1 : 0.6,
      '&:hover': action.available ? { 
        boxShadow: 4, 
        transform: 'translateY(-2px)' 
      } : {},
      transition: 'all 0.2s ease-in-out'
    }}>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto 16px',
            bgcolor: `${action.color}.main`,
            color: `${action.color}.contrastText`,
          }}
        >
          {action.icon}
        </Avatar>
        
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          {action.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {action.description}
        </Typography>

        {!action.available && (
          <Typography variant="caption" color="error" sx={{ 
            display: 'block',
            fontStyle: 'italic',
            mt: 1
          }}>
            {action.disabledReason}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          variant="contained"
          color={action.color as any}
          onClick={action.action}
          disabled={!action.available}
          size="large"
          sx={{ px: 3 }}
        >
          {action.available ? 'Démarrer' : 'Indisponible'}
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto 16px',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <SpeedIcon sx={{ fontSize: 40 }} />
        </Avatar>
        
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.75rem', sm: '2.125rem' },
          fontWeight: 'bold',
          mb: 2,
        }}>
          ⚡ Actions Rapides
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Accédez rapidement aux actions les plus courantes de votre élevage. 
          Idéal pour un usage quotidien sur le terrain !
        </Typography>
      </Box>

      {/* PWA Information */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.main' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'info.main', fontWeight: 'bold' }}>
          💡 Astuce PWA
        </Typography>
        <Typography variant="body2" color="info.dark">
          Vous pouvez ajouter Garenne à votre écran d'accueil pour un accès encore plus rapide ! 
          Sur mobile, utilisez "Ajouter à l'écran d'accueil" dans le menu de votre navigateur.
          Les actions rapides seront alors disponibles directement depuis l'icône de l'application.
        </Typography>
      </Paper>

      {/* Quick Actions Grid */}
      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={action.id}>
            <QuickActionCard action={action} />
          </Grid>
        ))}
      </Grid>

      {/* Statistics Summary */}
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          📊 Résumé de l'élevage
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              {liveAnimals.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Animaux vivants
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
              {activeBreeders.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Reproducteurs
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
              {activeBreeders.filter(a => a.sex === Sex.Female).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Femelles repro
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Action Modals */}
      <QuickWeightModal
        open={showQuickWeight}
        onClose={() => setShowQuickWeight(false)}
      />

      <QuickTreatmentModal
        open={showQuickTreatment}
        onClose={() => setShowQuickTreatment(false)}
      />

      <BreedingModal
        open={showBreeding}
        onClose={() => setShowBreeding(false)}
      />
    </Container>
  );
};

export default QuickActionsPage;