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
  Container,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as CageIcon,
  Pets as AnimalIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Settings as SettingsIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../state/store';
import { Status, Sex } from '../../models/types';
import { useTranslation } from '../../hooks/useTranslation';

const CageVisualizationPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const { cages, animals, tags } = useAppStore();
  const updateAnimal = useAppStore((state) => state.updateAnimal);
  
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null);
  const [dragOverCage, setDragOverCage] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
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
        // Check if the animal's cage exists, if not treat as uncaged
        const cageExists = animal.cage && cages.find(c => c.id === animal.cage);
        const cageId: string = cageExists ? animal.cage! : 'uncaged';
        
        if (!grouped[cageId]) {
          grouped[cageId] = [];
        }
        grouped[cageId].push(animal);
      });

    return grouped;
  }, [cages, animals]);

  // Statistics
  const stats = useMemo(() => {
    const totalCages = cages.length;
    const liveAnimals = animals.filter(a => a.status !== Status.Deceased && a.status !== Status.Consumed);
    const totalAnimals = liveAnimals.length;
    const occupiedCages = cages.filter(cage => animalsByCage[cage.id]?.length > 0).length;
    const uncagedAnimals = animalsByCage['uncaged']?.length || 0;
    
    return {
      totalCages,
      totalAnimals,
      occupiedCages,
      uncagedAnimals,
    };
  }, [cages, animals, animalsByCage]);

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

  // Drag and drop handlers with mobile support
  const handleDragStart = (e: React.DragEvent, animalId: string) => {
    setDraggedAnimal(animalId);
    e.dataTransfer.setData('text/plain', animalId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e: React.DragEvent, cageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCage(cageId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're actually leaving the cage area
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetCageId: string) => {
    e.preventDefault();
    setDragOverCage(null);
    
    const animalId = e.dataTransfer.getData('text/plain');
    
    if (animalId && animalId !== draggedAnimal) return; // Safety check
    
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    // Don't allow moving to the same cage
    if (animal.cage === targetCageId || (animal.cage === undefined && targetCageId === 'uncaged')) {
      setDraggedAnimal(null);
      return;
    }

    // Check if target cage exists and capacity
    if (targetCageId !== 'uncaged') {
      const targetCage = cages.find(c => c.id === targetCageId);
      
      // Validate cage exists
      if (!targetCage) {
        setNotification({
          open: true,
          message: `La cage ${targetCageId} n'existe pas`,
          severity: 'error',
        });
        setDraggedAnimal(null);
        return;
      }
      
      const currentOccupancy = animalsByCage[targetCageId]?.length || 0;
      
      if (targetCage.capacity && currentOccupancy >= targetCage.capacity) {
        setNotification({
          open: true,
          message: `${t('cages.title')} ${targetCage.name} est pleine`,
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

    const targetCageName = targetCageId === 'uncaged' ? t('common.none') : cages.find(c => c.id === targetCageId)?.name || targetCageId;
    setNotification({
      open: true,
      message: `${animal.name || animal.identifier || 'Animal'} déplacé vers ${targetCageName}`,
      severity: 'success',
    });

    setDraggedAnimal(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedAnimal(null);
    setDragOverCage(null);
    
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  // Mobile touch handlers for drag and drop
  const handleTouchStart = (animalId: string) => {
    if (isMobile) {
      setSelectedAnimal(selectedAnimal === animalId ? null : animalId);
    }
  };

  const handleCageClick = (cageId: string) => {
    if (isMobile && selectedAnimal) {
      const animal = animals.find(a => a.id === selectedAnimal);
      if (!animal) return;

      // Don't allow moving to the same cage
      if (animal.cage === cageId || (animal.cage === undefined && cageId === 'uncaged')) {
        setSelectedAnimal(null);
        return;
      }

      // Check if target cage exists and capacity
      if (cageId !== 'uncaged') {
        const targetCage = cages.find(c => c.id === cageId);
        
        // Validate cage exists
        if (!targetCage) {
          setNotification({
            open: true,
            message: `La cage ${cageId} n'existe pas`,
            severity: 'error',
          });
          setSelectedAnimal(null);
          return;
        }
        
        const currentOccupancy = animalsByCage[cageId]?.length || 0;
        
        if (targetCage.capacity && currentOccupancy >= targetCage.capacity) {
          setNotification({
            open: true,
            message: `${t('cages.title')} ${targetCage.name} est pleine`,
            severity: 'error',
          });
          setSelectedAnimal(null);
          return;
        }
      }

      // Update the animal's cage
      updateAnimal(selectedAnimal, { 
        cage: cageId === 'uncaged' ? undefined : cageId 
      });

      const targetCageName = cageId === 'uncaged' ? t('common.none') : cages.find(c => c.id === cageId)?.name || cageId;
      setNotification({
        open: true,
        message: `${animal.name || animal.identifier || 'Animal'} déplacé vers ${targetCageName}`,
        severity: 'success',
      });

      setSelectedAnimal(null);
    }
  };

  // Enhanced animal component with better mobile support
  const AnimalChip: React.FC<{ animal: any; isInCage: boolean }> = ({ animal, isInCage }) => {
    const animalTags = animal.tags?.map((tagId: string) => tags.find(t => t.id === tagId)).filter(Boolean) || [];
    const isSelected = selectedAnimal === animal.id;
    const isDragging = draggedAnimal === animal.id;
    
    return (
      <Tooltip 
        title={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {animal.name || animal.identifier || 'Animal'}
            </Typography>
            <Typography variant="caption" display="block">
              {t(`status.${animal.status}`)} • {t(`sex.${animal.sex}`)}
            </Typography>
            {animal.breed && (
              <Typography variant="caption" display="block">
                {t('animals.breed')}: {animal.breed}
              </Typography>
            )}
            {animalTags.length > 0 && (
              <Typography variant="caption" display="block">
                {t('animals.tags')}: {animalTags.map((tag: any) => tag.name).join(', ')}
              </Typography>
            )}
            {isMobile && isInCage && (
              <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                Touchez pour sélectionner, puis touchez une cage pour déplacer
              </Typography>
            )}
          </Box>
        }
        placement="top"
      >
        <Paper
          draggable={!isMobile}
          onDragStart={(e) => handleDragStart(e, animal.id)}
          onDragEnd={handleDragEnd}
          onClick={() => handleTouchStart(animal.id)}
          sx={{
            p: 1,
            m: 0.5,
            minHeight: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isMobile ? 'pointer' : 'grab',
            opacity: isDragging ? 0.5 : 1,
            border: isSelected ? 2 : 1,
            borderColor: isSelected ? 'primary.main' : 'divider',
            borderStyle: isSelected ? 'solid' : 'solid',
            backgroundColor: isSelected ? 'primary.light' : 'background.paper',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: isSelected ? 'primary.light' : 'action.hover',
              transform: 'scale(1.05)',
            },
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: '0.75rem',
              backgroundColor: getSexColor(animal.sex),
              color: 'white',
              mb: 0.5,
            }}
          >
            {getSexIcon(animal.sex)}
          </Avatar>
          
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6rem',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {animal.name || animal.identifier || 'Animal'}
          </Typography>
          
          {/* Show drag indicator on mobile */}
          {isMobile && (
            <DragIcon sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }} />
          )}
          
          {/* Show first tag if available */}
          {animalTags.length > 0 && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: animalTags[0].color || '#e0e0e0',
                mt: 0.5,
              }}
            />
          )}
        </Paper>
      </Tooltip>
    );
  };

  const CageCard: React.FC<{ cageId: string; cageName: string; capacity?: number; description?: string; location?: string }> = ({ 
    cageId, 
    cageName, 
    capacity,
    description,
    location 
  }) => {
    const cageAnimals = animalsByCage[cageId] || [];
    const occupancy = cageAnimals.length;
    const isOverCapacity = capacity && occupancy > capacity;
    const isEmpty = occupancy === 0;
    const isHighlighted = dragOverCage === cageId;
    const cage = cages.find(c => c.id === cageId);

    return (
      <Card 
        sx={{ 
          height: isMobile ? 280 : 350, 
          position: 'relative',
          border: 2,
          borderColor: isHighlighted 
            ? 'primary.main' 
            : isOverCapacity 
              ? 'error.main' 
              : isEmpty 
                ? 'divider' 
                : 'success.main',
          backgroundColor: isHighlighted 
            ? 'primary.50' 
            : isEmpty 
              ? 'grey.50' 
              : 'background.paper',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
        }}
        onDragOver={(e) => handleDragOver(e, cageId)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, cageId)}
        onClick={() => handleCageClick(cageId)}
      >
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Cage Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Badge 
              badgeContent={occupancy} 
              color={isOverCapacity ? 'error' : isEmpty ? 'default' : 'primary'}
              max={99}
            >
              <CageIcon sx={{ fontSize: 28, color: isEmpty ? 'text.secondary' : 'primary.main' }} />
            </Badge>
            <Box sx={{ ml: 2, flexGrow: 1 }}>
              <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
                {cageName}
              </Typography>
              {capacity && (
                <Typography variant="body2" color="text.secondary">
                  {occupancy}/{capacity}
                  {isOverCapacity && (
                    <Chip 
                      label="Suroccupé!" 
                      color="error" 
                      size="small" 
                      sx={{ ml: 1, fontSize: '0.6rem', height: 16 }} 
                    />
                  )}
                </Typography>
              )}
              {location && (
                <Typography variant="caption" color="text.secondary" display="block">
                  📍 {location}
                </Typography>
              )}
            </Box>
            
            {/* Action buttons */}
            <Box>
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/cages/${cageId}/edit`);
                }}
                sx={{ p: 0.5 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Animals Area */}
          <Box sx={{ 
            flexGrow: 1, 
            border: '1px dashed',
            borderColor: isHighlighted ? 'primary.main' : 'divider',
            borderRadius: 1,
            p: 1,
            backgroundColor: isHighlighted ? 'primary.50' : 'background.default',
            minHeight: 120,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {isEmpty ? (
              <Box 
                sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'text.secondary',
                  textAlign: 'center',
                }}
              >
                <Box>
                  <AnimalIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                  <Typography variant="body2">
                    {isMobile && selectedAnimal 
                      ? 'Touchez pour déplacer ici' 
                      : 'Cage vide'
                    }
                  </Typography>
                  {draggedAnimal && (
                    <Typography variant="caption" color="primary">
                      Déposez l'animal ici
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                gap: 0.5,
                alignContent: 'start',
              }}>
                {cageAnimals.map(animal => (
                  <AnimalChip 
                    key={animal.id} 
                    animal={animal} 
                    isInCage={true}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Cage footer actions */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              size="small" 
              startIcon={<AddIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/animals/new?cage=${cageId}`);
              }}
              disabled={!!isOverCapacity}
            >
              Animal
            </Button>
            
            {description && (
              <Tooltip title={description}>
                <Typography variant="caption" sx={{ 
                  maxWidth: 100, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  ℹ️ {description}
                </Typography>
              </Tooltip>
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
          🏠 {t('cages.title')} - Visualisation
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ViewIcon />}
            onClick={() => navigate('/cages')}
            size={isMobile ? 'small' : 'medium'}
          >
            Liste
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/cages/new')}
            size={isMobile ? 'small' : 'medium'}
          >
            {t('cages.addCage')}
          </Button>
        </Box>
      </Box>

      {/* Mobile instruction */}
      {isMobile && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            💡 Touchez un animal pour le sélectionner, puis touchez une cage pour le déplacer
          </Typography>
        </Alert>
      )}

      {/* Statistics Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ 
              p: 2, 
              textAlign: 'center',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalCages}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Cages totales
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ 
              p: 2, 
              textAlign: 'center',
              backgroundColor: 'secondary.main',
              color: 'secondary.contrastText',
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalAnimals}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Animaux actifs
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ 
              p: 2, 
              textAlign: 'center',
              backgroundColor: 'info.main',
              color: 'info.contrastText',
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.occupiedCages}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Cages occupées
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ 
              p: 2, 
              textAlign: 'center',
              backgroundColor: stats.uncagedAnimals > 0 ? 'warning.main' : 'success.main',
              color: stats.uncagedAnimals > 0 ? 'warning.contrastText' : 'success.contrastText',
              borderRadius: 2,
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.uncagedAnimals}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Sans cage
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Selected animal indicator */}
      {selectedAnimal && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => setSelectedAnimal(null)}
            >
              Annuler
            </Button>
          }
        >
          Animal sélectionné: {animals.find(a => a.id === selectedAnimal)?.name || 'Animal'} - 
          Touchez une cage pour le déplacer
        </Alert>
      )}

      {/* Cages Grid */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Registered Cages */}
        {cages.map(cage => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={cage.id}>
            <CageCard
              cageId={cage.id}
              cageName={cage.name}
              capacity={cage.capacity}
              description={cage.description}
              location={cage.location}
            />
          </Grid>
        ))}

        {/* Uncaged Animals */}
        {stats.uncagedAnimals > 0 && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <CageCard
              cageId="uncaged"
              cageName="🏃 Sans cage"
              description="Animaux non assignés à une cage"
            />
          </Grid>
        )}

        {/* Empty State */}
        {cages.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: 'grey.50',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'divider',
            }}>
              <CageIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                Aucune cage configurée
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                Créez des cages pour organiser vos animaux et faciliter la gestion de votre élevage
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/cages/new')}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 3,
                }}
              >
                Créer ma première cage
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Enhanced Legend */}
      {cages.length > 0 && (
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            🎯 Guide d'utilisation
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              avatar={<Avatar sx={{ bgcolor: getSexColor(Sex.Female), color: 'white' }}>♀</Avatar>}
              label={t('sex.F')}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
            />
            <Chip
              avatar={<Avatar sx={{ bgcolor: getSexColor(Sex.Male), color: 'white' }}>♂</Avatar>}
              label={t('sex.M')}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
            />
            <Chip
              avatar={<Avatar sx={{ bgcolor: getSexColor(Sex.Unknown), color: 'white' }}>?</Avatar>}
              label={t('sex.U')}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🖱️ <strong>Desktop:</strong> Glissez-déposez les animaux entre les cages
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📱 <strong>Mobile:</strong> Touchez un animal puis touchez une cage de destination
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🔴 <strong>Couleurs:</strong> Rouge = Suroccupé, Vert = Occupé, Gris = Vide
            </Typography>
          </Box>
        </Box>
      )}

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add cage"
          sx={{ 
            position: 'fixed', 
            bottom: 80, 
            right: 16,
            zIndex: 1000,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          }}
          onClick={() => navigate('/cages/new')}
        >
          <AddIcon />
        </Fab>
      )}

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
    </Container>
  );
};

export default CageVisualizationPage;