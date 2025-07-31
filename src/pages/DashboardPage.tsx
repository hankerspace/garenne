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
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../state/store';
import { getKPIs } from '../state/selectors';
import { PopulationChart } from '../components/charts/PopulationChart';

const DashboardPage = () => {
  const navigate = useNavigate();
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
    }
  };

  const kpiCards = [
    {
      title: 'Animaux vivants',
      value: kpis.liveAnimalsCount,
      icon: <PetsIcon color="primary" />,
      subtitle: `${kpis.femalesCount} femelles, ${kpis.malesCount} mâles`,
      action: () => navigate('/animals'),
    },
    {
      title: 'Reproducteurs',
      value: kpis.reproducersCount,
      icon: <TrendingUp color="secondary" />,
      subtitle: 'Animaux reproducteurs',
      action: () => navigate('/animals?filter=reproducteurs'),
    },
    {
      title: 'Portées récentes',
      value: kpis.recentLittersCount,
      icon: <FamilyIcon color="success" />,
      subtitle: 'Derniers 30 jours',
      action: () => navigate('/litters'),
    },
    {
      title: 'Traitements actifs',
      value: kpis.activeTreatmentsCount,
      icon: <Warning color="warning" />,
      subtitle: 'Sous délai d\'attente',
      action: () => navigate('/animals?filter=treatments'),
    },
    {
      title: 'Pesées récentes',
      value: kpis.recentWeightsCount,
      icon: <WeightIcon color="info" />,
      subtitle: 'Derniers 7 jours',
      action: () => navigate('/animals?tab=weights'),
    },
  ];

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        fontSize: { xs: '1.75rem', sm: '2.125rem' },
        mb: { xs: 2, sm: 3 }
      }}>
        Tableau de bord
      </Typography>

      {!hasData && (
        <Box mb={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bienvenue dans Garenne !
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Votre élevage semble vide. Voulez-vous charger des données d'exemple pour découvrir l'application ?
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={loadSeedData}
                sx={{ mr: 1 }}
              >
                Charger des données d'exemple
              </Button>
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={() => navigate('/animals?new=true')}
              >
                Créer mon premier animal
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={2.4} key={index}>
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
                  Voir détails
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
            Vue d'ensemble
          </Typography>
          <PopulationChart />
        </Box>
      )}

      {/* Quick Actions Section */}
      <Box mt={{ xs: 3, sm: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Actions rapides
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
              }
            }}>
              <CardContent>
                <PetsIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6">Nouvel animal</Typography>
                <Typography variant="body2" color="text.secondary">
                  Enregistrer un nouveau lapin
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleQuickAction('animal')}
                >
                  Ajouter
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <WeightIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6">Pesée rapide</Typography>
                <Typography variant="body2" color="text.secondary">
                  Enregistrer une pesée
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleQuickAction('weight')}
                >
                  Peser
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <FamilyIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6">Nouvelle portée</Typography>
                <Typography variant="body2" color="text.secondary">
                  Enregistrer une mise bas
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleQuickAction('litter')}
                >
                  Ajouter
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <MedicalIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6">Traitement</Typography>
                <Typography variant="body2" color="text.secondary">
                  Enregistrer un soin
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleQuickAction('treatment')}
                >
                  Traiter
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
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
          <ListItemText>Nouvel animal</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('weight')}>
          <ListItemIcon>
            <WeightIcon />
          </ListItemIcon>
          <ListItemText>Pesée rapide</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('litter')}>
          <ListItemIcon>
            <FamilyIcon />
          </ListItemIcon>
          <ListItemText>Nouvelle portée</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('treatment')}>
          <ListItemIcon>
            <MedicalIcon />
          </ListItemIcon>
          <ListItemText>Traitement</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default DashboardPage;