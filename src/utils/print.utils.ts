import { Animal } from '../models/types';

/**
 * Opens a new window with the printable rabbit sheet and triggers print
 */
export const printRabbitSheet = (animal: Animal): void => {
  // Create the HTML content for the print window
  const printContent = createPrintableSheetHTML(animal);
  
  // Open a new window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    console.error('Could not open print window. Please check popup blockers.');
    return;
  }
  
  // Write the content to the new window
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Wait for the content to load, then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Close the window after printing (optional - user might want to keep it open)
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
};

/**
 * Creates the complete HTML content for the printable rabbit sheet
 */
const createPrintableSheetHTML = (animal: Animal): string => {
  // We'll use a simplified version of the rabbit sheet optimized for printing
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fiche Lapin - ${animal.name || 'Sans nom'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: A6;
      margin: 0.5cm;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 9pt;
      line-height: 1.2;
      color: black;
      background: white;
      width: 105mm;
      max-width: 105mm;
      margin: 0 auto;
      padding: 0.5cm;
    }
    
    .sheet {
      background: white;
      width: 100%;
      max-height: 148mm;
      overflow: hidden;
    }
    
    .header {
      text-align: center;
      margin-bottom: 8pt;
    }
    
    .header h1 {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 2pt;
    }
    
    .header h2 {
      font-size: 12pt;
      margin-bottom: 2pt;
      color: #1976d2;
    }
    
    .header .id {
      font-size: 10pt;
      color: #666;
      margin-bottom: 4pt;
    }
    
    .info-grid {
      display: table;
      width: 100%;
      margin-bottom: 8pt;
    }
    
    .info-row {
      display: table-row;
    }
    
    .info-cell {
      display: table-cell;
      width: 50%;
      padding: 1pt 2pt;
      vertical-align: top;
    }
    
    .info-label {
      font-weight: bold;
      font-size: 8pt;
    }
    
    .info-value {
      font-size: 8pt;
    }
    
    .qr-section {
      text-align: center;
      margin: 8pt 0;
    }
    
    .qr-label {
      font-weight: bold;
      font-size: 9pt;
      margin-bottom: 2pt;
    }
    
    .qr-code {
      margin: 4pt auto;
    }
    
    .footer {
      text-align: center;
      font-size: 7pt;
      color: #666;
      margin-top: 8pt;
      border-top: 1px solid #ddd;
      padding-top: 4pt;
    }
    
    @media print {
      body {
        margin: 0 !important;
        padding: 0.5cm !important;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <h1>FICHE LAPIN</h1>
      <h2>${animal.name || 'Sans nom'}</h2>
      ${animal.identifier ? `<div class="id">ID: ${animal.identifier}</div>` : ''}
    </div>
    
    <div class="info-grid">
      <div class="info-row">
        <div class="info-cell">
          <div class="info-label">Sexe:</div>
          <div class="info-value">${getSexDisplay(animal.sex)}</div>
        </div>
        <div class="info-cell">
          <div class="info-label">Naissance:</div>
          <div class="info-value">${animal.birthDate ? formatDate(animal.birthDate) : 'Non renseignée'}</div>
        </div>
      </div>
      ${animal.breed ? `
      <div class="info-row">
        <div class="info-cell">
          <div class="info-label">Race:</div>
          <div class="info-value">${animal.breed}</div>
        </div>
        <div class="info-cell"></div>
      </div>
      ` : ''}
    </div>
    
    <div class="qr-section">
      <div class="qr-label">Code QR</div>
      <div class="qr-code" id="qr-code"></div>
    </div>
    
    <div class="footer">
      ${formatDate(new Date().toISOString())} • Garenne
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js"></script>
  <script>
    // Generate QR code
    const animalData = ${JSON.stringify({
      id: animal.id,
      name: animal.name,
      identifier: animal.identifier,
      type: 'rabbit_sheet'
    })};
    
    QRCode.toCanvas(document.getElementById('qr-code'), JSON.stringify(animalData), {
      width: 80,
      height: 80,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, function (error) {
      if (error) {
        console.error('QR Code generation failed:', error);
        document.getElementById('qr-code').innerHTML = '<div style="width: 80px; height: 80px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 8pt;">QR Code</div>';
      }
    });
  </script>
</body>
</html>`;
};

/**
 * Helper function to format sex display
 */
const getSexDisplay = (sex: string): string => {
  switch (sex) {
    case 'F': return 'Femelle ♀';
    case 'M': return 'Mâle ♂';
    default: return 'Inconnu';
  }
};

/**
 * Helper function to format dates
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  } catch {
    return dateString;
  }
};