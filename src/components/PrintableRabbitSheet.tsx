import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper
} from '@mui/material';
import { Animal, Sex, Status } from '../models/types';
import { formatDate, calculateAgeText } from '../utils/dates';
import { useAppStore } from '../state/store';
import QRCodeDisplay from './QRCodeDisplay';
import { useTranslation } from '../hooks/useTranslation';

interface PrintableRabbitSheetProps {
  animal: Animal;
}

const PrintableRabbitSheet: React.FC<PrintableRabbitSheetProps> = ({ animal }) => {
  const { t } = useTranslation();
  const cages = useAppStore((state) => state.cages);
  
  const getSexDisplay = (sex: Sex) => {
    switch (sex) {
      case Sex.Female: return `${t('sex.F')} ♀`;
      case Sex.Male: return `${t('sex.M')} ♂`;
      default: return t('sex.U');
    }
  };

  const getStatusDisplay = (status: Status) => {
    return t(`status.${status}`);
  };

  return (
    <Paper 
      sx={{ 
        p: 1.5, 
        maxWidth: '105mm', 
        maxHeight: '148mm',
        margin: 'auto',
        backgroundColor: 'white',
        color: 'black',
        overflow: 'hidden',
        '@media print': {
          boxShadow: 'none',
          margin: 0,
          padding: '0.5cm',
          fontSize: '9pt',
          maxHeight: 'none',
          pageBreakInside: 'avoid'
        }
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={1} sx={{ '@media print': { mb: 0.5 } }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          '@media print': { fontSize: '14pt', mb: 0.25 }
        }}>
          FICHE LAPIN
        </Typography>
        <Typography variant="h6" component="h2" color="primary" gutterBottom sx={{
          '@media print': { fontSize: '12pt', mb: 0.25 }
        }}>
          {animal.name || 'Sans nom'}
        </Typography>
        {animal.identifier && (
          <Typography variant="body2" color="text.secondary" sx={{
            '@media print': { fontSize: '10pt', mb: 0.5 }
          }}>
            ID: {animal.identifier}
          </Typography>
        )}
      </Box>

      {/* Single column layout for A6 */}
      <Box sx={{ '@media print': { spacing: 0.5 } }}>
        {/* Essential Information - Compact */}
        <Box mb={1}>
          <Grid container spacing={1} sx={{ '@media print': { spacing: 0.25 } }}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', '@media print': { fontSize: '8pt' } }}>
                {t('animals.sex')}:
              </Typography>
              <Typography variant="body2" sx={{ '@media print': { fontSize: '8pt' } }}>
                {getSexDisplay(animal.sex)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', '@media print': { fontSize: '8pt' } }}>
                {t('animals.birthDate')}:
              </Typography>
              <Typography variant="body2" sx={{ '@media print': { fontSize: '8pt' } }}>
                {animal.birthDate ? formatDate(animal.birthDate) : t('printableSheet.notSpecified')}
              </Typography>
            </Grid>
            {animal.breed && (
              <>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', '@media print': { fontSize: '8pt' } }}>
                    {t('animals.breed')}:
                  </Typography>
                  <Typography variant="body2" sx={{ '@media print': { fontSize: '8pt' } }}>
                    {animal.breed}
                  </Typography>
                </Grid>
              </>
            )}
            {animal.cage && (
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', '@media print': { fontSize: '8pt' } }}>
                  {t('animals.cage')}:
                </Typography>
                <Typography variant="body2" sx={{ '@media print': { fontSize: '8pt' } }}>
                  {cages.find(c => c.id === animal.cage)?.name || t('printableSheet.unknownCage')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* QR Code - Centered and sized for A6 */}
        <Box textAlign="center" mt={1}>
          <Typography variant="body2" gutterBottom sx={{ 
            fontWeight: 'bold', 
            '@media print': { fontSize: '9pt', mb: 0.25 } 
          }}>
            Code QR
          </Typography>
          <Box display="flex" justifyContent="center">
            <QRCodeDisplay animal={animal} size="medium" variant="print" />
          </Box>
        </Box>
      </Box>

      {/* Compact Footer */}
      <Box textAlign="center" mt={1} sx={{ '@media print': { mt: 0.5 } }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          '@media print': { fontSize: '7pt' } 
        }}>
          {formatDate(new Date().toISOString())} • Garenne
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
            
            /* Page setup for A6 single page */
            @page {
              margin: 0.5cm;
              size: A6;
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