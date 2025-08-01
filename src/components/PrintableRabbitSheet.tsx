import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import { Animal, Sex, Status } from '../models/types';
import { formatDate, calculateAgeText } from '../utils/dates';
import { useAppStore } from '../state/store';
import QRCodeDisplay from './QRCodeDisplay';

interface PrintableRabbitSheetProps {
  animal: Animal;
}

const PrintableRabbitSheet: React.FC<PrintableRabbitSheetProps> = ({ animal }) => {
  const cages = useAppStore((state) => state.cages);
  
  const getSexDisplay = (sex: Sex) => {
    switch (sex) {
      case Sex.Female: return 'Femelle ♀';
      case Sex.Male: return 'Mâle ♂';
      default: return 'Inconnu';
    }
  };

  const getStatusDisplay = (status: Status) => {
    switch (status) {
      case Status.Reproducer: return 'Reproducteur';
      case Status.Grow: return 'Croissance';
      case Status.Retired: return 'Retraité';
      case Status.Deceased: return 'Décédé';
      default: return status;
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        maxWidth: '210mm', 
        maxHeight: '297mm',
        margin: 'auto',
        backgroundColor: 'white',
        color: 'black',
        overflow: 'hidden',
        '@media print': {
          boxShadow: 'none',
          margin: 0,
          padding: '1cm',
          fontSize: '11pt',
          maxHeight: 'none',
          pageBreakInside: 'avoid'
        }
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={2} sx={{ '@media print': { mb: 1 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          '@media print': { fontSize: '18pt', mb: 0.5 }
        }}>
          FICHE LAPIN
        </Typography>
        <Typography variant="h5" component="h2" color="primary" gutterBottom sx={{
          '@media print': { fontSize: '16pt', mb: 0.5 }
        }}>
          {animal.name || 'Sans nom'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{
          '@media print': { fontSize: '14pt', mb: 1 }
        }}>
          {animal.identifier || 'Aucun identifiant'}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ '@media print': { spacing: 1 } }}>
        {/* Left Column - Animal Information */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '2px solid #1976d2', pb: 1 }}>
            Informations générales
          </Typography>
          
          <Table sx={{ mt: 2 }}>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%' }}>
                  Sexe
                </TableCell>
                <TableCell>{getSexDisplay(animal.sex)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Statut
                </TableCell>
                <TableCell>{getStatusDisplay(animal.status)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Race
                </TableCell>
                <TableCell>{animal.breed || 'Non renseignée'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Date de naissance
                </TableCell>
                <TableCell>
                  {animal.birthDate ? formatDate(animal.birthDate) : 'Non renseignée'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Cage
                </TableCell>
                <TableCell>
                  {animal.cage 
                    ? (cages.find(c => c.id === animal.cage)?.name || 'Cage inconnue')
                    : 'Non renseignée'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {animal.notes && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '2px solid #1976d2', pb: 1 }}>
                Notes
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                {animal.notes}
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Right Column - QR Code */}
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '2px solid #1976d2', pb: 1 }}>
              Code QR
            </Typography>
            <Box mt={2} display="flex" justifyContent="center">
              <QRCodeDisplay animal={animal} size="large" variant="print" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Scannez ce code QR pour accéder rapidement à la fiche de cet animal
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Footer */}
      <Divider sx={{ my: 4 }} />
      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Fiche générée le {formatDate(new Date().toISOString())} par Garenne
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Application de gestion d'élevage de lapins
        </Typography>
      </Box>

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            /* Hide all application background */
            body, html {
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Hide all non-printable elements */
            .MuiDialogTitle-root,
            .MuiDialogActions-root,
            .MuiAppBar-root,
            .MuiDrawer-root,
            nav,
            header,
            footer {
              display: none !important;
            }
            
            /* Ensure dialog and paper take full space */
            .MuiDialog-paper,
            .MuiDialogContent-root,
            .MuiPaper-root {
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              max-width: none !important;
              max-height: none !important;
              width: 100% !important;
              height: auto !important;
            }
            
            /* Page setup for A4 single page */
            @page {
              margin: 1.5cm;
              size: A4;
              background: white;
            }
            
            /* Ensure content fits on one page */
            * {
              page-break-inside: avoid !important;
              box-sizing: border-box !important;
            }
            
            /* Override any container backgrounds */
            .MuiContainer-root,
            .MuiBox-root,
            div {
              background: transparent !important;
            }
          }
        `}
      </style>
    </Paper>
  );
};

export default PrintableRabbitSheet;