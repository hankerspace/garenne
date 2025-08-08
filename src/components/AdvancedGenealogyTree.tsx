import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  Divider,
  Slider,
  FormControlLabel,
  Switch,
  Alert,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  Female as FemaleIcon,
  Male as MaleIcon,
  AccountTree as TreeIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Animal, Sex, Status } from '../models/types';
import { GenealogyService, PedigreeNode } from '../services/genealogy.service';
import { useNavigate } from 'react-router-dom';

interface AdvancedGenealogyTreeProps {
  currentAnimal: Animal;
  allAnimals: Animal[];
  onExportPedigree?: (animal: Animal) => void;
}

interface VisualizationSettings {
  maxGenerations: number;
  showInbreedingCoefficients: boolean;
  showRelationshipLines: boolean;
  compactView: boolean;
  zoom: number;
}

export const AdvancedGenealogyTree: React.FC<AdvancedGenealogyTreeProps> = ({
  currentAnimal,
  allAnimals,
  onExportPedigree,
}) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<VisualizationSettings>({
    maxGenerations: 4,
    showInbreedingCoefficients: true,
    showRelationshipLines: true,
    compactView: false,
    zoom: 1,
  });

  // Calculate pedigree data
  const pedigreeData = useMemo(() => 
    GenealogyService.getPedigreeData(currentAnimal, allAnimals, settings.maxGenerations),
    [currentAnimal, allAnimals, settings.maxGenerations]
  );

  // Calculate inbreeding coefficient for current animal
  const animalInbreedingCoefficient = useMemo(() =>
    GenealogyService.calculateInbreedingCoefficient(currentAnimal, allAnimals),
    [currentAnimal, allAnimals]
  );

  // Get status color
  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Reproducer: return 'success';
      case Status.Grow: return 'info';
      case Status.Retired: return 'warning';
      case Status.Deceased: return 'error';
      case Status.Consumed: return 'secondary';
      default: return 'default';
    }
  };

  // Get status label
  const getStatusLabel = (status: Status) => {
    switch (status) {
      case Status.Reproducer: return 'Reproducteur';
      case Status.Grow: return 'Croissance';
      case Status.Retired: return 'Retraité';
      case Status.Deceased: return 'Décédé';
      case Status.Consumed: return 'Consommé';
      default: return status;
    }
  };

  // Get inbreeding risk level
  const getInbreedingRiskLevel = (coefficient: number) => {
    if (coefficient === 0) return { level: 'none', color: 'success', text: 'Aucun risque' };
    if (coefficient < 0.0313) return { level: 'low', color: 'success', text: 'Risque faible' };
    if (coefficient < 0.0625) return { level: 'moderate', color: 'warning', text: 'Risque modéré' };
    if (coefficient < 0.125) return { level: 'high', color: 'error', text: 'Risque élevé' };
    return { level: 'very_high', color: 'error', text: 'Risque très élevé' };
  };

  // Render animal card with advanced information
  const renderAnimalCard = (node: PedigreeNode, isRoot: boolean = false) => {
    const { animal } = node;
    const inbreedingRisk = getInbreedingRiskLevel(node.inbreedingCoefficient);
    
    const cardStyle = {
      minWidth: settings.compactView ? 160 : 200,
      maxWidth: settings.compactView ? 180 : 220,
      m: 0.5,
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: isRoot ? 3 : 1,
      borderColor: isRoot ? 'primary.main' : 'divider',
      backgroundColor: isRoot ? 'primary.light' : 'background.paper',
      transform: `scale(${settings.zoom})`,
      transformOrigin: 'center',
      '&:hover': {
        backgroundColor: isRoot ? 'primary.light' : 'action.hover',
        transform: `scale(${settings.zoom * 1.05})`,
        boxShadow: 3,
      },
    };

    return (
      <Paper key={animal.id} sx={cardStyle} onClick={() => navigate(`/animals/${animal.id}`)}>
        <CardContent sx={{ p: settings.compactView ? 1 : 2, '&:last-child': { pb: settings.compactView ? 1 : 2 } }}>
          {/* Header with avatar and basic info */}
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar
              sx={{
                mr: 1,
                bgcolor: animal.sex === Sex.Female ? 'pink' : 'lightblue',
                width: settings.compactView ? 24 : 32,
                height: settings.compactView ? 24 : 32,
              }}
            >
              {animal.sex === Sex.Female ? 
                <FemaleIcon fontSize={settings.compactView ? 'small' : 'medium'} /> : 
                <MaleIcon fontSize={settings.compactView ? 'small' : 'medium'} />
              }
            </Avatar>
            <Box flex={1}>
              <Typography 
                variant={settings.compactView ? 'caption' : 'subtitle2'} 
                fontWeight="bold"
                noWrap
              >
                {animal.name || 'Sans nom'}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block"
                noWrap
              >
                {animal.identifier || animal.id.slice(0, 8)}
              </Typography>
            </Box>
          </Box>

          {/* Status and breed */}
          <Stack direction="row" spacing={0.5} mb={1} flexWrap="wrap">
            <Chip
              label={getStatusLabel(animal.status)}
              color={getStatusColor(animal.status)}
              size="small"
              sx={{ fontSize: settings.compactView ? '0.6rem' : '0.7rem' }}
            />
            {animal.breed && (
              <Chip
                label={animal.breed}
                variant="outlined"
                size="small"
                sx={{ fontSize: settings.compactView ? '0.6rem' : '0.7rem' }}
              />
            )}
          </Stack>

          {/* Generation indicator */}
          <Typography variant="caption" color="text.secondary">
            Génération: {node.generation}
          </Typography>

          {/* Inbreeding coefficient */}
          {settings.showInbreedingCoefficients && (
            <Box mt={1}>
              <Tooltip title={`Coefficient de consanguinité: ${(node.inbreedingCoefficient * 100).toFixed(2)}%`}>
                <Chip
                  label={`F: ${(node.inbreedingCoefficient * 100).toFixed(1)}%`}
                  color={inbreedingRisk.color as any}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.6rem' }}
                />
              </Tooltip>
            </Box>
          )}

          {/* Birth date if available */}
          {animal.birthDate && (
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              Né(e): {new Date(animal.birthDate).toLocaleDateString()}
            </Typography>
          )}
        </CardContent>
      </Paper>
    );
  };

  // Render pedigree tree recursively
  const renderPedigreeTree = (node: PedigreeNode, isRoot: boolean = false): React.ReactNode => {
    const hasParents = node.mother || node.father;

    return (
      <Box key={node.animal.id} display="flex" flexDirection="column" alignItems="center">
        {/* Current animal */}
        {renderAnimalCard(node, isRoot)}
        
        {/* Connection line to parents */}
        {hasParents && settings.showRelationshipLines && (
          <Box
            sx={{
              width: 2,
              height: 20,
              backgroundColor: 'divider',
              my: 0.5,
            }}
          />
        )}

        {/* Parents */}
        {hasParents && (
          <Box display="flex" gap={2} alignItems="flex-start">
            {/* Mother */}
            {node.mother && (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="caption" color="text.secondary" mb={0.5}>
                  Mère
                </Typography>
                {renderPedigreeTree(node.mother)}
              </Box>
            )}

            {/* Father */}
            {node.father && (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="caption" color="text.secondary" mb={0.5}>
                  Père
                </Typography>
                {renderPedigreeTree(node.father)}
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Header with controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <TreeIcon />
            Arbre généalogique avancé
          </Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Exporter le pedigree en PDF">
              <IconButton onClick={() => onExportPedigree?.(currentAnimal)}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Plein écran">
              <IconButton>
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Inbreeding coefficient alert */}
        {animalInbreedingCoefficient > 0 && (
          <Alert 
            severity={getInbreedingRiskLevel(animalInbreedingCoefficient).color as any}
            sx={{ mb: 2 }}
            icon={<InfoIcon />}
          >
            <Typography variant="body2">
              <strong>Coefficient de consanguinité: {(animalInbreedingCoefficient * 100).toFixed(2)}%</strong>
              <br />
              {getInbreedingRiskLevel(animalInbreedingCoefficient).text}
              {animalInbreedingCoefficient > 0.0625 && 
                ' - Recommandation: éviter les accouplements avec des animaux apparentés.'
              }
            </Typography>
          </Alert>
        )}

        {/* Visualization controls */}
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Générations à afficher: {settings.maxGenerations}
            </Typography>
            <Slider
              value={settings.maxGenerations}
              onChange={(_, value) => setSettings(prev => ({ ...prev, maxGenerations: value as number }))}
              min={2}
              max={6}
              step={1}
              marks
              sx={{ width: 120 }}
            />
          </Box>

          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Zoom: {Math.round(settings.zoom * 100)}%
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="small" 
                onClick={() => setSettings(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.1) }))}
              >
                <ZoomOutIcon />
              </IconButton>
              <Slider
                value={settings.zoom}
                onChange={(_, value) => setSettings(prev => ({ ...prev, zoom: value as number }))}
                min={0.5}
                max={2}
                step={0.1}
                sx={{ width: 80 }}
              />
              <IconButton 
                size="small" 
                onClick={() => setSettings(prev => ({ ...prev, zoom: Math.min(2, prev.zoom + 0.1) }))}
              >
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={settings.showInbreedingCoefficients}
                onChange={(e) => setSettings(prev => ({ ...prev, showInbreedingCoefficients: e.target.checked }))}
              />
            }
            label="Coefficients de consanguinité"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showRelationshipLines}
                onChange={(e) => setSettings(prev => ({ ...prev, showRelationshipLines: e.target.checked }))}
              />
            }
            label="Lignes de parenté"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.compactView}
                onChange={(e) => setSettings(prev => ({ ...prev, compactView: e.target.checked }))}
              />
            }
            label="Vue compacte"
          />
        </Box>
      </Paper>

      {/* Pedigree tree */}
      <Paper sx={{ p: 3, overflow: 'auto', maxHeight: '80vh' }}>
        <Box display="flex" justifyContent="center" minWidth="fit-content">
          {renderPedigreeTree(pedigreeData, true)}
        </Box>
      </Paper>
    </Box>
  );
};