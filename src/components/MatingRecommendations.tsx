import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Female as FemaleIcon,
  Male as MaleIcon,
  Favorite as HeartIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { Animal, Sex, Status } from '../models/types';
import { useAppStore } from '../state/store';
import { GenealogyService, MatingRecommendationOptions } from '../services/genealogy.service';
import { useNavigate } from 'react-router-dom';

interface MatingRecommendationsProps {
  animal: Animal;
  allAnimals: Animal[];
  onCreateBreeding?: (femaleId: string, maleId: string) => void;
}

interface RecommendationFilters {
  minAge?: number;
  maxAge?: number;
  preferredBreeds: string[];
  excludeRetired: boolean;
  showOnlyExcellent: boolean;
}

export const MatingRecommendations: React.FC<MatingRecommendationsProps> = ({
  animal,
  allAnimals,
  onCreateBreeding,
}) => {
  const navigate = useNavigate();
  const allCages = useAppStore((state) => state.cages) || [];
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filters, setFilters] = useState<RecommendationFilters>({
    preferredBreeds: [],
    excludeRetired: true,
    showOnlyExcellent: false,
  });
  
  const [geneticOptions, setGeneticOptions] = useState<MatingRecommendationOptions>({
    maxInbreedingCoefficient: 0.0625, // 6.25%
    minGenerationsFromCommonAncestor: 3,
    preferredBreeds: [],
  });

  // Get available breeds
  const availableBreeds = useMemo(() => 
    Array.from(new Set(allAnimals.map(a => a.breed).filter(Boolean))),
    [allAnimals]
  );

  // Filter animals based on filters
  const filteredAnimals = useMemo(() => {
    let filtered = allAnimals;

    if (filters.excludeRetired) {
      filtered = filtered.filter(a => a.status !== Status.Retired && a.status !== Status.Deceased && a.status !== Status.Consumed);
    }

    if (filters.preferredBreeds.length > 0) {
      filtered = filtered.filter(a => filters.preferredBreeds.includes(a.breed || ''));
    }

    if (filters.minAge !== undefined || filters.maxAge !== undefined) {
      filtered = filtered.filter(a => {
        if (!a.birthDate) return true;
        const ageInDays = Math.floor((Date.now() - new Date(a.birthDate).getTime()) / (1000 * 60 * 60 * 24));
        const ageInMonths = ageInDays / 30;
        
        if (filters.minAge !== undefined && ageInMonths < filters.minAge) return false;
        if (filters.maxAge !== undefined && ageInMonths > filters.maxAge) return false;
        return true;
      });
    }

    return filtered;
  }, [allAnimals, filters]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs = GenealogyService.generateMatingRecommendations(
      animal, 
      filteredAnimals, 
      { ...geneticOptions, preferredBreeds: filters.preferredBreeds }
    );

    if (filters.showOnlyExcellent) {
      return recs.filter(r => r.recommendation === 'excellent');
    }

    return recs;
  }, [animal, filteredAnimals, geneticOptions, filters]);

  // Get recommendation color and icon
  const getRecommendationDisplay = (recommendation: string) => {
    switch (recommendation) {
      case 'excellent':
        return { color: 'success', icon: <CheckIcon />, text: 'Excellent' };
      case 'good':
        return { color: 'info', icon: <HeartIcon />, text: 'Bon' };
      case 'acceptable':
        return { color: 'warning', icon: <InfoIcon />, text: 'Acceptable' };
      case 'not_recommended':
        return { color: 'error', icon: <WarningIcon />, text: 'Non recommandé' };
      default:
        return { color: 'default', icon: <InfoIcon />, text: 'Inconnu' };
    }
  };

  // Calculate age in months
  const getAgeInMonths = (birthDate?: string) => {
    if (!birthDate) return null;
    const ageInDays = Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor(ageInDays / 30);
  };

  // Render recommendation card
  const renderRecommendationCard = (rec: any, index: number) => {
    const { partner } = rec;
    const display = getRecommendationDisplay(rec.recommendation);
    const partnerAge = getAgeInMonths(partner.birthDate);

    return (
      <Card 
        key={partner.id} 
        sx={{ 
          mb: 2, 
          border: index < 3 ? 2 : 1,
          borderColor: index < 3 ? `${display.color}.main` : 'divider',
          position: 'relative',
        }}
      >
        {index < 3 && (
          <Chip
            label={`Top ${index + 1}`}
            color={display.color as any}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          />
        )}

        <CardContent>
          <Box display="flex" gap={2}>
            {/* Partner info */}
            <Box display="flex" alignItems="center" gap={2} flex={1}>
              <Avatar
                sx={{
                  bgcolor: partner.sex === Sex.Female ? 'pink' : 'lightblue',
                  width: 48,
                  height: 48,
                }}
                onClick={() => navigate(`/animals/${partner.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {partner.sex === Sex.Female ? <FemaleIcon /> : <MaleIcon />}
              </Avatar>

              <Box flex={1}>
                <Typography variant="h6" component="div">
                  {partner.name || 'Sans nom'}
                  <Chip
                    label={display.text}
                    color={display.color as any}
                    size="small"
                    icon={display.icon}
                    sx={{ ml: 1 }}
                  />
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {partner.identifier || partner.id.slice(0, 8)}
                  {partner.breed && ` • ${partner.breed}`}
                  {partnerAge && ` • ${partnerAge} mois`}
                </Typography>

                <Box mt={1}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={partner.status} size="small" variant="outlined" />
                    {partner.cage && (
                      <Chip
                        label={`cage : ${allCages.find(c => c.id === partner.cage)?.name || 'Cage inconnue'}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>

            {/* Genetic metrics */}
            <Box minWidth={200}>
              <Typography variant="subtitle2" gutterBottom>
                Métriques génétiques
              </Typography>
              
              <Box mb={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption">Consanguinité prévue</Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {(rec.inbreedingCoefficient * 100).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(rec.inbreedingCoefficient * 100 / 0.125, 100)} // Max 12.5%
                  color={rec.inbreedingCoefficient > 0.0625 ? 'error' : rec.inbreedingCoefficient > 0.03125 ? 'warning' : 'success'}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Box>

              <Box mb={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption">Parenté</Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {(rec.relationshipCoefficient * 100).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(rec.relationshipCoefficient * 100 / 0.25, 100)} // Max 25%
                  color={rec.relationshipCoefficient > 0.125 ? 'warning' : 'success'}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption">Diversité génétique</Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {Math.round(rec.geneticDiversityScore * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={rec.geneticDiversityScore * 100}
                  color={rec.geneticDiversityScore > 0.8 ? 'success' : rec.geneticDiversityScore > 0.6 ? 'info' : 'warning'}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Box>
            </Box>
          </Box>

          {/* Reasons */}
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Analyse détaillée:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {rec.reasons.map((reason: string, idx: number) => (
                <Chip
                  key={idx}
                  label={reason}
                  size="small"
                  variant="outlined"
                  color={reason.includes('risque') || reason.includes('Limited') ? 'warning' : 'default'}
                />
              ))}
            </Stack>
          </Box>

          {/* Actions */}
          <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/animals/${partner.id}`)}
            >
              Voir détails
            </Button>
            {onCreateBreeding && (
              <Button
                variant="contained"
                size="small"
                color={display.color as any}
                disabled={rec.recommendation === 'not_recommended'}
                onClick={() => {
                  const femaleId = animal.sex === Sex.Female ? animal.id : partner.id;
                  const maleId = animal.sex === Sex.Male ? animal.id : partner.id;
                  onCreateBreeding(femaleId, maleId);
                }}
              >
                Planifier accouplement
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <ScienceIcon />
            Recommandations d'accouplement pour {animal.name || 'Animal sans nom'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setSettingsOpen(true)}
          >
            Paramètres
          </Button>
        </Box>

        {/* Summary */}
        <Box mt={2}>
          <Alert severity="info" icon={<InfoIcon />}>
            {recommendations.length} partenaires potentiels analysés. 
            {recommendations.filter(r => r.recommendation === 'excellent').length} recommandations excellentes,{' '}
            {recommendations.filter(r => r.recommendation === 'good').length} bonnes,{' '}
            {recommendations.filter(r => r.recommendation === 'acceptable').length} acceptables.
          </Alert>
        </Box>
      </Paper>

      {/* Recommendations list */}
      <Box>
        {recommendations.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune recommandation disponible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aucun partenaire compatible trouvé avec les critères actuels.
              Essayez d'ajuster les paramètres de filtrage.
            </Typography>
          </Paper>
        ) : (
          recommendations.map((rec, index) => renderRecommendationCard(rec, index))
        )}
      </Box>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Paramètres d'analyse génétique</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* Genetic parameters */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Paramètres génétiques</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <TextField
                    label="Coefficient de consanguinité maximum (%)"
                    type="number"
                    value={(geneticOptions.maxInbreedingCoefficient || 0.0625) * 100}
                    onChange={(e) => setGeneticOptions(prev => ({
                      ...prev,
                      maxInbreedingCoefficient: parseFloat(e.target.value) / 100
                    }))}
                    inputProps={{ min: 0, max: 25, step: 0.1 }}
                    helperText="Seuil maximum acceptable de consanguinité (recommandé: 6.25%)"
                  />

                  <TextField
                    label="Générations minimales depuis ancêtre commun"
                    type="number"
                    value={geneticOptions.minGenerationsFromCommonAncestor || 3}
                    onChange={(e) => setGeneticOptions(prev => ({
                      ...prev,
                      minGenerationsFromCommonAncestor: parseInt(e.target.value)
                    }))}
                    inputProps={{ min: 1, max: 10 }}
                    helperText="Distance minimale requise depuis un ancêtre commun"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Filter parameters */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Filtres de sélection</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Âge minimum (mois)"
                      type="number"
                      value={filters.minAge || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        minAge: e.target.value ? parseInt(e.target.value) : undefined
                      }))}
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      label="Âge maximum (mois)"
                      type="number"
                      value={filters.maxAge || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        maxAge: e.target.value ? parseInt(e.target.value) : undefined
                      }))}
                      inputProps={{ min: 0 }}
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Races préférées</InputLabel>
                    <Select
                      multiple
                      value={filters.preferredBreeds}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        preferredBreeds: e.target.value as string[]
                      }))}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {availableBreeds.map((breed) => (
                        <MenuItem key={breed} value={breed}>
                          {breed}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};