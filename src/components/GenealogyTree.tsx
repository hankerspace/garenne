import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Female as FemaleIcon,
  Male as MaleIcon,
  AccountTree as TreeIcon,
} from '@mui/icons-material';
import { Animal, Sex, Status } from '../models/types';
import { useNavigate } from 'react-router-dom';

interface GenealogyTreeProps {
  currentAnimal: Animal;
  allAnimals: Animal[];
}

interface TreeNode {
  animal: Animal;
  children: TreeNode[];
  level: number;
}

export const GenealogyTree: React.FC<GenealogyTreeProps> = ({
  currentAnimal,
  allAnimals,
}) => {
  const navigate = useNavigate();

  // Helper function to find children of an animal
  const findChildren = (parentId: string): Animal[] => {
    return allAnimals.filter(
      animal => animal.motherId === parentId || animal.fatherId === parentId
    );
  };

  // Helper function to build tree structure for ancestors
  const buildAncestorTree = (animal: Animal, level: number = 0): TreeNode | null => {
    if (level > 3) return null; // Limit depth to avoid infinite recursion
    
    const mother = animal.motherId ? allAnimals.find(a => a.id === animal.motherId) : null;
    const father = animal.fatherId ? allAnimals.find(a => a.id === animal.fatherId) : null;
    
    const children: TreeNode[] = [];
    if (mother) {
      const motherNode = buildAncestorTree(mother, level + 1);
      if (motherNode) children.push(motherNode);
    }
    if (father) {
      const fatherNode = buildAncestorTree(father, level + 1);
      if (fatherNode) children.push(fatherNode);
    }
    
    return {
      animal,
      children,
      level,
    };
  };

  // Helper function to build tree structure for descendants
  const buildDescendantTree = (animal: Animal, level: number = 0): TreeNode => {
    if (level > 3) return { animal, children: [], level }; // Limit depth
    
    const children = findChildren(animal.id).map(child => 
      buildDescendantTree(child, level + 1)
    );
    
    return {
      animal,
      children,
      level,
    };
  };

  // Get status color
  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Reproducer: return 'success';
      case Status.Grow: return 'info';
      case Status.Retired: return 'warning';
      case Status.Deceased: return 'error';
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
      default: return status;
    }
  };

  // Render animal card
  const renderAnimalCard = (animal: Animal, isHighlighted: boolean = false) => (
    <Paper
      key={animal.id}
      sx={{
        p: 2,
        m: 1,
        minWidth: 200,
        backgroundColor: isHighlighted ? 'primary.light' : 'background.paper',
        border: isHighlighted ? 2 : 1,
        borderColor: isHighlighted ? 'primary.main' : 'divider',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: isHighlighted ? 'primary.light' : 'action.hover',
          transform: 'translateY(-2px)',
          boxShadow: 2,
        },
      }}
      onClick={() => navigate(`/animals/${animal.id}`)}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar
          sx={{
            mr: 1,
            bgcolor: animal.sex === Sex.Female ? 'pink' : 'lightblue',
            width: 32,
            height: 32,
          }}
        >
          {animal.sex === Sex.Female ? <FemaleIcon fontSize="small" /> : <MaleIcon fontSize="small" />}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {animal.name || 'Sans nom'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {animal.identifier || animal.id.slice(0, 8)}
          </Typography>
        </Box>
      </Box>
      <Chip
        label={getStatusLabel(animal.status)}
        color={getStatusColor(animal.status)}
        size="small"
        sx={{ fontSize: '0.7rem' }}
      />
    </Paper>
  );

  
  // Get direct parents and children for simple display
  const mother = currentAnimal.motherId ? allAnimals.find(a => a.id === currentAnimal.motherId) : null;
  const father = currentAnimal.fatherId ? allAnimals.find(a => a.id === currentAnimal.fatherId) : null;
  const children = findChildren(currentAnimal.id);

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <TreeIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Arbre généalogique
        </Typography>
      </Box>

      {/* Ancestors Section */}
      {(mother || father) && (
        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            Parents
          </Typography>
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" gap={2}>
            {mother && renderAnimalCard(mother)}
            {father && renderAnimalCard(father)}
          </Box>
        </Box>
      )}

      {/* Current Animal (Highlighted) */}
      <Box mb={4}>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          Animal sélectionné
        </Typography>
        <Box display="flex" justifyContent="center">
          {renderAnimalCard(currentAnimal, true)}
        </Box>
      </Box>

      {/* Descendants Section */}
      {children.length > 0 && (
        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            Descendants ({children.length})
          </Typography>
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" gap={2}>
            {children.map(child => renderAnimalCard(child))}
          </Box>
        </Box>
      )}

      {!mother && !father && children.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary">
            Aucune relation familiale enregistrée pour cet animal.
          </Typography>
        </Box>
      )}
    </Box>
  );
};