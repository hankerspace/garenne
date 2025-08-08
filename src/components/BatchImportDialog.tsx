import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { BatchImportService, ImportPreview, ImportValidationError } from '../services/batch-import.service';
import { useAppStore } from '../state/store';
import { Animal } from '../models/types';

interface BatchImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: (imported: number) => void;
}

export const BatchImportDialog: React.FC<BatchImportDialogProps> = ({
  open,
  onClose,
  onImportComplete,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [duplicateHandling, setDuplicateHandling] = useState<'skip' | 'update' | 'error'>('skip');
  const [validateRelationships, setValidateRelationships] = useState(true);
  const [importTags, setImportTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { animals, addAnimal, updateAnimal } = useAppStore();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCsvContent(reader.result as string);
        setActiveStep(1);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleValidateData = async () => {
    if (!csvContent) return;

    setIsProcessing(true);
    try {
      const rows = BatchImportService.parseCSV(csvContent);
      const validationResult = BatchImportService.validateImport(rows, animals, {
        duplicateHandling,
        validateRelationships,
      });
      setPreview(validationResult);
      setActiveStep(2);
    } catch (error) {
      console.error('Validation error:', error);
      // Handle validation error
    }
    setIsProcessing(false);
  };

  const handleExecuteImport = async () => {
    if (!preview) return;

    setIsProcessing(true);
    try {
      const result = BatchImportService.executeImport(preview, animals, {
        duplicateHandling: duplicateHandling as 'skip' | 'update',
        addTags: importTags,
      });

      // Apply the import to the store
      preview.preview.animals.forEach(animal => {
        const existing = animals.find(a => a.identifier === animal.identifier);
        if (existing && duplicateHandling === 'update') {
          updateAnimal(animal.id, animal);
        } else if (!existing) {
          addAnimal(animal);
        }
      });

      setImportResult(result);
      setActiveStep(3);
      onImportComplete(result.imported.animals);
    } catch (error) {
      console.error('Import error:', error);
    }
    setIsProcessing(false);
  };

  const handleDownloadTemplate = () => {
    const template = BatchImportService.generateTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'garenne-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !importTags.includes(newTag.trim())) {
      setImportTags([...importTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setImportTags(importTags.filter(tag => tag !== tagToRemove));
  };

  const handleClose = () => {
    setActiveStep(0);
    setFile(null);
    setCsvContent('');
    setPreview(null);
    setImportResult(null);
    setImportTags([]);
    onClose();
  };

  const renderErrorList = (errors: ImportValidationError[], title: string, icon: React.ReactNode) => {
    if (errors.length === 0) return null;

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography>{title} ({errors.length})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {errors.slice(0, 20).map((error, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Ligne ${error.row}, champ "${error.field}"`}
                  secondary={error.message}
                />
              </ListItem>
            ))}
            {errors.length > 20 && (
              <Typography variant="body2" color="text.secondary">
                ... et {errors.length - 20} autres erreurs
              </Typography>
            )}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  const steps = ['Télécharger fichier', 'Configurer import', 'Prévisualiser', 'Importer'];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Import en lot d'animaux
          <Tooltip title="Télécharger le modèle CSV">
            <IconButton onClick={handleDownloadTemplate}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {isProcessing && <LinearProgress sx={{ mb: 2 }} />}

        {/* Step 0: File Upload */}
        {activeStep === 0 && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Téléchargez un fichier CSV contenant les données des animaux à importer.
              Utilisez le bouton de téléchargement pour obtenir un modèle.
            </Alert>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              style={{ display: 'none' }}
            />
            
            <Paper
              onClick={handleFileUploadClick}
              sx={{
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: 'grey.50',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Cliquez pour sélectionner un fichier CSV
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Formats acceptés: .csv
              </Typography>
              {file && (
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Fichier sélectionné: {file.name}
                </Typography>
              )}
            </Paper>
          </Box>
        )}

        {/* Step 1: Configuration */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Configuration de l'import</Typography>
            
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Gestion des doublons</FormLabel>
              <RadioGroup
                value={duplicateHandling}
                onChange={(e) => setDuplicateHandling(e.target.value as any)}
              >
                <FormControlLabel 
                  value="skip" 
                  control={<Radio />} 
                  label="Ignorer les doublons" 
                />
                <FormControlLabel 
                  value="update" 
                  control={<Radio />} 
                  label="Mettre à jour les doublons" 
                />
                <FormControlLabel 
                  value="error" 
                  control={<Radio />} 
                  label="Erreur sur les doublons" 
                />
              </RadioGroup>
            </FormControl>

            <FormControlLabel
              control={
                <Radio
                  checked={validateRelationships}
                  onChange={(e) => setValidateRelationships(e.target.checked)}
                />
              }
              label="Valider les relations familiales"
              sx={{ mb: 3, display: 'block' }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Tags à ajouter automatiquement
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nouveau tag"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                  Ajouter
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {importTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Step 2: Preview */}
        {activeStep === 2 && preview && (
          <Box>
            <Typography variant="h6" gutterBottom>Prévisualisation de l'import</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip 
                icon={<InfoIcon />} 
                label={`${preview.totalRows} lignes total`} 
                color="default" 
              />
              <Chip 
                icon={<CheckIcon />} 
                label={`${preview.validRows} valides`} 
                color="success" 
              />
              <Chip 
                icon={<ErrorIcon />} 
                label={`${preview.errors.length} erreurs`} 
                color="error" 
              />
              <Chip 
                icon={<WarningIcon />} 
                label={`${preview.warnings.length} avertissements`} 
                color="warning" 
              />
            </Box>

            {renderErrorList(preview.errors, 'Erreurs', <ErrorIcon color="error" />)}
            {renderErrorList(preview.warnings, 'Avertissements', <WarningIcon color="warning" />)}

            {preview.preview.animals.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Aperçu des animaux (premiers {Math.min(preview.preview.animals.length, 10)})
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Identifiant</TableCell>
                        <TableCell>Sexe</TableCell>
                        <TableCell>Race</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell>Tags</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {preview.preview.animals.slice(0, 10).map((animal, index) => (
                        <TableRow key={index}>
                          <TableCell>{animal.name}</TableCell>
                          <TableCell>{animal.identifier}</TableCell>
                          <TableCell>{animal.sex}</TableCell>
                          <TableCell>{animal.breed}</TableCell>
                          <TableCell>{animal.status}</TableCell>
                          <TableCell>
                            {animal.tags?.map(tag => (
                              <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}

        {/* Step 3: Results */}
        {activeStep === 3 && importResult && (
          <Box>
            <Typography variant="h6" gutterBottom>Résultats de l'import</Typography>
            
            <Alert severity={importResult.success ? "success" : "error"} sx={{ mb: 3 }}>
              {importResult.success 
                ? `Import réussi ! ${importResult.imported.animals} animaux importés.`
                : `Import échoué avec ${importResult.errors.length} erreurs.`
              }
            </Alert>

            {importResult.duplicatesHandled && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  • Doublons ignorés: {importResult.duplicatesHandled.skipped}
                </Typography>
                <Typography variant="body2">
                  • Doublons mis à jour: {importResult.duplicatesHandled.updated}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {activeStep === 3 ? 'Fermer' : 'Annuler'}
        </Button>
        
        {activeStep === 0 && file && (
          <Button onClick={() => setActiveStep(1)} variant="contained">
            Suivant
          </Button>
        )}
        
        {activeStep === 1 && (
          <Button onClick={handleValidateData} variant="contained" disabled={isProcessing}>
            Valider les données
          </Button>
        )}
        
        {activeStep === 2 && preview && preview.errors.length === 0 && (
          <Button onClick={handleExecuteImport} variant="contained" disabled={isProcessing}>
            Importer {preview.validRows} animaux
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};