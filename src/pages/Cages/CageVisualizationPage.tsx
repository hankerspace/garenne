import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
  Button,
  Badge,
} from '@mui/material';
import {
  Home as CageIcon,
  Pets as AnimalIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../state/store';
import { Status, Sex } from '../../models/types';

const CageVisualizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { cages, animals } = useAppStore();

  // Group animals by cage
  const animalsByCage = useMemo(() => {
    const grouped: Record<string, typeof animals> = {};
    
    // Initialize with empty arrays for all cages
    cages.forEach(cage => {
      grouped[cage.id] = [];
    });

    // Add uncaged animals
    grouped['uncaged'] = [];

    // Group animals
    animals.filter(a => a.status !== Status.Deceased && a.status !== Status.Consumed)
      .forEach(animal => {
        const cageId = animal.cage || 'uncaged';
        if (!grouped[cageId]) {
          grouped[cageId] = [];
        }
        grouped[cageId].push(animal);
      });

    return grouped;
  }, [cages, animals]);

  const getSexIcon = (sex: Sex) => {
    switch (sex) {
      case Sex.Male:
        return '♂';
      case Sex.Female:
        return '♀';
      default:
        return '?';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Reproducer:
        return 'success';
      case Status.Grow:
        return 'info';
      case Status.Retired:
        return 'warning';
      default:
        return 'default';
    }
  };

  const CageCard: React.FC<{ cageId: string; cageName: string; capacity?: number }> = ({ 
    cageId, 
    cageName, 
    capacity 
  }) => {
    const cageAnimals = animalsByCage[cageId] || [];
    const occupancy = cageAnimals.length;
    const isOverCapacity = capacity && occupancy > capacity;

    return (
      <Card 
        sx={{ 
          height: 300, 
          position: 'relative',
          border: isOverCapacity ? '2px solid' : '1px solid',
          borderColor: isOverCapacity ? 'error.main' : 'divider',
        }}
      >
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Cage Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Badge 
              badgeContent={occupancy} 
              color={isOverCapacity ? 'error' : 'primary'}
              max={99}
            >
              <CageIcon />
            </Badge>
            <Box sx={{ ml: 1, flexGrow: 1 }}>
              <Typography variant="h6" noWrap>
                {cageName}
              </Typography>
              {capacity && (
                <Typography variant="caption" color="text.secondary">
                  {occupancy}/{capacity}
                  {isOverCapacity && ' (Suroccupé!)'}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Animals Grid */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
            gap: 1,
            alignContent: 'start',
            overflowY: 'auto'
          }}>
            {cageAnimals.map(animal => (
              <Paper
                key={animal.id}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => navigate(`/animals/${animal.id}`)}
              >
                <Avatar
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    fontSize: '0.75rem',
                    bgcolor: getStatusColor(animal.status) === 'success' ? 'success.main' :
                             getStatusColor(animal.status) === 'info' ? 'info.main' :
                             getStatusColor(animal.status) === 'warning' ? 'warning.main' : 'grey.500'
                  }}
                >
                  {getSexIcon(animal.sex)}
                </Avatar>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 0.5,
                    fontSize: '0.65rem',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                  title={animal.name || animal.identifier}
                >
                  {animal.name || animal.identifier || 'Sans nom'}
                </Typography>
              </Paper>
            ))}
            
            {/* Empty slots visualization */}
            {capacity && Array.from({ length: Math.max(0, capacity - occupancy) }).map((_, index) => (
              <Paper
                key={`empty-${index}`}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  minHeight: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.disabledBackground',
                  opacity: 0.3,
                }}
              >
                <Typography variant="caption" color="text.disabled">
                  Libre
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Cage Actions */}
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={() => navigate(`/cages/${cageId}/edit`)}
              disabled={cageId === 'uncaged'}
            >
              Modifier
            </Button>
            <Button
              size="small"
              onClick={() => navigate('/animals/new', { 
                state: { defaultCage: cageId === 'uncaged' ? undefined : cageId }
              })}
            >
              + Animal
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Visualisation des Cages
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/cages/new')}
        >
          Nouvelle Cage
        </Button>
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{cages.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Cages totales
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                {Object.values(animalsByCage).reduce((sum, animals) => sum + animals.length, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Animaux actifs
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                {cages.filter(cage => animalsByCage[cage.id]?.length > 0).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cages occupées
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{animalsByCage['uncaged']?.length || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                Animaux sans cage
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Cages Grid */}
      <Grid container spacing={3}>
        {/* Registered Cages */}
        {cages.map(cage => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={cage.id}>
            <CageCard
              cageId={cage.id}
              cageName={cage.name}
              capacity={cage.capacity}
            />
          </Grid>
        ))}

        {/* Uncaged Animals */}
        {animalsByCage['uncaged']?.length > 0 && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CageCard
              cageId="uncaged"
              cageName="Sans cage"
            />
          </Grid>
        )}

        {/* Empty State */}
        {cages.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune cage configurée
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Créez des cages pour organiser vos animaux
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/cages/new')}
              >
                Créer ma première cage
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Legend */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Légende
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            avatar={<Avatar sx={{ bgcolor: 'success.main' }}>♀</Avatar>}
            label="Reproductrice"
            size="small"
          />
          <Chip
            avatar={<Avatar sx={{ bgcolor: 'success.main' }}>♂</Avatar>}
            label="Reproducteur"
            size="small"
          />
          <Chip
            avatar={<Avatar sx={{ bgcolor: 'info.main' }}>♀</Avatar>}
            label="En croissance"
            size="small"
          />
          <Chip
            avatar={<Avatar sx={{ bgcolor: 'warning.main' }}>?</Avatar>}
            label="Retraité"
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CageVisualizationPage;