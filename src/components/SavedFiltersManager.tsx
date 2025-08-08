import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  BookmarkBorder as BookmarkIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { SearchService, SearchFilters, SavedSearchFilter } from '../services/search.service';
import { useTranslation } from '../hooks/useTranslation';

interface SavedFiltersManagerProps {
  currentFilters: SearchFilters;
  onApplyFilter: (filters: SearchFilters) => void;
  onSaveSuccess?: () => void;
}

export const SavedFiltersManager: React.FC<SavedFiltersManagerProps> = ({
  currentFilters,
  onApplyFilter,
  onSaveSuccess,
}) => {
  const { t } = useTranslation();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [savedFilters, setSavedFilters] = useState<SavedSearchFilter[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<SavedSearchFilter | null>(null);

  const refreshSavedFilters = () => {
    setSavedFilters(SearchService.getSavedFilters());
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    try {
      SearchService.saveSearchFilter(filterName.trim(), currentFilters);
      setSaveDialogOpen(false);
      setFilterName('');
      onSaveSuccess?.();
      refreshSavedFilters();
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  };

  const handleApplyFilter = (filter: SavedSearchFilter) => {
    SearchService.updateFilterLastUsed(filter.id);
    onApplyFilter(filter.filters);
    setListDialogOpen(false);
    refreshSavedFilters();
  };

  const handleDeleteFilter = (filterId: string) => {
    SearchService.deleteSavedFilter(filterId);
    refreshSavedFilters();
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, filter: SavedSearchFilter) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedFilter(filter);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedFilter(null);
  };

  const openListDialog = () => {
    refreshSavedFilters();
    setListDialogOpen(true);
  };

  const renderFilterSummary = (filters: SearchFilters) => {
    const parts: string[] = [];
    
    if (filters.query) parts.push(`"${filters.query}"`);
    if (filters.status?.length) parts.push(`${filters.status.length} statut(s)`);
    if (filters.sex?.length) parts.push(`${filters.sex.length} sexe(s)`);
    if (filters.breed?.length) parts.push(`${filters.breed.length} race(s)`);
    if (filters.tags?.length) parts.push(`${filters.tags.length} tag(s)`);
    if (filters.cage?.length) parts.push(`${filters.cage.length} cage(s)`);
    if (filters.dateRange) parts.push('période définie');
    if (filters.weightRange) parts.push('poids défini');

    return parts.length > 0 ? parts.join(', ') : 'Aucun filtre';
  };

  const recentFilters = SearchService.getRecentSavedFilters(3);
  const canSave = !SearchService.isFilterEmpty(currentFilters);

  return (
    <Box>
      {/* Quick actions */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SaveIcon />}
          onClick={() => setSaveDialogOpen(true)}
          disabled={!canSave}
          title={canSave ? "Sauvegarder ces filtres" : "Aucun filtre à sauvegarder"}
        >
          Sauvegarder
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<BookmarkIcon />}
          onClick={openListDialog}
        >
          Filtres sauvés
        </Button>
      </Box>

      {/* Recent filters */}
      {recentFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <HistoryIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
            Utilisés récemment:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recentFilters.map((filter) => (
              <Chip
                key={filter.id}
                label={filter.name}
                size="small"
                onClick={() => handleApplyFilter(filter)}
                clickable
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Save filter dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sauvegarder les filtres de recherche</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du filtre"
            fullWidth
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Ex: Lapines reproductrices en croissance"
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Filtres actuels:
            </Typography>
            <Typography variant="body2">
              {renderFilterSummary(currentFilters)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSaveFilter}
            variant="contained"
            disabled={!filterName.trim()}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Saved filters list dialog */}
      <Dialog open={listDialogOpen} onClose={() => setListDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Filtres de recherche sauvegardés</DialogTitle>
        <DialogContent>
          {savedFilters.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BookmarkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Aucun filtre sauvegardé
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Créez des filtres personnalisés pour retrouver rapidement vos recherches favorites
              </Typography>
            </Box>
          ) : (
            <List>
              {savedFilters.map((filter, index) => (
                <React.Fragment key={filter.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => handleApplyFilter(filter)}
                  >
                    <ListItemText
                      primary={filter.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {renderFilterSummary(filter.filters)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Créé le {new Date(filter.createdAt).toLocaleDateString()}
                            {filter.lastUsed && ` • Utilisé le ${new Date(filter.lastUsed).toLocaleDateString()}`}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, filter);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setListDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Context menu for filter actions */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedFilter) {
              handleApplyFilter(selectedFilter);
            }
            handleMenuClose();
          }}
        >
          Appliquer ce filtre
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedFilter) {
              handleDeleteFilter(selectedFilter.id);
            }
            handleMenuClose();
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Supprimer
        </MenuItem>
      </Menu>
    </Box>
  );
};