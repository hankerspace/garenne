import { Animal } from '../models/types';
import { GenealogyService, PedigreeNode } from './genealogy.service';

/**
 * Service for generating PDF pedigree charts
 * Uses HTML5 Canvas to draw the pedigree and convert to PDF
 */
export class PedigreePDFService {
  private static readonly CARD_WIDTH = 180;
  private static readonly CARD_HEIGHT = 120;
  private static readonly GENERATION_SPACING = 220;
  private static readonly VERTICAL_SPACING = 140;
  private static readonly MARGIN = 40;

  /**
   * Generate and download a PDF pedigree for an animal
   */
  static async generatePedigreePDF(
    animal: Animal, 
    allAnimals: Animal[], 
    options: {
      generations?: number;
      includeInbreedingCoefficients?: boolean;
      title?: string;
      format?: 'A4' | 'A3' | 'Letter';
    } = {}
  ): Promise<void> {
    const {
      generations = 4,
      includeInbreedingCoefficients = true,
      title = `Pedigree de ${animal.name || animal.identifier || 'Animal sans nom'}`,
      format = 'A4'
    } = options;

    // Get pedigree data
    const pedigreeData = GenealogyService.getPedigreeData(animal, allAnimals, generations);

    // Calculate canvas dimensions based on pedigree structure
    const dimensions = this.calculateCanvasDimensions(pedigreeData, format);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d')!;

    // Set up canvas for high DPI
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * devicePixelRatio;
    canvas.height = dimensions.height * devicePixelRatio;
    canvas.style.width = dimensions.width + 'px';
    canvas.style.height = dimensions.height + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Draw the pedigree
    await this.drawPedigree(ctx, pedigreeData, {
      includeInbreedingCoefficients,
      title,
      canvasWidth: dimensions.width,
      canvasHeight: dimensions.height
    });

    // Convert to PDF and download
    await this.canvasToPDF(canvas, `pedigree-${animal.identifier || animal.id}.pdf`, format);
  }

  /**
   * Calculate required canvas dimensions based on pedigree structure
   */
  private static calculateCanvasDimensions(pedigreeData: PedigreeNode, format: string) {
    const maxGeneration = this.getMaxGeneration(pedigreeData);
    const totalWidth = (maxGeneration + 1) * this.GENERATION_SPACING + 2 * this.MARGIN;
    
    // Calculate height based on the widest generation
    const maxAnimalsInGeneration = this.getMaxAnimalsInGeneration(pedigreeData);
    const totalHeight = maxAnimalsInGeneration * this.VERTICAL_SPACING + 2 * this.MARGIN + 100; // +100 for title and footer

    // Ensure minimum dimensions based on format
    const formatDimensions = this.getFormatDimensions(format);
    
    return {
      width: Math.max(totalWidth, formatDimensions.width),
      height: Math.max(totalHeight, formatDimensions.height)
    };
  }

  /**
   * Get format dimensions in pixels (96 DPI)
   */
  private static getFormatDimensions(format: string) {
    switch (format) {
      case 'A4':
        return { width: 794, height: 1123 }; // 210 × 297 mm at 96 DPI
      case 'A3':
        return { width: 1123, height: 1587 }; // 297 × 420 mm at 96 DPI
      case 'Letter':
        return { width: 816, height: 1056 }; // 8.5 × 11 inches at 96 DPI
      default:
        return { width: 794, height: 1123 };
    }
  }

  /**
   * Get maximum generation number in pedigree
   */
  private static getMaxGeneration(node: PedigreeNode): number {
    let maxGen = node.generation;
    if (node.mother) {
      maxGen = Math.max(maxGen, this.getMaxGeneration(node.mother));
    }
    if (node.father) {
      maxGen = Math.max(maxGen, this.getMaxGeneration(node.father));
    }
    return maxGen;
  }

  /**
   * Get maximum number of animals in any generation
   */
  private static getMaxAnimalsInGeneration(node: PedigreeNode): number {
    const generationCounts = new Map<number, number>();
    
    const countAnimals = (currentNode: PedigreeNode) => {
      const current = generationCounts.get(currentNode.generation) || 0;
      generationCounts.set(currentNode.generation, current + 1);
      
      if (currentNode.mother) countAnimals(currentNode.mother);
      if (currentNode.father) countAnimals(currentNode.father);
    };

    countAnimals(node);
    return Math.max(...Array.from(generationCounts.values()));
  }

