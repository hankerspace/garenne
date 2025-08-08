import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Female as FemaleIcon,
  Male as MaleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAppStore } from '../state/store';
import { getAnimalActiveTreatments } from '../state/selectors';
import { Animal, Sex, Status, Cage, Tag } from '../models/types';
import { calculateAgeText } from '../utils/dates';
import { useTranslation } from '../hooks/useTranslation';
import { AccessibleButton } from './AccessibleButton';
import { AccessibleCard } from './AccessibleCard';
import { EnhancedTooltip } from './TooltipProvider';

interface AnimalCardProps {
  animal: Animal;
  index: number;
  cages: Cage[];
  tags: Tag[];
  onMarkConsumed: (animalId: string) => void;
}

export const AnimalCard = ({ animal, index, cages, tags, onMarkConsumed }: AnimalCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const state = useAppStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    return t(`status.${status}`);
  };

  const hasActiveWithdrawal = (animalId: string) => {
    const treatments = getAnimalActiveTreatments(state, animalId);
    return treatments.length > 0;
  };

  return (
    <AccessibleCard
      index={index}
      ariaLabel={`${animal.name || 'Animal'} ${animal.identifier || ''}, ${animal.sex === Sex.Female ? 'Femelle' : 'Mâle'}, ${getStatusLabel(animal.status)}`}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ mr: 2, bgcolor: animal.sex === Sex.Female ? 'pink' : 'lightblue' }}>
            {animal.sex === Sex.Female ? <FemaleIcon /> : <MaleIcon />}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              {animal.name || `Animal ${animal.identifier}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {animal.identifier}
            </Typography>
          </Box>
          {hasActiveWithdrawal(animal.id) && (
            <WarningIcon 
              color="warning" 
              titleAccess="Période de retrait active" 
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Chip
            label={getStatusLabel(animal.status)}
            size="small"
            color={getStatusColor(animal.status) as any}
          />
          <Typography variant="body2" color="text.secondary">
            {animal.sex === Sex.Female ? 'Femelle' : 'Mâle'}
          </Typography>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
          {animal.tags?.map((tagId) => {
            const tag = tags.find(t => t.id === tagId);
            return tag ? (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  mb: 1,
                  backgroundColor: tag.color || '#e0e0e0',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              />
            ) : null;
          })}
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>{t('animals.breed')}:</strong> {animal.breed || t('common.none')}
        </Typography>
        
        {animal.birthDate && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Âge:</strong> {calculateAgeText(animal.birthDate)}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>{t('animals.cage')}:</strong> {
            animal.cage 
              ? (cages.find(c => c.id === animal.cage)?.name || 'aucun')
              : 'aucun'
          }
        </Typography>

        {animal.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {animal.notes}
          </Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ 
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: { xs: 0.5, sm: 1 },
        // Better spacing on mobile
        padding: { xs: '8px', sm: '16px' },
      }}>
        <EnhancedTooltip 
          title="Voir les détails de l'animal"
          shortcut="Enter"
        >
          <AccessibleButton 
            size={isMobile ? "medium" : "small"}
            onClick={() => navigate(`/animals/${animal.id}`)}
            ariaLabel={`Voir les détails de ${animal.name || animal.identifier}`}
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
            }}
          >
            Détails
          </AccessibleButton>
        </EnhancedTooltip>
        
        <EnhancedTooltip 
          title="Ajouter une pesée"
          shortcut="W"
        >
          <AccessibleButton 
            size={isMobile ? "medium" : "small"}
            color="secondary"
            onClick={() => navigate(`/animals/${animal.id}?tab=weights`)}
            ariaLabel={`Peser ${animal.name || animal.identifier}`}
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
            }}
          >
            Peser
          </AccessibleButton>
        </EnhancedTooltip>
        
        <EnhancedTooltip 
          title="Modifier l'animal"
          shortcut="E"
        >
          <AccessibleButton 
            size={isMobile ? "medium" : "small"}
            color="primary"
            onClick={() => navigate(`/animals/${animal.id}/edit`)}
            ariaLabel={`Modifier ${animal.name || animal.identifier}`}
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
            }}
          >
            {t('common.edit')}
          </AccessibleButton>
        </EnhancedTooltip>
        
        {animal.status === Status.Grow && (
          <EnhancedTooltip 
            title="Marquer comme consommé (action irréversible)"
            shortcut="Delete"
          >
            <AccessibleButton 
              size={isMobile ? "medium" : "small"}
              color="error"
              onClick={() => onMarkConsumed(animal.id)}
              ariaLabel={`Marquer ${animal.name || animal.identifier} comme consommé`}
              tooltip="Cette action est irréversible"
              isDestructive
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                flex: { xs: '1 1 100%', sm: '0 0 auto' },
              }}
            >
              {t('animals.markConsumed')}
            </AccessibleButton>
          </EnhancedTooltip>
        )}
      </CardActions>
    </AccessibleCard>
  );
};