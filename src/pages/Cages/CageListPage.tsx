import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Fab,
  TextField,
  InputAdornment,
  Chip,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as CageIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../state/store';
import { Cage } from '../../models/types';

const CageListPage: React.FC = () => {
  const navigate = useNavigate();
  const { cages, animals, deleteCage } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate occupancy for each cage
  const cageOccupancy = useMemo(() => {
    const occupancy: Record<string, number> = {};
    animals.forEach(animal => {
      if (animal.cage) {
        occupancy[animal.cage] = (occupancy[animal.cage] || 0) + 1;
      }
    });
    return occupancy;
  }, [animals]);

  // Filter cages based on search
  const filteredCages = useMemo(() => {
    if (!searchQuery.trim()) return cages;
    
    const query = searchQuery.toLowerCase();
    return cages.filter(cage => 
      cage.name.toLowerCase().includes(query) ||
      cage.description?.toLowerCase().includes(query) ||
      cage.location?.toLowerCase().includes(query)
    );
  }, [cages, searchQuery]);

  const handleDeleteCage = (cage: Cage) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la cage "${cage.name}" ?`)) {
      deleteCage(cage.id);
    }
  };

  const getAvailabilityColor = (cage: Cage) => {
    const occupancy = cageOccupancy[cage.id] || 0;
    const capacity = cage.capacity || 1;
    const percentage = occupancy / capacity;
    
    if (percentage >= 1) return 'error';
    if (percentage >= 0.8) return 'warning';
    return 'success';
  };

  const getAvailabilityText = (cage: Cage) => {
    const occupancy = cageOccupancy[cage.id] || 0;
    const capacity = cage.capacity || 1;
    return `${occupancy}/${capacity}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestion des Cages
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/cages/visualization')}
          >
            Visualisation
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/cages/new')}
          >
            Nouvelle Cage
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher une cage..."
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
      </Box>

      {filteredCages.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? 'Aucune cage trouvée' : 'Aucune cage enregistrée'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery ? 'Essayez de modifier votre recherche' : 'Commencez par créer votre première cage'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/cages/new')}
            >
              Créer ma première cage
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCages.map((cage) => (
            <Grid item xs={12} sm={6} md={4} key={cage.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" noWrap>
                      {cage.name}
                    </Typography>
                    <Badge
                      badgeContent={cageOccupancy[cage.id] || 0}
                      color="primary"
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <CageIcon />
                    </Badge>
                  </Box>

                  {cage.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {cage.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {cage.location && (
                      <Chip
                        label={cage.location}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={getAvailabilityText(cage)}
                      size="small"
                      color={getAvailabilityColor(cage)}
                      icon={<PeopleIcon />}
                    />
                  </Box>

                  {cage.capacity && (
                    <Typography variant="body2" color="text.secondary">
                      Capacité: {cage.capacity} animals
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/cages/${cage.id}/edit`)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteCage(cage)}
                  >
                    Supprimer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add cage"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/cages/new')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default CageListPage;