  /**
   * Draw the complete pedigree on canvas
   */
  private static async drawPedigree(
    ctx: CanvasRenderingContext2D,
    pedigreeData: PedigreeNode,
    options: {
      includeInbreedingCoefficients: boolean;
      title: string;
      canvasWidth: number;
      canvasHeight: number;
    }
  ): Promise<void> {
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, options.canvasWidth, options.canvasHeight);

    // Draw title
    this.drawTitle(ctx, options.title, options.canvasWidth);

    // Calculate positions for all animals
    const positions = this.calculatePositions(pedigreeData, options.canvasWidth, options.canvasHeight);

    // Draw connection lines first (so they appear behind cards)
    this.drawConnectionLines(ctx, pedigreeData, positions);

    // Draw animal cards
    await this.drawAnimalCards(ctx, pedigreeData, positions, options.includeInbreedingCoefficients);

    // Draw footer with generation information
    this.drawFooter(ctx, pedigreeData, options.canvasWidth, options.canvasHeight);
  }

  /**
   * Draw the title at the top of the canvas
   */
  private static drawTitle(ctx: CanvasRenderingContext2D, title: string, canvasWidth: number) {
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvasWidth / 2, 40);

    // Draw subtitle
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#666666';
    const now = new Date();
    ctx.fillText(`Généré le ${now.toLocaleDateString('fr-FR')}`, canvasWidth / 2, 65);
  }

  /**
   * Calculate positions for all animals in the pedigree
   */
  private static calculatePositions(
    pedigreeData: PedigreeNode,
    canvasWidth: number,
    canvasHeight: number
  ): Map<string, { x: number; y: number }> {
    const positions = new Map<string, { x: number; y: number }>();
    const generationAnimals = new Map<number, PedigreeNode[]>();

    // Collect animals by generation
    const collectByGeneration = (node: PedigreeNode) => {
      const animals = generationAnimals.get(node.generation) || [];
      animals.push(node);
      generationAnimals.set(node.generation, animals);

      if (node.mother) collectByGeneration(node.mother);
      if (node.father) collectByGeneration(node.father);
    };

    collectByGeneration(pedigreeData);

    // Calculate positions for each generation
    generationAnimals.forEach((animals, generation) => {
      const x = this.MARGIN + generation * this.GENERATION_SPACING;
      const totalHeight = animals.length * this.VERTICAL_SPACING;
      const startY = (canvasHeight - totalHeight) / 2 + 100; // +100 for title space

      animals.forEach((animal, index) => {
        const y = startY + index * this.VERTICAL_SPACING;
        positions.set(animal.animal.id, { x, y });
      });
    });

    return positions;
  }

  /**
   * Draw connection lines between related animals
   */
  private static drawConnectionLines(
    ctx: CanvasRenderingContext2D,
    pedigreeData: PedigreeNode,
    positions: Map<string, { x: number; y: number }>
  ) {
    const drawLines = (node: PedigreeNode) => {
      const nodePos = positions.get(node.animal.id);
      if (!nodePos) return;

      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      // Draw line to mother
      if (node.mother) {
        const motherPos = positions.get(node.mother.animal.id);
        if (motherPos) {
          ctx.beginPath();
          ctx.moveTo(nodePos.x + this.CARD_WIDTH, nodePos.y + this.CARD_HEIGHT / 2);
          ctx.lineTo(motherPos.x, motherPos.y + this.CARD_HEIGHT / 2);
          ctx.stroke();
        }
        drawLines(node.mother);
      }

      // Draw line to father
      if (node.father) {
        const fatherPos = positions.get(node.father.animal.id);
        if (fatherPos) {
          ctx.beginPath();
          ctx.moveTo(nodePos.x + this.CARD_WIDTH, nodePos.y + this.CARD_HEIGHT / 2);
          ctx.lineTo(fatherPos.x, fatherPos.y + this.CARD_HEIGHT / 2);
          ctx.stroke();
        }
        drawLines(node.father);
      }
    };

    drawLines(pedigreeData);
  }

  /**
   * Draw animal cards
   */
  private static async drawAnimalCards(
    ctx: CanvasRenderingContext2D,
    pedigreeData: PedigreeNode,
    positions: Map<string, { x: number; y: number }>,
    includeInbreedingCoefficients: boolean
  ) {
    const drawCard = async (node: PedigreeNode) => {
      const pos = positions.get(node.animal.id);
      if (!pos) return;

      const { animal } = node;
      const { x, y } = pos;

      // Draw card background
      ctx.fillStyle = node.generation === 0 ? '#e3f2fd' : '#ffffff';
      ctx.strokeStyle = node.generation === 0 ? '#1976d2' : '#dddddd';
      ctx.lineWidth = node.generation === 0 ? 3 : 1;
      
      this.drawRoundedRect(ctx, x, y, this.CARD_WIDTH, this.CARD_HEIGHT, 8);
      ctx.fill();
      ctx.stroke();

      // Draw sex icon
      const iconSize = 20;
      const iconX = x + 10;
      const iconY = y + 10;
      
      ctx.fillStyle = animal.sex === 'F' ? '#e91e63' : '#2196f3';
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillText(animal.sex === 'F' ? '♀' : '♂', iconX, iconY + 15);

      // Draw name
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.textAlign = 'left';
      const name = animal.name || 'Sans nom';
      const truncatedName = name.length > 15 ? name.substring(0, 12) + '...' : name;
      ctx.fillText(truncatedName, iconX + 25, iconY + 15);

      // Draw identifier
      ctx.font = '12px Arial, sans-serif';
      ctx.fillStyle = '#666666';
      const identifier = animal.identifier || animal.id.slice(0, 8);
      ctx.fillText(identifier, iconX, iconY + 35);

      // Draw breed
      if (animal.breed) {
        ctx.fillText(animal.breed, iconX, iconY + 50);
      }

      // Draw status
      const statusColor = this.getStatusColor(animal.status);
      ctx.fillStyle = statusColor;
      ctx.font = '10px Arial, sans-serif';
      ctx.fillText(this.getStatusLabel(animal.status), iconX, iconY + 65);

      // Draw inbreeding coefficient if requested
      if (includeInbreedingCoefficients && node.inbreedingCoefficient > 0) {
        ctx.fillStyle = node.inbreedingCoefficient > 0.0625 ? '#d32f2f' : '#ff9800';
        ctx.font = 'bold 10px Arial, sans-serif';
        ctx.fillText(`F: ${(node.inbreedingCoefficient * 100).toFixed(1)}%`, iconX, iconY + 80);
      }

      // Draw generation label
      ctx.fillStyle = '#999999';
      ctx.font = '9px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`G${node.generation}`, x + this.CARD_WIDTH - 10, y + 20);

      // Recursively draw parent cards
      if (node.mother) await drawCard(node.mother);
      if (node.father) await drawCard(node.father);
    };

    await drawCard(pedigreeData);
  }

  /**
   * Draw footer with legend and statistics
   */
  private static drawFooter(
    ctx: CanvasRenderingContext2D,
    pedigreeData: PedigreeNode,
    canvasWidth: number,
    canvasHeight: number
  ) {
    const footerY = canvasHeight - 60;
    
    // Draw legend
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial, sans-serif';
    ctx.textAlign = 'left';
    
    let legendX = this.MARGIN;
    ctx.fillText('♀ Femelle', legendX, footerY);
    legendX += 80;
    ctx.fillText('♂ Mâle', legendX, footerY);
    legendX += 80;
    ctx.fillText('F: Coefficient de consanguinité', legendX, footerY);

    // Draw generation count
    const maxGen = this.getMaxGeneration(pedigreeData);
    ctx.textAlign = 'right';
    ctx.fillText(`${maxGen + 1} générations affichées`, canvasWidth - this.MARGIN, footerY);

    // Draw line above footer
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.MARGIN, footerY - 20);
    ctx.lineTo(canvasWidth - this.MARGIN, footerY - 20);
    ctx.stroke();
  }

  /**
   * Draw rounded rectangle
   */
  private static drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Convert canvas to PDF and trigger download
   */
  private static async canvasToPDF(canvas: HTMLCanvasElement, filename: string, format: string) {
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
    });

    // For now, download as PNG since we don't have a PDF library
    // In a real implementation, you would use a library like jsPDF
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.pdf', '.png'); // Download as PNG for now
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get status color for display
   */
  private static getStatusColor(status: string): string {
    switch (status) {
      case 'REPRO': return '#4caf50';
      case 'GROW': return '#2196f3';
      case 'RETIRED': return '#ff9800';
      case 'DEAD': return '#f44336';
      case 'CONSUMED': return '#9c27b0';
      default: return '#757575';
    }
  }

  /**
   * Get status label for display
   */
  private static getStatusLabel(status: string): string {
    switch (status) {
      case 'REPRO': return 'Reproducteur';
      case 'GROW': return 'Croissance';
      case 'RETIRED': return 'Retraité';
      case 'DEAD': return 'Décédé';
      case 'CONSUMED': return 'Consommé';
      default: return status;
    }
  }
}