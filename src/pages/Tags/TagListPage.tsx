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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Label as TagIcon,
  Palette as ColorIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../../state/store';
import { Tag } from '../../models/types';

const tagSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire').max(30, 'Le nom est trop long'),
  color: z.string().optional(),
  description: z.string().optional(),
});

type TagFormData = z.infer<typeof tagSchema>;

const TagListPage: React.FC = () => {
  const { tags, animals, addTag, updateTag, deleteTag } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      color: '#1976d2',
      description: '',
    },
  });

  // Calculate usage for each tag
  const tagUsage = useMemo(() => {
    const usage: Record<string, number> = {};
    animals.forEach(animal => {
      if (animal.tags) {
        animal.tags.forEach(tagId => {
          usage[tagId] = (usage[tagId] || 0) + 1;
        });
      }
    });
    return usage;
  }, [animals]);

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    
    const query = searchQuery.toLowerCase();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(query) ||
      tag.description?.toLowerCase().includes(query)
    );
  }, [tags, searchQuery]);

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      reset({
        name: tag.name,
        color: tag.color || '#1976d2',
        description: tag.description || '',
      });
    } else {
      setEditingTag(null);
      reset({
        name: '',
        color: '#1976d2',
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTag(null);
    reset();
  };

  const onSubmit = async (data: TagFormData) => {
    try {
      if (editingTag) {
        updateTag(editingTag.id, data);
      } else {
        addTag(data);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleDeleteTag = (tag: Tag) => {
    const usage = tagUsage[tag.id] || 0;
    const message = usage > 0 
      ? `Êtes-vous sûr de vouloir supprimer l'étiquette "${tag.name}" ? Elle est utilisée par ${usage} animal(s).`
      : `Êtes-vous sûr de vouloir supprimer l'étiquette "${tag.name}" ?`;
    
    if (window.confirm(message)) {
      deleteTag(tag.id);
    }
  };

  const getTagColor = (tag: Tag) => {
    return tag.color || '#1976d2';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestion des Étiquettes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouvelle Étiquette
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher une étiquette..."
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

      {filteredTags.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <TagIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? 'Aucune étiquette trouvée' : 'Aucune étiquette enregistrée'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery ? 'Essayez de modifier votre recherche' : 'Les étiquettes permettent d\'organiser vos animaux'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Créer ma première étiquette
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTags.map((tag) => (
            <Grid item xs={12} sm={6} md={4} key={tag.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={tag.name}
                      sx={{ 
                        backgroundColor: getTagColor(tag),
                        color: 'white',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {tagUsage[tag.id] || 0} utilisations
                    </Typography>
                  </Box>

                  {tag.description && (
                    <Typography variant="body2" color="text.secondary">
                      {tag.description}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(tag)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteTag(tag)}
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
        aria-label="add tag"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Tag Form Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingTag ? 'Modifier l\'étiquette' : 'Nouvelle étiquette'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nom de l'étiquette"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Couleur
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input
                        type="color"
                        value={field.value}
                        onChange={field.onChange}
                        style={{
                          width: 50,
                          height: 40,
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                      />
                      <ColorIcon sx={{ color: 'text.secondary' }} />
                    </Box>
                  </Box>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Description de l'étiquette..."
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TagListPage;