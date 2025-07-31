import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  FamilyRestroom as FamilyIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  ChildCare as BabyIcon,
  CalendarToday as CalendarIcon,
  Pets as PetsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { getAnimalById, getAnimalChildren } from '../../state/selectors';
import { formatDate, calculateAgeText } from '../../utils/dates';
import { Sex, Status } from '../../models/types';

const LitterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingField, setEditingField] = useState<'weaning' | 'notes' | null>(null);
  const [weaningDate, setWeaningDate] = useState('');
  const [weanedCount, setWeanedCount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const state = useAppStore();
  const updateLitter = useAppStore((state) => state.updateLitter);
  const deleteLitter = useAppStore((state) => state.deleteLitter);
  const addAnimal = useAppStore((state) => state.addAnimal);

  // Find the litter
  const litter = state.litters.find(l => l.id === id);
  
  // Get parent animals
  const mother = litter ? getAnimalById(state, litter.motherId) : undefined;
  const father = litter?.fatherId ? getAnimalById(state, litter.fatherId) : undefined;
  
  // Get offspring (animals with matching parents and birth date)
  const offspring = litter ? state.animals.filter(animal => 
    animal.motherId === litter.motherId &&
    animal.fatherId === litter.fatherId &&
    animal.birthDate === litter.kindlingDate
  ) : [];

  // Get related breeding if any
  const relatedBreeding = litter ? state.breedings.find(breeding =>
    breeding.femaleId === litter.motherId &&
    breeding.maleId === litter.fatherId &&
    breeding.expectedKindlingDate &&
    Math.abs(new Date(litter.kindlingDate).getTime() - new Date(breeding.expectedKindlingDate).getTime()) <= 5 * 24 * 60 * 60 * 1000
  ) : undefined;

  useEffect(() => {
    if (litter) {
      setWeaningDate(litter.weaningDate || '');
      setWeanedCount(litter.weanedCount || litter.bornAlive);
      setNotes(litter.notes || '');
    }
  }, [litter]);

  if (!litter) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Alert severity="error">
          Portée non trouvée
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/litters')}
          sx={{ mt: 2 }}
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }

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

  const getWeaningStatus = () => {
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

  const handleEditField = (field: 'weaning' | 'notes') => {
    setEditingField(field);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingField === 'weaning') {
      updateLitter(litter.id, {
        weaningDate: weaningDate || undefined,
        weanedCount: weanedCount > 0 ? weanedCount : undefined,
      });
    } else if (editingField === 'notes') {
      updateLitter(litter.id, {
        notes: notes.trim() || undefined,
      });
    }
    setShowEditDialog(false);
    setEditingField(null);
  };

  const handleAddOffspring = (sex: Sex) => {
    const nextNumber = offspring.filter(o => o.sex === sex).length + 1;
    const genderLabel = sex === Sex.Male ? 'Mâle' : 'Femelle';
    
    addAnimal({
      name: `${mother?.name || 'Mère'} - ${genderLabel} ${nextNumber}`,
      sex,
      birthDate: litter.kindlingDate,
      origin: 'BORN_HERE',
      motherId: litter.motherId,
      fatherId: litter.fatherId,
      status: Status.Grow,
      breed: mother?.breed,
    });
  };

  const weaningStatus = getWeaningStatus();
  const survivalRate = litter.bornAlive > 0 ? ((litter.bornAlive / (litter.bornAlive + litter.stillborn)) * 100).toFixed(1) : '0';

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/litters')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Portée du {formatDate(litter.kindlingDate)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Litter Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                  <FamilyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    Informations générales
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
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={`${litter.bornAlive} nés vivants`}
                  color="success"
                  sx={{ mr: 1, mb: 1 }}
                />
                {litter.stillborn > 0 && (
                  <Chip
                    label={`${litter.stillborn} mort-nés`}
                    color="error"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}
                <Chip
                  label={`${survivalRate}% survie`}
                  color={parseFloat(survivalRate) > 90 ? 'success' : parseFloat(survivalRate) > 70 ? 'warning' : 'error'}
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Date de naissance:</strong> {formatDate(litter.kindlingDate)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Total né:</strong> {litter.bornAlive + litter.stillborn}
              </Typography>

              {litter.weaningDate && (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Date de sevrage:</strong> {formatDate(litter.weaningDate)}
                  </Typography>
                  {litter.weanedCount && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Nombre sevré:</strong> {litter.weanedCount}
                    </Typography>
                  )}
                </>
              )}

              {litter.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Notes:</strong> {litter.notes}
                  </Typography>
                </>
              )}
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                startIcon={<EditIcon />}
                onClick={() => handleEditField('weaning')}
              >
                Sevrage
              </Button>
              <Button 
                size="small" 
                startIcon={<EditIcon />}
                onClick={() => handleEditField('notes')}
              >
                Notes
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Parents Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Parents
              </Typography>

              {/* Mother */}
              <Box display="flex" alignItems="center" mb={2} p={2} bgcolor="grey.50" borderRadius={1}>
                <Avatar sx={{ mr: 2, bgcolor: 'pink' }}>
                  <FemaleIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    Mère: {mother?.name || 'Inconnue'}
                  </Typography>
                  {mother && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {mother.identifier} • {mother.breed || 'Race inconnue'}
                      </Typography>
                      {mother.birthDate && (
                        <Typography variant="body2" color="text.secondary">
                          {calculateAgeText(mother.birthDate)}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
                {mother && (
                  <Button
                    size="small"
                    onClick={() => navigate(`/animals/${mother.id}`)}
                  >
                    Voir
                  </Button>
                )}
              </Box>

              {/* Father */}
              <Box display="flex" alignItems="center" p={2} bgcolor="grey.50" borderRadius={1}>
                <Avatar sx={{ mr: 2, bgcolor: 'lightblue' }}>
                  <MaleIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    Père: {father?.name || 'Inconnu'}
                  </Typography>
                  {father && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {father.identifier} • {father.breed || 'Race inconnue'}
                      </Typography>
                      {father.birthDate && (
                        <Typography variant="body2" color="text.secondary">
                          {calculateAgeText(father.birthDate)}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
                {father && (
                  <Button
                    size="small"
                    onClick={() => navigate(`/animals/${father.id}`)}
                  >
                    Voir
                  </Button>
                )}
              </Box>

              {relatedBreeding && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Portée issue de la saillie du {formatDate(relatedBreeding.date)}
                  {relatedBreeding.method === 'NAT' ? ' (naturelle)' : ' (IA)'}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Offspring */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Descendants ({offspring.length})
                </Typography>
                <Box>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddOffspring(Sex.Male)}
                    sx={{ mr: 1 }}
                  >
                    Ajouter mâle
                  </Button>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddOffspring(Sex.Female)}
                  >
                    Ajouter femelle
                  </Button>
                </Box>
              </Box>

              {offspring.length > 0 ? (
                <List>
                  {offspring.map((animal, index) => (
                    <ListItem
                      key={animal.id}
                      divider={index < offspring.length - 1}
                      sx={{
                        '&:hover': {
                          bgcolor: 'grey.50',
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: animal.sex === Sex.Female ? 'pink' : 'lightblue',
                          width: 32,
                          height: 32
                        }}>
                          {animal.sex === Sex.Female ? <FemaleIcon fontSize="small" /> : <MaleIcon fontSize="small" />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={animal.name || 'Sans nom'}
                        secondary={
                          <Box component="span">
                            {animal.identifier && `${animal.identifier} • `}
                            {animal.sex === Sex.Female ? 'Femelle' : 'Mâle'} • 
                            {animal.status === Status.Grow ? ' Croissance' :
                             animal.status === Status.Reproducer ? ' Reproducteur' :
                             animal.status === Status.Retired ? ' Retraité' : ' Décédé'}
                            {animal.cage && ` • Cage ${animal.cage}`}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Button
                          size="small"
                          onClick={() => navigate(`/animals/${animal.id}`)}
                        >
                          Voir
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={3}>
                  <BabyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Aucun descendant créé automatiquement
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Utilisez les boutons ci-dessus pour ajouter les lapereaux individuellement
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingField === 'weaning' ? 'Modifier le sevrage' : 'Modifier les notes'}
        </DialogTitle>
        <DialogContent>
          {editingField === 'weaning' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Date de sevrage"
                type="date"
                value={weaningDate}
                onChange={(e) => setWeaningDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Nombre sevré"
                type="number"
                value={weanedCount}
                onChange={(e) => setWeanedCount(Math.max(0, parseInt(e.target.value) || 0))}
                inputProps={{ min: 0, max: litter.bornAlive }}
                fullWidth
                helperText={`Maximum: ${litter.bornAlive} (nés vivants)`}
              />
            </Box>
          ) : (
            <TextField
              label="Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Annuler</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LitterDetailPage;