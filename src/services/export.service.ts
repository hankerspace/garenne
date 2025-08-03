import { AppState } from '../models/types';
import { I18nService } from './i18n.service';

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
      csvSections.push(`=== ${I18nService.t('export.animals')} ===`);
      const animalHeaders = [
        I18nService.t('export.headers.id'),
        I18nService.t('export.headers.name'),
        I18nService.t('export.headers.identifier'),
        I18nService.t('export.headers.sex'),
        I18nService.t('export.headers.breed'),
        I18nService.t('export.headers.birthDate'),
        I18nService.t('export.headers.origin'),
        I18nService.t('export.headers.motherId'),
        I18nService.t('export.headers.fatherId'),
        I18nService.t('export.headers.cage'),
        I18nService.t('export.headers.status'),
        I18nService.t('export.headers.tags'),
        I18nService.t('export.headers.consumedDate'),
        I18nService.t('export.headers.consumedWeight'),
        I18nService.t('export.headers.notes')
      ];
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
      csvSections.push(`=== ${I18nService.t('export.weights')} ===`);
      const weightHeaders = [
        I18nService.t('export.headers.id'),
        I18nService.t('export.headers.animalId'),
        I18nService.t('export.headers.date'),
        I18nService.t('export.headers.weight'),
        I18nService.t('export.headers.notes')
      ];
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
      csvSections.push(`=== ${I18nService.t('export.litters')} ===`);
      const litterHeaders = [
        I18nService.t('export.headers.id'),
        I18nService.t('export.headers.motherId'),
        I18nService.t('export.headers.fatherId'),
        I18nService.t('export.headers.kindlingDate'),
        I18nService.t('export.headers.bornAlive'),
        I18nService.t('export.headers.stillborn'),
        I18nService.t('export.headers.weaningDate'),
        I18nService.t('export.headers.weanedCount'),
        I18nService.t('export.headers.notes')
      ];
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
      csvSections.push(`=== ${I18nService.t('export.treatments')} ===`);
      const treatmentHeaders = [
        I18nService.t('export.headers.id'),
        I18nService.t('export.headers.animalId'),
        I18nService.t('export.headers.date'),
        I18nService.t('export.headers.product'),
        I18nService.t('export.headers.lotNumber'),
        I18nService.t('export.headers.dose'),
        I18nService.t('export.headers.route'),
        I18nService.t('export.headers.reason'),
        I18nService.t('export.headers.withdrawalUntil'),
        I18nService.t('export.headers.notes')
      ];
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
      csvSections.push(`=== ${I18nService.t('export.cages')} ===`);
      const cageHeaders = [
        I18nService.t('export.headers.id'),
        I18nService.t('export.headers.name'),
        I18nService.t('export.headers.description'),
        I18nService.t('export.headers.capacity'),
        I18nService.t('export.headers.location'),
        I18nService.t('export.headers.notes')
      ];
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
      csvSections.push(`=== ${I18nService.t('export.tags')} ===`);
      const tagHeaders = [
        I18nService.t('export.headers.id'),
        I18nService.t('export.headers.name'),
        I18nService.t('export.headers.color'),
        I18nService.t('export.headers.description')
      ];
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