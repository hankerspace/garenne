import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { Sex, Status } from '../../models/types';
import { calculateAgeText, formatDate } from '../../utils/dates';
import { getAnimalActiveTreatments, getAnimalWeights, getAnimalTreatments } from '../../state/selectors';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`animal-tabpanel-${index}`}
      aria-labelledby={`animal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AnimalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  
  const [tabValue, setTabValue] = useState(() => {
    switch (initialTab) {
      case 'breeding': return 1;
      case 'weights': return 2;
      case 'health': return 3;
      default: return 0;
    }
  });

  const state = useAppStore();
  const animals = state.animals;
  const animal = animals.find(a => a.id === id);
  
  const weights = getAnimalWeights(state, id || '');
  const treatments = getAnimalTreatments(state, id || '');
  const activeTreatments = getAnimalActiveTreatments(state, id || '');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Reproducer: return 'success';
      case Status.Grow: return 'info';
      case Status.Retired: return 'warning';
      case Status.Deceased: return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case Status.Reproducer: return 'Reproducteur';
      case Status.Grow: return 'Croissance';
      case Status.Retired: return 'Retraité';
      case Status.Deceased: return 'Décédé';
      default: return status;
    }
  };

  if (!animal) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Alert severity="error">Animal non trouvé</Alert>
      </Container>
    );
  }

  // Get parent animals
  const mother = animal.motherId ? animals.find(a => a.id === animal.motherId) : null;
  const father = animal.fatherId ? animals.find(a => a.id === animal.fatherId) : null;

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={{ xs: 2, sm: 3 }} sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box display="flex" alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/animals')}
            sx={{ mr: 2 }}
            size="small"
          >
            Retour
          </Button>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <Avatar sx={{ mr: 2, bgcolor: animal.sex === Sex.Female ? 'pink' : 'lightblue' }}>
              {animal.sex === Sex.Female ? <FemaleIcon /> : <MaleIcon />}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" sx={{
                fontSize: { xs: '1.5rem', sm: '2.125rem' }
              }}>
                {animal.name || 'Animal sans nom'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {animal.identifier || 'Pas d\'identifiant'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/animals/${animal.id}/edit`)}
          size="small"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Modifier
        </Button>
      </Box>

      {/* Quick Info */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Statut
            </Typography>
            <Chip
              label={getStatusLabel(animal.status)}
              color={getStatusColor(animal.status)}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Race
            </Typography>
            <Typography variant="body2">
              {animal.breed || 'Non spécifiée'}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Âge
            </Typography>
            <Typography variant="body2">
              {animal.birthDate ? calculateAgeText(animal.birthDate) : 'Inconnu'}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Cage
            </Typography>
            <Typography variant="body2">
              {animal.cage || 'Non assignée'}
            </Typography>
          </Grid>
        </Grid>

        {activeTreatments.length > 0 && (
          <Box mt={2}>
            <Alert severity="warning" icon={<WarningIcon />}>
              Animal sous délai d'attente - {activeTreatments.length} traitement(s) actif(s)
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Tabs */}
      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Aperçu" />
          <Tab label="Reproduction" />
          <Tab label="Pesées" />
          <Tab label="Santé" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations générales
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sexe
                </Typography>
                <Typography variant="body2">
                  {animal.sex === Sex.Female ? 'Femelle' : animal.sex === Sex.Male ? 'Mâle' : 'Inconnu'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date de naissance
                </Typography>
                <Typography variant="body2">
                  {animal.birthDate ? formatDate(animal.birthDate) : 'Non renseignée'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Origine
                </Typography>
                <Typography variant="body2">
                  {animal.origin === 'BORN_HERE' ? 'Né ici' : animal.origin === 'PURCHASED' ? 'Acheté' : 'Non renseignée'}
                </Typography>
              </Box>

              {animal.notes && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {animal.notes}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Parenté
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mère
                </Typography>
                <Typography variant="body2">
                  {mother ? (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate(`/animals/${mother.id}`)}
                    >
                      {mother.name || mother.identifier || mother.id}
                    </Button>
                  ) : (
                    'Non renseignée'
                  )}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Père
                </Typography>
                <Typography variant="body2">
                  {father ? (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate(`/animals/${father.id}`)}
                    >
                      {father.name || father.identifier || father.id}
                    </Button>
                  ) : (
                    'Non renseigné'
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Breeding Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Reproduction
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
            >
              Nouvelle saillie
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Fonctionnalité en cours de développement
          </Typography>
        </TabPanel>

        {/* Weights Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Pesées ({weights.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
            >
              Nouvelle pesée
            </Button>
          </Box>
          
          {weights.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucune pesée enregistrée
            </Typography>
          ) : (
            <List>
              {weights.map((weight) => (
                <ListItem key={weight.id} divider>
                  <ListItemText
                    primary={`${weight.weightGrams}g`}
                    secondary={`${formatDate(weight.date)}${weight.notes ? ` - ${weight.notes}` : ''}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Health Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Traitements ({treatments.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
            >
              Nouveau traitement
            </Button>
          </Box>

          {activeTreatments.length > 0 && (
            <Card sx={{ mb: 2, bgcolor: 'warning.light' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Traitements avec délai d'attente actif
                </Typography>
                {activeTreatments.map(treatment => (
                  <Typography key={treatment.id} variant="body2">
                    {treatment.product} - Délai jusqu'au {formatDate(treatment.withdrawalUntil!)}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          )}
          
          {treatments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucun traitement enregistré
            </Typography>
          ) : (
            <List>
              {treatments.map((treatment) => (
                <ListItem key={treatment.id} divider>
                  <ListItemText
                    primary={treatment.product}
                    secondary={`${formatDate(treatment.date)} - ${treatment.reason || 'Raison non spécifiée'}${treatment.withdrawalUntil ? ` - Délai: ${formatDate(treatment.withdrawalUntil)}` : ''}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AnimalDetailPage;