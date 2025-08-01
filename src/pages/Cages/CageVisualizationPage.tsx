import React, { useMemo, useState } from 'react';
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
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Home as CageIcon,
  Pets as AnimalIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../state/store';
import { Status, Sex } from '../../models/types';
import { useTranslation } from '../../hooks/useTranslation';

const CageVisualizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cages, animals } = useAppStore();
  const updateAnimal = useAppStore((state) => state.updateAnimal);
  
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

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

  const getSexColor = (sex: Sex) => {
    switch (sex) {
      case Sex.Male:
        return '#1976d2'; // Blue for males
      case Sex.Female:
        return '#d32f2f'; // Red for females
      default:
        return '#9e9e9e'; // Grey for unknown
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, animalId: string) => {
    setDraggedAnimal(animalId);
    e.dataTransfer.setData('text/plain', animalId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCageId: string) => {
    e.preventDefault();
    const animalId = e.dataTransfer.getData('text/plain');
    
    if (animalId && animalId !== draggedAnimal) return; // Safety check
    
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    // Don't allow moving to the same cage
    if (animal.cage === targetCageId || (animal.cage === undefined && targetCageId === 'uncaged')) {
      setDraggedAnimal(null);
      return;
    }

    // Check capacity for target cage
    if (targetCageId !== 'uncaged') {
      const targetCage = cages.find(c => c.id === targetCageId);
      const currentOccupancy = animalsByCage[targetCageId]?.length || 0;
      
      if (targetCage?.capacity && currentOccupancy >= targetCage.capacity) {
        setNotification({
          open: true,
          message: t('cages.cageDetails') + ' ' + (targetCage.name || targetCageId) + ' est pleine',
          severity: 'error',
        });
        setDraggedAnimal(null);
        return;
      }
    }

    // Update the animal's cage
    updateAnimal(animalId, { 
      cage: targetCageId === 'uncaged' ? undefined : targetCageId 
    });

    const targetCageName = targetCageId === 'uncaged' ? 'Aucune cage' : cages.find(c => c.id === targetCageId)?.name || targetCageId;
    setNotification({
      open: true,
      message: `${animal.name || animal.identifier || 'Animal'} déplacé vers ${targetCageName}`,
      severity: 'success',
    });

    setDraggedAnimal(null);
  };

  const handleDragEnd = () => {
    setDraggedAnimal(null);
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
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, cageId)}
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
                draggable
                onDragStart={(e) => handleDragStart(e, animal.id)}
                onDragEnd={handleDragEnd}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  cursor: 'grab',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&:active': {
                    cursor: 'grabbing',
                  },
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: draggedAnimal === animal.id ? 0.5 : 1,
                }}
                onClick={() => navigate(`/animals/${animal.id}`)}
              >
                <Avatar
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    fontSize: '0.75rem',
                    bgcolor: getSexColor(animal.sex),
                    color: 'white',
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
            avatar={<Avatar sx={{ bgcolor: getSexColor(Sex.Female), color: 'white' }}>♀</Avatar>}
            label="Femelle"
            size="small"
          />
          <Chip
            avatar={<Avatar sx={{ bgcolor: getSexColor(Sex.Male), color: 'white' }}>♂</Avatar>}
            label="Mâle"
            size="small"
          />
          <Chip
            avatar={<Avatar sx={{ bgcolor: getSexColor(Sex.Unknown), color: 'white' }}>?</Avatar>}
            label="Sexe inconnu"
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Glissez-déposez les animaux entre les cages pour les déplacer
        </Typography>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CageVisualizationPage;