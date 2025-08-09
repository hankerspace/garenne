import { Suspense } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Pets as PetsIcon,
  FamilyRestroom as FamilyIcon,
  MonitorWeight as WeightIcon,
  MedicalServices as MedicalIcon,
  TrendingUp,
  Warning,
  Event as EventIcon,
  Speed as SpeedIcon,
  Assessment as StatsIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../state/store';
import { getKPIs } from '../state/selectors';
import { PopulationChart } from '../components/LazyComponents';
import { useTranslation } from '../hooks/useTranslation';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const state = useAppStore();
  const kpis = getKPIs(state);
  const loadSeedData = useAppStore((state) => state.loadSeedData);

  // Show sample data button only if no data exists
  const hasData = state.animals.length > 0 || state.litters.length > 0 || state.treatments.length > 0;

  const handleFabClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFabClose = () => {
    setAnchorEl(null);
  };

  const handleQuickAction = (action: string) => {
    handleFabClose();
    switch (action) {
      case 'animal':
        navigate('/animals?new=true');
        break;
      case 'weight':
        navigate('/animals?quickWeight=true');
        break;
      case 'litter':
        navigate('/litters?new=true');
        break;
      case 'treatment':
        navigate('/animals?quickTreatment=true');
        break;
      case 'qr':
        navigate('/animals?view=qr');
        break;
    }
  };

  const kpiCards = [
    {
      title: t('dashboard.kpis.liveAnimals'),
      value: kpis.liveAnimalsCount,
      icon: <PetsIcon color="primary" />,
      subtitle: `${kpis.femalesCount} ${t('dashboard.kpis.femalesAndMales').split(', ')[0]}, ${kpis.malesCount} ${t('dashboard.kpis.femalesAndMales').split(', ')[1]}`,
      action: () => navigate('/animals'),
    },
    {
      title: t('dashboard.kpis.reproductors'),
      value: kpis.reproducersCount,
      icon: <TrendingUp color="secondary" />,
      subtitle: t('dashboard.kpis.reproductorsSubtitle'),
      action: () => navigate('/animals?filter=reproducteurs'),
    },
    {
      title: t('dashboard.kpis.reproductionPlanning'),
      value: kpis.activeBreeders || 0,
      icon: <EventIcon color="success" />,
      subtitle: t('dashboard.kpis.reproductionPlanningSubtitle'),
      action: () => navigate('/planning'),
    },
    {
      title: t('dashboard.kpis.quickActions'),
      value: '⚡',
      icon: <SpeedIcon color="warning" />,
      subtitle: t('dashboard.kpis.quickActionsSubtitle'),
      action: () => navigate('/quick'),
    },
    {
      title: t('dashboard.kpis.activeTreatments'),
      value: kpis.activeTreatmentsCount,
      icon: <Warning color="warning" />,
      subtitle: t('dashboard.kpis.activeTreatmentsSubtitle'),
      action: () => navigate('/animals?filter=treatments'),
    },
    {
      title: t('dashboard.kpis.statistics'),
      value: '📊',
      icon: <StatsIcon color="info" />,
      subtitle: t('dashboard.kpis.statisticsSubtitle'),
      action: () => navigate('/statistics/advanced'),
    },
  ];

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        fontSize: { xs: '1.75rem', sm: '2.125rem' },
        mb: { xs: 2, sm: 3 }
      }}>
        {t('dashboard.title')}
      </Typography>

      {!hasData && (
        <Box mb={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.welcomeTitle')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {t('dashboard.welcomeMessage')}
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={loadSeedData}
                sx={{ mr: 1 }}
              >
                {t('dashboard.loadSampleData')}
              </Button>
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={() => navigate('/animals?new=true')}
              >
                {t('dashboard.createFirstAnimal')}
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {card.icon}
                  <Typography variant="h6" component="h3" sx={{ 
                    ml: 1,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" color="primary" sx={{
                  fontSize: { xs: '1.75rem', sm: '2.125rem' }
                }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={card.action}>
                  {t('dashboard.viewDetails')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      {hasData && (
        <Box mt={{ xs: 3, sm: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}>
            {t('dashboard.overview')}
          </Typography>
          <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><Typography>Chargement du graphique...</Typography></Box>}>
            <PopulationChart />
          </Suspense>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 80, sm: 16 }, 
          right: 16,
          zIndex: 1000
        }}
        onClick={handleFabClick}
      >
        <AddIcon />
      </Fab>

      {/* Quick Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFabClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={() => handleQuickAction('animal')}>
          <ListItemIcon>
            <PetsIcon />
          </ListItemIcon>
          <ListItemText>{t('dashboard.quickActions.newAnimal')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('weight')}>
          <ListItemIcon>
            <WeightIcon />
          </ListItemIcon>
          <ListItemText>{t('dashboard.quickActions.quickWeighing')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('litter')}>
          <ListItemIcon>
            <FamilyIcon />
          </ListItemIcon>
          <ListItemText>{t('dashboard.quickActions.newLitter')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('treatment')}>
          <ListItemIcon>
            <MedicalIcon />
          </ListItemIcon>
          <ListItemText>{t('dashboard.quickActions.treatment')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('qr')}>
          <ListItemIcon>
            <QrCodeIcon />
          </ListItemIcon>
          <ListItemText>{t('dashboard.quickActions.qrCodes')}</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default DashboardPage;