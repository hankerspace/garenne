import { Animal, Breeding, Litter, WeightRecord, Treatment, Mortality, Sex, Status } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export interface ImportValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportPreview {
  totalRows: number;
  validRows: number;
  errors: ImportValidationError[];
  warnings: ImportValidationError[];
  preview: {
    animals: Animal[];
    weights: WeightRecord[];
    treatments: Treatment[];
    breedings: Breeding[];
    litters: Litter[];
    mortalities: Mortality[];
  };
  duplicates: {
    byIdentifier: Animal[];
    byName: Animal[];
  };
}

export interface ImportResult {
  success: boolean;
  imported: {
    animals: number;
    weights: number;
    treatments: number;
    breedings: number;
    litters: number;
    mortalities: number;
  };
  errors: ImportValidationError[];
  duplicatesHandled: {
    skipped: number;
    updated: number;
  };
}

export class BatchImportService {
  /**
   * Parse CSV file content into structured data
   */
  static parseCSV(content: string): Record<string, any>[] {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length < 2) {
      throw new Error('Le fichier CSV doit contenir au moins une ligne d\'en-tête et une ligne de données');
    }

    const headers = this.parseCSVLine(lines[0]);
    const rows: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        throw new Error(`Ligne ${i + 1}: Nombre de colonnes incorrect (attendu: ${headers.length}, trouvé: ${values.length})`);
      }

      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || null;
      });
      rows.push(row);
    }

    return rows;
  }

  /**
   * Parse a single CSV line, handling quoted values
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      
      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        if (line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
      i++;
    }
    
    result.push(current);
    return result;
  }

  /**
   * Validate and preview import data
   */
  static validateImport(
    rows: Record<string, any>[],
    existingAnimals: Animal[],
    options: {
      duplicateHandling: 'skip' | 'update' | 'error';
      validateRelationships: boolean;
    }
  ): ImportPreview {
    const errors: ImportValidationError[] = [];
    const warnings: ImportValidationError[] = [];
    const validAnimals: Animal[] = [];
    const validWeights: WeightRecord[] = [];
    const validTreatments: Treatment[] = [];
    const validBreedings: Breeding[] = [];
    const validLitters: Litter[] = [];
    const validMortalities: Mortality[] = [];
    
    const duplicatesByIdentifier: Animal[] = [];
    const duplicatesByName: Animal[] = [];
    const existingIdentifiers = new Set(existingAnimals.map(a => a.identifier).filter(Boolean));
    const existingNames = new Set(existingAnimals.map(a => a.name).filter(Boolean));

    rows.forEach((row, index) => {
      const rowNum = index + 1;
      
      try {
        // Validate required fields
        if (!row.name && !row.identifier) {
          errors.push({
            row: rowNum,
            field: 'name/identifier',
            value: null,
            message: 'Au moins un nom ou un identifiant est requis',
            severity: 'error'
          });
          return;
        }

        // Validate sex
        if (!row.sex || !Object.values(Sex).includes(row.sex)) {
          errors.push({
            row: rowNum,
            field: 'sex',
            value: row.sex,
            message: `Sexe invalide. Valeurs acceptées: ${Object.values(Sex).join(', ')}`,
            severity: 'error'
          });
          return;
        }

        // Validate status
        if (!row.status || !Object.values(Status).includes(row.status)) {
          errors.push({
            row: rowNum,
            field: 'status',
            value: row.status,
            message: `Statut invalide. Valeurs acceptées: ${Object.values(Status).join(', ')}`,
            severity: 'error'
          });
          return;
        }

        // Validate birth date
        if (row.birthDate && isNaN(Date.parse(row.birthDate))) {
          errors.push({
            row: rowNum,
            field: 'birthDate',
            value: row.birthDate,
            message: 'Date de naissance invalide (format attendu: YYYY-MM-DD)',
            severity: 'error'
          });
        }

        // Check duplicates
        if (row.identifier && existingIdentifiers.has(row.identifier)) {
          duplicatesByIdentifier.push(this.createAnimalFromRow(row, rowNum));
          if (options.duplicateHandling === 'error') {
            errors.push({
              row: rowNum,
              field: 'identifier',
              value: row.identifier,
              message: `Identifiant déjà existant: ${row.identifier}`,
              severity: 'error'
            });
          } else {
            warnings.push({
              row: rowNum,
              field: 'identifier',
              value: row.identifier,
              message: `Identifiant déjà existant: ${row.identifier} (sera ${options.duplicateHandling === 'skip' ? 'ignoré' : 'mis à jour'})`,
              severity: 'warning'
            });
          }
        }

        if (row.name && existingNames.has(row.name)) {
          duplicatesByName.push(this.createAnimalFromRow(row, rowNum));
          warnings.push({
            row: rowNum,
            field: 'name',
            value: row.name,
            message: `Nom déjà existant: ${row.name}`,
            severity: 'warning'
          });
        }

        // Validate relationships if requested
        if (options.validateRelationships) {
          if (row.motherId && !existingAnimals.find(a => a.id === row.motherId)) {
            warnings.push({
              row: rowNum,
              field: 'motherId',
              value: row.motherId,
              message: `Mère non trouvée: ${row.motherId}`,
              severity: 'warning'
            });
          }

          if (row.fatherId && !existingAnimals.find(a => a.id === row.fatherId)) {
            warnings.push({
              row: rowNum,
              field: 'fatherId',
              value: row.fatherId,
              message: `Père non trouvé: ${row.fatherId}`,
              severity: 'warning'
            });
          }
        }

        // If no errors, create valid animal
        if (!errors.some(e => e.row === rowNum && e.severity === 'error')) {
          validAnimals.push(this.createAnimalFromRow(row, rowNum));
        }

      } catch (error) {
        errors.push({
          row: rowNum,
          field: 'general',
          value: null,
          message: `Erreur de traitement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          severity: 'error'
        });
      }
    });

    return {
      totalRows: rows.length,
      validRows: validAnimals.length,
      errors,
      warnings,
      preview: {
        animals: validAnimals.slice(0, 10), // Preview first 10 valid animals
        weights: validWeights,
        treatments: validTreatments,
        breedings: validBreedings,
        litters: validLitters,
        mortalities: validMortalities,
      },
      duplicates: {
        byIdentifier: duplicatesByIdentifier,
        byName: duplicatesByName,
      },
    };
  }

  /**
   * Create an Animal object from a CSV row
   */
  private static createAnimalFromRow(row: Record<string, any>, rowNum: number): Animal {
    const now = new Date().toISOString();
    
    return {
      id: uuidv4(),
      name: row.name || undefined,
      identifier: row.identifier || undefined,
      sex: row.sex as Sex,
      breed: row.breed || undefined,
      birthDate: row.birthDate || undefined,
      origin: row.origin as 'BORN_HERE' | 'PURCHASED' || undefined,
      motherId: row.motherId || undefined,
      fatherId: row.fatherId || undefined,
      cage: row.cage || undefined,
      status: row.status as Status,
      notes: row.notes || undefined,
      tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
      consumedDate: row.consumedDate || undefined,
      consumedWeight: row.consumedWeight ? parseFloat(row.consumedWeight) : undefined,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Execute the import with the validated data
   */
  static executeImport(
    preview: ImportPreview,
    existingAnimals: Animal[],
    options: {
      duplicateHandling: 'skip' | 'update';
      addTags: string[];
    }
  ): ImportResult {
    const result: ImportResult = {
      success: true,
      imported: {
        animals: 0,
        weights: 0,
        treatments: 0,
        breedings: 0,
        litters: 0,
        mortalities: 0,
      },
      errors: [],
      duplicatesHandled: {
        skipped: 0,
        updated: 0,
      },
    };

    // Process animals
    const existingByIdentifier = new Map(existingAnimals.map(a => [a.identifier, a]));
    const animalsToImport: Animal[] = [];

    preview.preview.animals.forEach(animal => {
      // Handle duplicates
      if (animal.identifier && existingByIdentifier.has(animal.identifier)) {
        if (options.duplicateHandling === 'skip') {
          result.duplicatesHandled.skipped++;
          return;
        } else if (options.duplicateHandling === 'update') {
          const existing = existingByIdentifier.get(animal.identifier)!;
          animal.id = existing.id; // Keep existing ID
          animal.createdAt = existing.createdAt; // Keep creation date
          result.duplicatesHandled.updated++;
        }
      }

      // Add import tags if specified
      if (options.addTags.length > 0) {
        animal.tags = [...(animal.tags || []), ...options.addTags];
      }

      animalsToImport.push(animal);
    });

    result.imported.animals = animalsToImport.length;
    result.success = preview.errors.length === 0;

    return result;
  }

  /**
   * Generate import template CSV
   */
  static generateTemplate(): string {
    const headers = [
      'name',
      'identifier',
      'sex',
      'breed',
      'birthDate',
      'origin',
      'motherId',
      'fatherId',
      'cage',
      'status',
      'notes',
      'tags',
      'consumedDate',
      'consumedWeight'
    ];

    const exampleRow = [
      'Lapin Example',
      'EX001',
      Sex.Male,
      'Rex',
      '2024-01-15',
      'BORN_HERE',
      '',
      '',
      'A1',
      Status.Grow,
      'Notes exemple',
      'tag1,tag2',
      '',
      ''
    ];

    return [
      headers.join(','),
      exampleRow.join(','),
      '// Autres lignes...'
    ].join('\n');
  }
}