import { Box, Typography } from '@mui/material';
import { Pets as PetsIcon } from '@mui/icons-material';

interface EmptyStateProps {
  hasAnimals: boolean;
}

export const EmptyState = ({ hasAnimals }: EmptyStateProps) => {
  return (
    <Box textAlign="center" py={4}>
      <PetsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Aucun animal trouvé
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {!hasAnimals 
          ? 'Commencez par ajouter votre premier animal'
          : 'Essayez de modifier vos filtres de recherche'
        }
      </Typography>
    </Box>
  );
};