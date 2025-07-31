import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FamilyRestroom as FamilyIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { getLitters, getAnimalById } from '../../state/selectors';
import { formatDate } from '../../utils/dates';
import { LitterModal } from '../../components/modals/LitterModal';

const LitterListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'mother' | 'offspring'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showNewLitter, setShowNewLitter] = useState(false);

  // Handle URL parameters for quick actions
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowNewLitter(true);
      // Clean up URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('new');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const state = useAppStore();
  const litters = getLitters(state);

  // Get litter with parent information
  const littersWithParents = litters.map(litter => {
    const mother = getAnimalById(state, litter.motherId);
    const father = litter.fatherId ? getAnimalById(state, litter.fatherId) : undefined;
    
    // Get offspring count (animals with this litter's parents and birth date close to kindling date)
    const offspringCount = state.animals.filter(animal => 
      animal.motherId === litter.motherId &&
      animal.fatherId === litter.fatherId &&
      animal.birthDate === litter.kindlingDate
    ).length;

    return {
      ...litter,
      mother,
      father,
      offspringCount,
    };
  });

  // Filter and sort litters
  const filteredAndSortedLitters = littersWithParents
    .filter((litter) => {
      const motherName = litter.mother?.name || '';
      const fatherName = litter.father?.name || '';
      const query = searchQuery.toLowerCase();
      
      return motherName.toLowerCase().includes(query) ||
             fatherName.toLowerCase().includes(query) ||
             litter.notes?.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.kindlingDate).getTime() - new Date(b.kindlingDate).getTime();
          break;
        case 'mother':
          comparison = (a.mother?.name || '').localeCompare(b.mother?.name || '');
          break;
        case 'offspring':
          comparison = a.bornAlive - b.bornAlive;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const getLitterAge = (kindlingDate: string) => {
    const now = new Date();
    const birth = new Date(kindlingDate);
    const daysDiff = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return "Aujourd'hui";
    if (daysDiff === 1) return "1 jour";
    if (daysDiff < 7) return `${daysDiff} jours`;
    if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} semaines`;
    return `${Math.floor(daysDiff / 30)} mois`;
  };

  interface LitterWithWeaningInfo {
    weaningDate?: string;
    kindlingDate: string;
  }

  const getWeaningStatus = (litter: LitterWithWeaningInfo) => {
    if (litter.weaningDate) {
      return { status: 'Sevrée', color: 'success' as const };
    }
    
    const now = new Date();
    const birth = new Date(litter.kindlingDate);
    const daysDiff = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 28) {
      return { status: 'En lactation', color: 'info' as const };
    } else {
      return { status: 'À sevrer', color: 'warning' as const };
    }
  };

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ xs: 2, sm: 3 }}>
        <Typography variant="h4" component="h2" sx={{
          fontSize: { xs: '1.75rem', sm: '2.125rem' }
        }}>
          Portées ({filteredAndSortedLitters.length})
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box mb={{ xs: 2, sm: 3 }}>
        <Grid container spacing={{ xs: 2, sm: 2 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher par mère, père ou notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                label="Trier par"
                onChange={(e) => setSortBy(e.target.value as 'date' | 'mother' | 'offspring')}
              >
                <MenuItem value="date">Date de naissance</MenuItem>
                <MenuItem value="mother">Mère</MenuItem>
                <MenuItem value="offspring">Nombre de petits</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordre</InputLabel>
              <Select
                value={sortOrder}
                label="Ordre"
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <MenuItem value="desc">Décroissant</MenuItem>
                <MenuItem value="asc">Croissant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Litters Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {filteredAndSortedLitters.map((litter) => {
          const weaningStatus = getWeaningStatus(litter);
          
          return (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={litter.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                      <FamilyIcon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" sx={{
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}>
                        {formatDate(litter.kindlingDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getLitterAge(litter.kindlingDate)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Chip
                      label={weaningStatus.status}
                      color={weaningStatus.color}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${litter.bornAlive} vivants`}
                      color="success"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {litter.stillborn > 0 && (
                      <Chip
                        label={`${litter.stillborn} mort-nés`}
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Mère:</strong> {litter.mother?.name || 'Inconnue'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Père:</strong> {litter.father?.name || 'Inconnu'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Descendants créés:</strong> {litter.offspringCount}
                    </Typography>
                  </Box>

                  {litter.weaningDate && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Sevrage:</strong> {formatDate(litter.weaningDate)}
                      {litter.weanedCount && ` (${litter.weanedCount} sevrés)`}
                    </Typography>
                  )}

                  {litter.notes && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        fontStyle: 'italic',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {litter.notes}
                      </Typography>
                    </>
                  )}
                </CardContent>
                
                <CardActions sx={{ 
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 0.5, sm: 1 }
                }}>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/litters/${litter.id}`)}
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Détails
                  </Button>
                  {litter.mother && (
                    <Button 
                      size="small" 
                      color="secondary"
                      onClick={() => navigate(`/animals/${litter.mother!.id}`)}
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Mère
                    </Button>
                  )}
                  {litter.father && (
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/animals/${litter.father!.id}`)}
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Père
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredAndSortedLitters.length === 0 && (
        <Box textAlign="center" py={4}>
          <FamilyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune portée trouvée
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {litters.length === 0 
              ? 'Commencez par enregistrer votre première portée'
              : 'Essayez de modifier vos critères de recherche'
            }
          </Typography>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add litter"
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 80, sm: 16 }, 
          right: 16,
          zIndex: 1000
        }}
        onClick={() => setShowNewLitter(true)}
      >
        <AddIcon />
      </Fab>

      {/* New Litter Modal */}
      <LitterModal 
        open={showNewLitter} 
        onClose={() => setShowNewLitter(false)} 
      />
    </Container>
  );
};

export default LitterListPage;