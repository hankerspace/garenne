import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { Animal } from '../models/types';
import { QRCodeService } from '../services/qrcode.service';

interface QRCodeDisplayProps {
  animal: Animal;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'print';
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  animal, 
  size = 'medium',
  variant = 'default'
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sizeMap = {
    small: 80,
    medium: 120,
    large: 200
  };

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const qrCode = variant === 'print' 
          ? await QRCodeService.generatePrintQRCode(animal)
          : await QRCodeService.generateQRCode(animal);
          
        setQrCodeUrl(qrCode);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code');
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [animal.id, variant]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        width={sizeMap[size]}
        height={sizeMap[size]}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        width={sizeMap[size]}
        height={sizeMap[size]}
      >
        <Alert severity="error" sx={{ fontSize: '0.75rem', p: 1 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!qrCodeUrl) {
    return null;
  }

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      width={sizeMap[size]}
      height={sizeMap[size]}
    >
      <img 
        src={qrCodeUrl} 
        alt={`QR Code pour ${animal.name || animal.identifier || 'animal'}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </Box>
  );
};

export default QRCodeDisplay;