import { AppState } from '../models/types';

interface ExportFormat {
  json: string;
  csv: string;
  excel: Blob;
}

export class ExportService {
  static exportToJSON(data: AppState): string {
    return JSON.stringify(data, null, 2);
  }

  static exportToCSV(data: AppState): string {
    const csvSections: string[] = [];

    // Export animals
    if (data.animals.length > 0) {
      csvSections.push('=== ANIMALS ===');
      const animalHeaders = ['ID', 'Name', 'Identifier', 'Sex', 'Breed', 'Birth Date', 'Origin', 'Mother ID', 'Father ID', 'Cage', 'Status', 'Tags', 'Consumed Date', 'Consumed Weight', 'Notes'];
      csvSections.push(animalHeaders.join(','));
      
      data.animals.forEach(animal => {
        const row = [
          animal.id,
          animal.name || '',
          animal.identifier || '',
          animal.sex,
          animal.breed || '',
          animal.birthDate || '',
          animal.origin || '',
          animal.motherId || '',
          animal.fatherId || '',
          animal.cage || '',
          animal.status,
          animal.tags?.join(';') || '',
          animal.consumedDate || '',
          animal.consumedWeight?.toString() || '',
          animal.notes || ''
        ].map(field => `"${field.toString().replace(/"/g, '""')}"`);
        csvSections.push(row.join(','));
      });
      csvSections.push('');
    }

    // Export weights
    if (data.weights.length > 0) {
      csvSections.push('=== WEIGHTS ===');
      const weightHeaders = ['ID', 'Animal ID', 'Date', 'Weight (g)', 'Notes'];
      csvSections.push(weightHeaders.join(','));
      
      data.weights.forEach(weight => {
        const row = [
          weight.id,
          weight.animalId,
          weight.date,
          weight.weightGrams.toString(),
          weight.notes || ''
        ].map(field => `"${field.toString().replace(/"/g, '""')}"`);
        csvSections.push(row.join(','));
      });
      csvSections.push('');
    }

    // Export litters
    if (data.litters.length > 0) {
      csvSections.push('=== LITTERS ===');
      const litterHeaders = ['ID', 'Mother ID', 'Father ID', 'Kindling Date', 'Born Alive', 'Stillborn', 'Weaning Date', 'Weaned Count', 'Notes'];
      csvSections.push(litterHeaders.join(','));
      
      data.litters.forEach(litter => {
        const row = [
          litter.id,
          litter.motherId,
          litter.fatherId || '',
          litter.kindlingDate,
          litter.bornAlive.toString(),
          litter.stillborn.toString(),
          litter.weaningDate || '',
          litter.weanedCount?.toString() || '',
          litter.notes || ''
        ].map(field => `"${field.toString().replace(/"/g, '""')}"`);
        csvSections.push(row.join(','));
      });
      csvSections.push('');
    }

    // Export treatments
    if (data.treatments.length > 0) {
      csvSections.push('=== TREATMENTS ===');
      const treatmentHeaders = ['ID', 'Animal ID', 'Date', 'Product', 'Lot Number', 'Dose', 'Route', 'Reason', 'Withdrawal Until', 'Notes'];
      csvSections.push(treatmentHeaders.join(','));
      
      data.treatments.forEach(treatment => {
        const row = [
          treatment.id,
          treatment.animalId,
          treatment.date,
          treatment.product,
          treatment.lotNumber || '',
          treatment.dose || '',
          treatment.route || '',
          treatment.reason || '',
          treatment.withdrawalUntil || '',
          treatment.notes || ''
        ].map(field => `"${field.toString().replace(/"/g, '""')}"`);
        csvSections.push(row.join(','));
      });
      csvSections.push('');
    }

    // Export cages
    if (data.cages.length > 0) {
      csvSections.push('=== CAGES ===');
      const cageHeaders = ['ID', 'Name', 'Description', 'Capacity', 'Location', 'Notes'];
      csvSections.push(cageHeaders.join(','));
      
      data.cages.forEach(cage => {
        const row = [
          cage.id,
          cage.name,
          cage.description || '',
          cage.capacity?.toString() || '',
          cage.location || '',
          cage.notes || ''
        ].map(field => `"${field.toString().replace(/"/g, '""')}"`);
        csvSections.push(row.join(','));
      });
      csvSections.push('');
    }

    // Export tags
    if (data.tags.length > 0) {
      csvSections.push('=== TAGS ===');
      const tagHeaders = ['ID', 'Name', 'Color', 'Description'];
      csvSections.push(tagHeaders.join(','));
      
      data.tags.forEach(tag => {
        const row = [
          tag.id,
          tag.name,
          tag.color || '',
          tag.description || ''
        ].map(field => `"${field.toString().replace(/"/g, '""')}"`);
        csvSections.push(row.join(','));
      });
      csvSections.push('');
    }

    return csvSections.join('\n');
  }

  static exportToExcel(data: AppState): Blob {
    // For now, return CSV as a blob until we add a proper Excel library
    const csvData = this.exportToCSV(data);
    return new Blob([csvData], { type: 'application/vnd.ms-excel' });
  }

  static downloadFile(content: string | Blob, filename: string, type: 'text/plain' | 'text/csv' | 'application/json' | 'application/vnd.ms-excel') {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}