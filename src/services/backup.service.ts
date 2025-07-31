import { saveAs } from 'file-saver';
import { BackupFile, AppState } from '../models/types';
import { formatDate } from '../utils/dates';

export interface BackupService {
  exportData(state: AppState): void;
  importData(file: File): Promise<BackupFile>;
  validateBackupFile(data: unknown): BackupFile;
}

export class LocalBackupService implements BackupService {
  exportData(state: AppState): void {
    const backupData: BackupFile = {
      schemaVersion: state.settings.schemaVersion,
      exportedAt: new Date().toISOString(),
      animals: state.animals,
      breedings: state.breedings,
      litters: state.litters,
      weights: state.weights,
      treatments: state.treatments,
      mortalities: state.mortalities,
      settings: state.settings,
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const timestamp = formatDate(new Date(), 'yyyyMMdd-HHmm');
    const filename = `backup-${timestamp}.json`;
    
    saveAs(blob, filename);
  }

  async importData(file: File): Promise<BackupFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);
          const validatedData = this.validateBackupFile(data);
          resolve(validatedData);
        } catch (error) {
          reject(new Error('Fichier de sauvegarde invalide: ' + (error as Error).message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      reader.readAsText(file);
    });
  }

  validateBackupFile(data: unknown): BackupFile {
    // Basic structure validation
    if (!data || typeof data !== 'object') {
      throw new Error('Format de fichier invalide');
    }

    const requiredFields = ['schemaVersion', 'exportedAt', 'animals', 'breedings', 'litters', 'weights', 'treatments', 'mortalities', 'settings'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Champ manquant: ${field}`);
      }
    }

    // Validate schema version
    if (typeof data.schemaVersion !== 'number' || data.schemaVersion < 1) {
      throw new Error('Version de schéma invalide');
    }

    // Validate arrays
    const arrayFields = ['animals', 'breedings', 'litters', 'weights', 'treatments', 'mortalities'];
    for (const field of arrayFields) {
      if (!Array.isArray(data[field])) {
        throw new Error(`${field} doit être un tableau`);
      }
    }

    // Validate export date
    if (!data.exportedAt || isNaN(Date.parse(data.exportedAt))) {
      throw new Error('Date d\'export invalide');
    }

    return data as BackupFile;
  }

  generateImportSummary(backupData: BackupFile, currentState: AppState): ImportSummary {
    return {
      schemaVersion: backupData.schemaVersion,
      exportedAt: backupData.exportedAt,
      counts: {
        animals: backupData.animals.length,
        breedings: backupData.breedings.length,
        litters: backupData.litters.length,
        weights: backupData.weights.length,
        treatments: backupData.treatments.length,
        mortalities: backupData.mortalities.length,
      },
      currentCounts: {
        animals: currentState.animals.length,
        breedings: currentState.breedings.length,
        litters: currentState.litters.length,
        weights: currentState.weights.length,
        treatments: currentState.treatments.length,
        mortalities: currentState.mortalities.length,
      },
      canImport: backupData.schemaVersion <= currentState.settings.schemaVersion,
    };
  }

  mergeData(backupData: BackupFile, currentState: AppState): AppState {
    // Create maps of existing items by ID
    const existingAnimals = new Map(currentState.animals.map(a => [a.id, a]));
    const existingBreedings = new Map(currentState.breedings.map(b => [b.id, b]));
    const existingLitters = new Map(currentState.litters.map(l => [l.id, l]));
    const existingWeights = new Map(currentState.weights.map(w => [w.id, w]));
    const existingTreatments = new Map(currentState.treatments.map(t => [t.id, t]));
    const existingMortalities = new Map(currentState.mortalities.map(m => [m.id, m]));

    // Merge animals (update existing, add new)
    backupData.animals.forEach(animal => {
      existingAnimals.set(animal.id, animal);
    });

    // Merge other entities
    backupData.breedings.forEach(breeding => {
      existingBreedings.set(breeding.id, breeding);
    });

    backupData.litters.forEach(litter => {
      existingLitters.set(litter.id, litter);
    });

    backupData.weights.forEach(weight => {
      existingWeights.set(weight.id, weight);
    });

    backupData.treatments.forEach(treatment => {
      existingTreatments.set(treatment.id, treatment);
    });

    backupData.mortalities.forEach(mortality => {
      existingMortalities.set(mortality.id, mortality);
    });

    return {
      animals: Array.from(existingAnimals.values()),
      breedings: Array.from(existingBreedings.values()),
      litters: Array.from(existingLitters.values()),
      weights: Array.from(existingWeights.values()),
      treatments: Array.from(existingTreatments.values()),
      mortalities: Array.from(existingMortalities.values()),
      settings: {
        ...currentState.settings,
        ...backupData.settings,
        schemaVersion: currentState.settings.schemaVersion, // Keep current schema version
      },
    };
  }

  replaceData(backupData: BackupFile): AppState {
    return {
      animals: backupData.animals,
      breedings: backupData.breedings,
      litters: backupData.litters,
      weights: backupData.weights,
      treatments: backupData.treatments,
      mortalities: backupData.mortalities,
      settings: backupData.settings,
    };
  }
}

export interface ImportSummary {
  schemaVersion: number;
  exportedAt: string;
  counts: {
    animals: number;
    breedings: number;
    litters: number;
    weights: number;
    treatments: number;
    mortalities: number;
  };
  currentCounts: {
    animals: number;
    breedings: number;
    litters: number;
    weights: number;
    treatments: number;
    mortalities: number;
  };
  canImport: boolean;
}

// Singleton instance
export const backupService = new LocalBackupService();