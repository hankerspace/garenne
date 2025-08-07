import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi, beforeEach, describe } from 'vitest';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { Animal, Sex, Status } from '../models/types';
import { QRCodeService } from '../services/qrcode.service';

// Mock the QRCodeService
vi.mock('../services/qrcode.service', () => ({
  QRCodeService: {
    generateQRCode: vi.fn(),
    generatePrintQRCode: vi.fn(),
  },
}));

const mockAnimal: Animal = {
  id: 'test-id',
  name: 'Test Rabbit',
  identifier: 'TR001',
  birthDate: '2023-01-01T00:00:00.000Z',
  sex: Sex.Male,
  breed: 'Test Breed',
  status: Status.Reproducer,
  cage: 'A1',
  tags: [],
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

describe('QRCodeDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows loading spinner initially', () => {
    vi.mocked(QRCodeService.generateQRCode).mockImplementation(() => new Promise(() => {}));
    
    render(<QRCodeDisplay animal={mockAnimal} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays QR code when generation succeeds', async () => {
    const mockQRCodeUrl = 'data:image/png;base64,mock-qr-code';
    vi.mocked(QRCodeService.generateQRCode).mockResolvedValue(mockQRCodeUrl);
    
    render(<QRCodeDisplay animal={mockAnimal} />);
    
    await waitFor(() => {
      const img = screen.getByAltText('QR Code pour Test Rabbit');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockQRCodeUrl);
    });
  });

  test('shows error when QR code generation fails', async () => {
    const errorMessage = 'Failed to generate QR code';
    vi.mocked(QRCodeService.generateQRCode).mockRejectedValue(new Error(errorMessage));
    
    render(<QRCodeDisplay animal={mockAnimal} />);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('uses print variant when specified', async () => {
    const mockQRCodeUrl = 'data:image/png;base64,mock-print-qr-code';
    vi.mocked(QRCodeService.generatePrintQRCode).mockResolvedValue(mockQRCodeUrl);
    
    render(<QRCodeDisplay animal={mockAnimal} variant="print" />);
    
    await waitFor(() => {
      expect(QRCodeService.generatePrintQRCode).toHaveBeenCalledWith(mockAnimal);
      expect(QRCodeService.generateQRCode).not.toHaveBeenCalled();
    });
  });

  test('handles different sizes correctly', () => {
    vi.mocked(QRCodeService.generateQRCode).mockImplementation(() => new Promise(() => {}));
    
    const { rerender } = render(<QRCodeDisplay animal={mockAnimal} size="small" />);
    let container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveStyle({ width: '80px', height: '80px' });

    rerender(<QRCodeDisplay animal={mockAnimal} size="large" />);
    container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveStyle({ width: '200px', height: '200px' });
  });

  test('regenerates QR code when animal changes', async () => {
    const mockQRCodeUrl = 'data:image/png;base64,mock-qr-code';
    vi.mocked(QRCodeService.generateQRCode).mockResolvedValue(mockQRCodeUrl);
    
    const { rerender } = render(<QRCodeDisplay animal={mockAnimal} />);
    
    await waitFor(() => {
      expect(QRCodeService.generateQRCode).toHaveBeenCalledTimes(1);
    });

    const updatedAnimal = { ...mockAnimal, name: 'Updated Rabbit' };
    rerender(<QRCodeDisplay animal={updatedAnimal} />);
    
    await waitFor(() => {
      expect(QRCodeService.generateQRCode).toHaveBeenCalledTimes(2);
      expect(QRCodeService.generateQRCode).toHaveBeenLastCalledWith(updatedAnimal);
    });
  });

  test('uses animal identifier as alt text fallback when name is not available', async () => {
    const mockQRCodeUrl = 'data:image/png;base64,mock-qr-code';
    vi.mocked(QRCodeService.generateQRCode).mockResolvedValue(mockQRCodeUrl);
    
    const animalWithoutName = { ...mockAnimal, name: undefined };
    render(<QRCodeDisplay animal={animalWithoutName} />);
    
    await waitFor(() => {
      const img = screen.getByAltText('QR Code pour TR001');
      expect(img).toBeInTheDocument();
    });
  });
});