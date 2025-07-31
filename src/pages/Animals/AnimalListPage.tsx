import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AnimalListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [sexFilter, setSexFilter] = useState<Sex | 'ALL'>('ALL');

  const state = useAppStore();
  const animals = getLiveAnimals(state);

  // Filter animals based on search and filters
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch = 
      animal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.identifier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || animal.status === statusFilter;
    const matchesSex = sexFilter === 'ALL' || animal.sex === sexFilter;
    
    return matchesSearch && matchesStatus && matchesSex;
  });

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
    switch (status) {
      case Status.Reproducer:
        return 'Reproducteur';
      case Status.Grow:
        return 'Croissance';
      case Status.Retired:
        return 'Retraité';
      case Status.Deceased:
        return 'Décédé';
      default:
        return status;
    }
  };

  const hasActiveWithdrawal = (animalId: string) => {
    const treatments = getAnimalActiveTreatments(state, animalId);
    return treatments.length > 0;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h2">
          Animaux ({filteredAnimals.length})
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher par nom, identifiant ou race..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
              >
                <MenuItem value="ALL">Tous</MenuItem>
                <MenuItem value={Status.Reproducer}>Reproducteurs</MenuItem>
                <MenuItem value={Status.Grow}>Croissance</MenuItem>
                <MenuItem value={Status.Retired}>Retraités</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sexe</InputLabel>
              <Select
                value={sexFilter}
                label="Sexe"
                onChange={(e) => setSexFilter(e.target.value as Sex | 'ALL')}
              >
                <MenuItem value="ALL">Tous</MenuItem>
                <MenuItem value={Sex.Female}>Femelles</MenuItem>
                <MenuItem value={Sex.Male}>Mâles</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Animals Grid */}
      <Grid container spacing={2}>
        {filteredAnimals.map((animal) => (
          <Grid item xs={12} sm={6} md={4} key={animal.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, bgcolor: animal.sex === Sex.Female ? 'pink' : 'lightblue' }}>
                    {animal.sex === Sex.Female ? <FemaleIcon /> : <MaleIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3">
                      {animal.name || 'Sans nom'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {animal.identifier || 'Pas d\'identifiant'}
                    </Typography>
                  </Box>
                  {hasActiveWithdrawal(animal.id) && (
                    <WarningIcon color="warning" sx={{ ml: 'auto' }} />
                  )}
                </Box>

                <Box mb={2}>
                  <Chip
                    label={getStatusLabel(animal.status)}
                    color={getStatusColor(animal.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {animal.sex === Sex.Female && (
                    <Chip
                      label="♀"
                      color="secondary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {animal.sex === Sex.Male && (
                    <Chip
                      label="♂"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Race:</strong> {animal.breed || 'Non spécifiée'}
                </Typography>
                
                {animal.birthDate && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Âge:</strong> {calculateAgeText(animal.birthDate)}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Cage:</strong> {animal.cage || 'Non assignée'}
                </Typography>

                {animal.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {animal.notes}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/animals/${animal.id}`)}
                >
                  Voir détails
                </Button>
                <Button 
                  size="small" 
                  color="secondary"
                  onClick={() => navigate(`/animals/${animal.id}?tab=weights`)}
                >
                  Peser
                </Button>
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
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => navigate('/animals/new')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default AnimalListPage;