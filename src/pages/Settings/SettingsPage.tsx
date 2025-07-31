import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
  Scale as ScaleIcon,
  QrCode as QrCodeIcon,
  Language as LanguageIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { backupService, ImportSummary } from '../../services/backup.service';
import { BackupFile } from '../../models/types';
import { formatDate } from '../../utils/dates';

const SettingsPage = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [importFile, setImportFile] = useState<BackupFile | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const state = useAppStore();
  const { settings } = state;
  const updateSettings = useAppStore((state) => state.updateSettings);
  const clearAllData = useAppStore((state) => state.clearAllData);
  const importData = useAppStore((state) => state.importData);

  const handleExport = () => {
    try {
      backupService.exportData(state);
      setSnackbar({
        open: true,
        message: 'Export réussi ! Le fichier a été téléchargé.',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'export : ' + (error as Error).message,
        severity: 'error',
      });
    }
  };

  const handleImportFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const backupData = await backupService.importData(file);
      const summary = backupService.generateImportSummary(backupData, state);
      
      setImportFile(backupData);
      setImportSummary(summary);
      setImportDialogOpen(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la lecture du fichier : ' + (error as Error).message,
        severity: 'error',
      });
    }
    
    // Reset the input
    event.target.value = '';
  };

  const handleImportConfirm = (mode: 'merge' | 'replace') => {
    if (!importFile) return;

    try {
      if (mode === 'merge') {
        const mergedData = backupService.mergeData(importFile, state);
        importData(mergedData);
      } else {
        const replacedData = backupService.replaceData(importFile);
        importData(replacedData);
      }

      setSnackbar({
        open: true,
        message: 'Import réussi !',
        severity: 'success',
      });
      setImportDialogOpen(false);
      setImportFile(null);
      setImportSummary(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'import : ' + (error as Error).message,
        severity: 'error',
      });
    }
  };

  const handleClearData = () => {
    clearAllData();
    setSnackbar({
      open: true,
      message: 'Toutes les données ont été supprimées.',
      severity: 'success',
    });
    setClearDialogOpen(false);
  };

  const totalRecords = state.animals.length + state.breedings.length + state.litters.length + 
                      state.weights.length + state.treatments.length + state.mortalities.length;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Paramètres
      </Typography>

      <Grid container spacing={3}>
        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PaletteIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Apparence</Typography>
              </Box>
              
              <FormControl component="fieldset">
                <FormLabel component="legend">Thème</FormLabel>
                <RadioGroup
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as any })}
                >
                  <FormControlLabel value="light" control={<Radio />} label="Clair" />
                  <FormControlLabel value="dark" control={<Radio />} label="Sombre" />
                  <FormControlLabel value="system" control={<Radio />} label="Automatique (système)" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Units Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ScaleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Unités</Typography>
              </Box>
              
              <FormControl component="fieldset">
                <FormLabel component="legend">Unité de poids</FormLabel>
                <RadioGroup
                  value={settings.weightUnit}
                  onChange={(e) => updateSettings({ weightUnit: e.target.value as any })}
                >
                  <FormControlLabel value="g" control={<Radio />} label="Grammes (g)" />
                  <FormControlLabel value="kg" control={<Radio />} label="Kilogrammes (kg)" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Features Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <QrCodeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Fonctionnalités</Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableQR}
                    onChange={(e) => updateSettings({ enableQR: e.target.checked })}
                  />
                }
                label="Codes QR pour identifier les cages/animaux"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Language Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LanguageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Langue</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Interface en français (fr-FR)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                D'autres langues pourront être ajoutées dans les futures versions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Management */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestion des données
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Vous avez actuellement <strong>{totalRecords} enregistrements</strong> dans votre base de données.
              </Typography>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExport}
                    fullWidth
                  >
                    Exporter les données
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    component="label"
                    fullWidth
                  >
                    Importer des données
                    <input
                      type="file"
                      accept=".json"
                      hidden
                      onChange={handleImportFileSelect}
                    />
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setClearDialogOpen(true)}
                    fullWidth
                  >
                    Effacer toutes les données
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Important :</strong> Pensez à exporter régulièrement vos données. 
                  Toutes les informations sont stockées localement dans votre navigateur et 
                  pourraient être perdues si vous videz le cache ou désinstallez l'application.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* App Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                À propos de Garenne
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Version 1.0.0 - Application de traçabilité pour élevage de lapins
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Cette application fonctionne entièrement hors ligne et stocke toutes vos données 
                localement dans votre navigateur. Aucune donnée n'est envoyée vers des serveurs externes.
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Schéma de données version {settings.schemaVersion}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Importer des données</DialogTitle>
        <DialogContent>
          {importSummary && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Aperçu du fichier
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Date d'export" 
                    secondary={formatDate(importSummary.exportedAt, 'dd/MM/yyyy HH:mm')} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Version du schéma" 
                    secondary={importSummary.schemaVersion} 
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Contenu du fichier :
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Animaux : {importSummary.counts.animals}</Typography>
                  <Typography variant="body2">Portées : {importSummary.counts.litters}</Typography>
                  <Typography variant="body2">Pesées : {importSummary.counts.weights}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Saillies : {importSummary.counts.breedings}</Typography>
                  <Typography variant="body2">Traitements : {importSummary.counts.treatments}</Typography>
                  <Typography variant="body2">Mortalités : {importSummary.counts.mortalities}</Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Données actuelles :
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Animaux : {importSummary.currentCounts.animals}</Typography>
                  <Typography variant="body2">Portées : {importSummary.currentCounts.litters}</Typography>
                  <Typography variant="body2">Pesées : {importSummary.currentCounts.weights}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Saillies : {importSummary.currentCounts.breedings}</Typography>
                  <Typography variant="body2">Traitements : {importSummary.currentCounts.treatments}</Typography>
                  <Typography variant="body2">Mortalités : {importSummary.currentCounts.mortalities}</Typography>
                </Grid>
              </Grid>

              {!importSummary.canImport && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Impossible d'importer ce fichier : la version du schéma ({importSummary.schemaVersion}) 
                  est plus récente que celle de l'application.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Annuler</Button>
          {importSummary?.canImport && (
            <>
              <Button onClick={() => handleImportConfirm('merge')} variant="outlined">
                Fusionner
              </Button>
              <Button onClick={() => handleImportConfirm('replace')} variant="contained" color="error">
                Remplacer
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WarningIcon color="error" sx={{ mr: 1 }} />
            Effacer toutes les données
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Êtes-vous sûr de vouloir supprimer toutes vos données ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cette action est irréversible. Tous vos animaux, portées, pesées, traitements 
            et autres données seront définitivement perdus.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Assurez-vous d'avoir exporté vos données avant de continuer !
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleClearData} color="error" variant="contained">
            Effacer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;