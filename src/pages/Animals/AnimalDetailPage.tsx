import { useState, Suspense } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Favorite as HeartIcon,
  Pets as PetsIcon,
  MoreVert as MoreIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { Sex, Status, Breeding } from '../../models/types';
import { calculateAgeText, formatDate } from '../../utils/dates';
import { getAnimalActiveTreatments, getAnimalWeights, getAnimalTreatments, getFemaleBreedings, getAnimalById } from '../../state/selectors';
import { BreedingModal, WeightChart, GenealogyTree, QRCodeDisplay, MortalityModal, QuickWeightModal, QuickTreatmentModal } from '../../components/LazyComponents';
import { LitterModal } from '../../components/modals/LitterModal';
import { AdvancedGenealogyTree } from '../../components/AdvancedGenealogyTree';
import { MatingRecommendations } from '../../components/MatingRecommendations';
import { PedigreePDFService } from '../../services/pedigree-pdf.service';
import { printRabbitSheet } from '../../utils/print.utils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`animal-tabpanel-${index}`}
      aria-labelledby={`animal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AnimalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  
  const [tabValue, setTabValue] = useState(() => {
    switch (initialTab) {
      case 'breeding': return 1;
      case 'weights': return 2;
      case 'health': return 3;
      case 'genealogy': return 4;
      case 'mating': return 5;
      default: return 0;
    }
  });

  // Modal state
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [treatmentModalOpen, setTreatmentModalOpen] = useState(false);
  const [breedingModalOpen, setBreedingModalOpen] = useState(false);
  const [litterModalOpen, setLitterModalOpen] = useState(false);
  const [mortalityModalOpen, setMortalityModalOpen] = useState(false);
  const [selectedBreeding, setSelectedBreeding] = useState<Breeding | null>(null);
  const [breedingToDelete, setBreedingToDelete] = useState<Breeding | null>(null);
  const [breedingMenuAnchor, setBreedingMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedBreedingForMenu, setSelectedBreedingForMenu] = useState<Breeding | null>(null);
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const state = useAppStore();
  const animals = state.animals;
  const cages = state.cages;
  const settings = state.settings;
  const animal = animals.find(a => a.id === id);
  const deleteBreeding = useAppStore((state) => state.deleteBreeding);
  const updateBreeding = useAppStore((state) => state.updateBreeding);
  
  const weights = getAnimalWeights(state, id || '');
  const treatments = getAnimalTreatments(state, id || '');
  const activeTreatments = getAnimalActiveTreatments(state, id || '');
  
  // Get breedings for this animal (female only for now, as males can have many partners)
  const breedings = animal?.sex === Sex.Female ? getFemaleBreedings(state, id || '') : [];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Reproducer: return 'success';
      case Status.Grow: return 'info';
      case Status.Retired: return 'warning';
      case Status.Deceased: return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case Status.Reproducer: return 'Reproducteur';
      case Status.Grow: return 'Croissance';
      case Status.Retired: return 'Retraité';
      case Status.Deceased: return 'Décédé';
      default: return status;
    }
  };

  // Breeding management handlers
  const handleBreedingMenuOpen = (event: React.MouseEvent<HTMLElement>, breeding: Breeding) => {
    setBreedingMenuAnchor(event.currentTarget);
    setSelectedBreedingForMenu(breeding);
  };

  const handleBreedingMenuClose = () => {
    setBreedingMenuAnchor(null);
    setSelectedBreedingForMenu(null);
  };

  const handleDeleteBreeding = (breeding: Breeding) => {
    setBreedingToDelete(breeding);
    handleBreedingMenuClose();
  };

  const confirmDeleteBreeding = () => {
    if (breedingToDelete) {
      deleteBreeding(breedingToDelete.id);
      setBreedingToDelete(null);
    }
  };

  const handleUpdateBreedingStatus = (breeding: Breeding, diagnosis: 'PREGNANT' | 'NOT_PREGNANT' | 'UNKNOWN') => {
    updateBreeding(breeding.id, { diagnosis });
    handleBreedingMenuClose();
  };

  const handlePrint = () => {
    // Use the new dedicated print function instead of the dialog
    if (animal) {
      printRabbitSheet(animal);
    }
  };

  const handleExportPedigree = async (animal: any) => {
    try {
      await PedigreePDFService.generatePedigreePDF(animal, animals, {
        generations: 4,
        includeInbreedingCoefficients: true,
        title: `Pedigree de ${animal.name || animal.identifier || 'Animal'}`,
        format: 'A4'
      });
    } catch (error) {
      console.error('Erreur lors de la génération du pedigree PDF:', error);
      // You could add a toast notification here
    }
  };

  const handleCreateBreedingFromRecommendation = (femaleId: string, maleId: string) => {
    // Open breeding modal with preselected animals
    const female = animals.find(a => a.id === femaleId);
    const male = animals.find(a => a.id === maleId);
    
    if (female && male) {
      // For now, just navigate to breeding creation - you could enhance this to pre-fill the form
      setBreedingModalOpen(true);
    }
  };

  if (!animal) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Alert severity="error">Animal non trouvé</Alert>
      </Container>
    );
  }

  // Get parent animals
  const mother = animal.motherId ? animals.find(a => a.id === animal.motherId) : null;
  const father = animal.fatherId ? animals.find(a => a.id === animal.fatherId) : null;

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={{ xs: 2, sm: 3 }} sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box display="flex" alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/animals')}
            sx={{ mr: 2 }}
            size="small"
          >
            Retour
          </Button>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <Avatar sx={{ mr: 2, bgcolor: animal.sex === Sex.Female ? 'pink' : 'lightblue' }}>
              {animal.sex === Sex.Female ? <FemaleIcon /> : <MaleIcon />}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" sx={{
                fontSize: { xs: '1.5rem', sm: '2.125rem' }
              }}>
                {animal.name || 'Animal sans nom'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {animal.identifier || 'Pas d\'identifiant'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/animals/${animal.id}/edit`)}
            size="small"
          >
            Modifier
          </Button>
          {settings.enableQR && (
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              size="small"
            >
              Imprimer fiche
            </Button>
          )}
          {animal.status !== Status.Deceased && (
            <IconButton 
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              size="small"
            >
              <MoreIcon />
            </IconButton>
          )}
        </Box>
        
        <Menu
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={() => setMenuAnchorEl(null)}
        >
          <MenuItem 
            onClick={() => {
              setMortalityModalOpen(true);
              setMenuAnchorEl(null);
            }}
            sx={{ color: 'error.main' }}
          >
            Signaler un décès
          </MenuItem>
        </Menu>
      </Box>

      {/* Quick Info */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Statut
            </Typography>
            <Chip
              label={getStatusLabel(animal.status)}
              color={getStatusColor(animal.status)}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Race
            </Typography>
            <Typography variant="body2">
              {animal.breed || 'Non spécifiée'}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Âge
            </Typography>
            <Typography variant="body2">
              {animal.birthDate ? calculateAgeText(animal.birthDate) : 'Inconnu'}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Cage
            </Typography>
            <Typography variant="body2">
              {animal.cage 
                ? (cages.find(c => c.id === animal.cage)?.name || 'Cage inconnue')
                : 'Non assignée'}
            </Typography>
          </Grid>
        </Grid>

        {activeTreatments.length > 0 && (
          <Box mt={2}>
            <Alert severity="warning" icon={<WarningIcon />}>
              Animal sous délai d'attente - {activeTreatments.length} traitement(s) actif(s)
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Tabs */}
      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Aperçu" />
          <Tab label="Reproduction" />
          <Tab label="Pesées" />
          <Tab label="Santé" />
          <Tab label="Généalogie" />
          <Tab label="Accouplements" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations générales
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sexe
                </Typography>
                <Typography variant="body2">
                  {animal.sex === Sex.Female ? 'Femelle' : animal.sex === Sex.Male ? 'Mâle' : 'Inconnu'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date de naissance
                </Typography>
                <Typography variant="body2">
                  {animal.birthDate ? formatDate(animal.birthDate) : 'Non renseignée'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Origine
                </Typography>
                <Typography variant="body2">
                  {animal.origin === 'BORN_HERE' ? 'Né ici' : animal.origin === 'PURCHASED' ? 'Acheté' : 'Non renseignée'}
                </Typography>
              </Box>

              {animal.notes && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {animal.notes}
                  </Typography>
                </Box>
              )}
            </Grid>

            {settings.enableQR && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Code QR
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <QRCodeDisplay animal={animal} size="medium" />
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Scannez ce code QR pour accéder rapidement à cette fiche
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><Typography>Chargement de l'arbre généalogique...</Typography></Box>}>
                <GenealogyTree 
                  currentAnimal={animal}
                  allAnimals={animals}
                />
              </Suspense>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Breeding Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Reproduction ({breedings.length})
            </Typography>
            {animal?.sex === Sex.Female && (
              <Button
                variant="contained"
                startIcon={<HeartIcon />}
                size="small"
                onClick={() => setBreedingModalOpen(true)}
              >
                Nouvelle saillie
              </Button>
            )}
          </Box>
          
          {animal?.sex === Sex.Male && (
            <Alert severity="info" sx={{ mb: 2 }}>
              La reproduction est gérée depuis la fiche de la femelle
            </Alert>
          )}
          
          {animal?.sex === Sex.Female && breedings.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucune saillie enregistrée
            </Typography>
          ) : (
            <List>
              {breedings.map((breeding) => {
                const male = breeding.maleId ? getAnimalById(state, breeding.maleId) : null;
                const statusColor = breeding.diagnosis === 'PREGNANT' ? 'success' : 
                                   breeding.diagnosis === 'NOT_PREGNANT' ? 'error' : 'default';
                const statusLabel = breeding.diagnosis === 'PREGNANT' ? 'Gestante' :
                                   breeding.diagnosis === 'NOT_PREGNANT' ? 'Non gestante' : 'En attente';
                
                return (
                  <ListItem key={breeding.id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1">
                            Saillie du {formatDate(breeding.date)}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={statusLabel} 
                            color={statusColor} 
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" component="span" display="block">
                            Mâle: {male ? (male.name || 'Sans nom') : 'Non spécifié'}
                          </Typography>
                          {breeding.expectedKindlingDate && breeding.diagnosis === 'PREGNANT' && (
                            <Typography variant="body2" color="text.secondary" component="span" display="block">
                              Mise bas prévue: {formatDate(breeding.expectedKindlingDate)}
                            </Typography>
                          )}
                          {breeding.notes && (
                            <Typography variant="body2" color="text.secondary" component="span" display="block" sx={{ fontStyle: 'italic' }}>
                              {breeding.notes}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        {breeding.diagnosis === 'PREGNANT' && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PetsIcon />}
                            onClick={() => {
                              setSelectedBreeding(breeding);
                              setLitterModalOpen(true);
                            }}
                          >
                            Mise bas
                          </Button>
                        )}
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={(e) => handleBreedingMenuOpen(e, breeding)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          )}
        </TabPanel>

        {/* Weights Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Pesées ({weights.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => setWeightModalOpen(true)}
            >
              Nouvelle pesée
            </Button>
          </Box>
          
          {/* Weight Chart */}
          {weights.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><Typography>Chargement du graphique...</Typography></Box>}>
                <WeightChart weights={weights} />
              </Suspense>
            </Box>
          )}
          
          {weights.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucune pesée enregistrée
            </Typography>
          ) : (
            <List>
              {weights.map((weight) => (
                <ListItem key={weight.id} divider>
                  <ListItemText
                    primary={`${weight.weightGrams}g`}
                    secondary={`${formatDate(weight.date)}${weight.notes ? ` - ${weight.notes}` : ''}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Health Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Traitements ({treatments.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => setTreatmentModalOpen(true)}
            >
              Nouveau traitement
            </Button>
          </Box>

          {activeTreatments.length > 0 && (
            <Card sx={{ mb: 2, bgcolor: 'warning.light' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Traitements avec délai d'attente actif
                </Typography>
                {activeTreatments.map(treatment => (
                  <Typography key={treatment.id} variant="body2">
                    {treatment.product} - Délai jusqu'au {formatDate(treatment.withdrawalUntil!)}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          )}
          
          {treatments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucun traitement enregistré
            </Typography>
          ) : (
            <List>
              {treatments.map((treatment) => (
                <ListItem key={treatment.id} divider>
                  <ListItemText
                    primary={treatment.product}
                    secondary={`${formatDate(treatment.date)} - ${treatment.reason || 'Raison non spécifiée'}${treatment.withdrawalUntil ? ` - Délai: ${formatDate(treatment.withdrawalUntil)}` : ''}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Advanced Genealogy Tab */}
        <TabPanel value={tabValue} index={4}>
          {animal && (
            <AdvancedGenealogyTree
              currentAnimal={animal}
              allAnimals={animals}
              onExportPedigree={handleExportPedigree}
            />
          )}
        </TabPanel>

        {/* Mating Recommendations Tab */}
        <TabPanel value={tabValue} index={5}>
          {animal && (
            <MatingRecommendations
              animal={animal}
              allAnimals={animals}
              onCreateBreeding={handleCreateBreedingFromRecommendation}
            />
          )}
        </TabPanel>
      </Paper>

      {/* Modals */}
      <Suspense fallback={<div>Chargement...</div>}>
        <QuickWeightModal
          open={weightModalOpen}
          onClose={() => setWeightModalOpen(false)}
          preselectedAnimal={animal}
        />
      </Suspense>
      <Suspense fallback={<div>Chargement...</div>}>
        <QuickTreatmentModal
          open={treatmentModalOpen}
          onClose={() => setTreatmentModalOpen(false)}
          preselectedAnimal={animal}
        />
      </Suspense>
      <BreedingModal
        open={breedingModalOpen}
        onClose={() => setBreedingModalOpen(false)}
        preselectedFemale={animal?.sex === Sex.Female ? animal : undefined}
      />
      <LitterModal
        open={litterModalOpen}
        onClose={() => {
          setLitterModalOpen(false);
          setSelectedBreeding(null);
        }}
        breeding={selectedBreeding || undefined}
        preselectedMother={animal?.sex === Sex.Female ? animal : undefined}
      />
      {animal && (
        <Suspense fallback={<div>Chargement...</div>}>
          <MortalityModal
            open={mortalityModalOpen}
            onClose={() => setMortalityModalOpen(false)}
            animal={animal}
          />
        </Suspense>
      )}

      {/* Breeding Menu */}
      <Menu
        anchorEl={breedingMenuAnchor}
        open={Boolean(breedingMenuAnchor)}
        onClose={handleBreedingMenuClose}
      >
        <MenuItem onClick={() => selectedBreedingForMenu && handleUpdateBreedingStatus(selectedBreedingForMenu, 'PREGNANT')}>
          Marquer comme gestante
        </MenuItem>
        <MenuItem onClick={() => selectedBreedingForMenu && handleUpdateBreedingStatus(selectedBreedingForMenu, 'NOT_PREGNANT')}>
          Marquer comme non gestante
        </MenuItem>
        <MenuItem onClick={() => selectedBreedingForMenu && handleUpdateBreedingStatus(selectedBreedingForMenu, 'UNKNOWN')}>
          Marquer comme en attente
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => selectedBreedingForMenu && handleDeleteBreeding(selectedBreedingForMenu)}
          sx={{ color: 'error.main' }}
        >
          Supprimer la saillie
        </MenuItem>
      </Menu>

      {/* Breeding Deletion Confirmation Dialog */}
      <Dialog
        open={Boolean(breedingToDelete)}
        onClose={() => setBreedingToDelete(null)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette saillie du {breedingToDelete ? formatDate(breedingToDelete.date) : ''} ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBreedingToDelete(null)}>
            Annuler
          </Button>
          <Button onClick={confirmDeleteBreeding} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default AnimalDetailPage;