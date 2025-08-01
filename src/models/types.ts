export type UUID = string;

export enum Sex {
  Male = 'M',
  Female = 'F',
  Unknown = 'U'
}

export enum Status {
  Reproducer = 'REPRO',
  Grow = 'GROW',
  Retired = 'RETIRED',
  Deceased = 'DEAD',
  Consumed = 'CONSUMED' // For animals slaughtered for consumption
}

export enum BreedingMethod {
  Natural = 'NAT',
  AI = 'AI'
}

export enum Route {
  Oral = 'ORAL',
  SC = 'SC',
  IM = 'IM',
  Other = 'OTHER'
}

export interface Animal {
  id: UUID;
  name?: string;
  identifier?: string; // tatouage/QR facultatif
  sex: Sex;
  breed?: string;
  birthDate?: string; // ISO date string
  origin?: 'BORN_HERE' | 'PURCHASED';
  motherId?: UUID;
  fatherId?: UUID;
  cage?: string;
  status: Status;
  notes?: string;
  tags?: string[]; // System for custom labels/tags
  consumedDate?: string; // Date when animal was consumed (if status is CONSUMED)
  consumedWeight?: number; // Weight at consumption (grams)
  createdAt: string;
  updatedAt: string;
}

export interface Breeding {
  id: UUID;
  femaleId: UUID;
  maleId?: UUID;
  method: BreedingMethod;
  date: string; // ISO date string
  notes?: string;
  diagnosis?: 'PREGNANT' | 'NOT_PREGNANT' | 'UNKNOWN';
  diagnosisDate?: string;
  expectedKindlingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Litter {
  id: UUID;
  motherId: UUID;
  fatherId?: UUID;
  kindlingDate: string; // ISO date string
  bornAlive: number;
  stillborn: number;
  weaningDate?: string;
  weanedCount?: number;
  estimatedWeaningDate?: string; // ISO date string - calculated as kindlingDate + 28 days
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeightRecord {
  id: UUID;
  animalId: UUID;
  date: string; // ISO date string
  weightGrams: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: UUID;
  animalId: UUID;
  date: string; // ISO date string
  product: string;
  lotNumber?: string;
  dose?: string;
  route?: Route;
  reason?: string;
  withdrawalUntil?: string; // ISO date string - afficher alerte si future
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Mortality {
  id: UUID;
  animalId: UUID;
  date: string; // ISO date string
  suspectedCause?: string;
  necropsy?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cage {
  id: UUID;
  name: string;
  description?: string;
  capacity?: number;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: UUID;
  name: string;
  color?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceMetrics {
  id: UUID;
  animalId: UUID;
  period: string; // Format: YYYY-MM for monthly metrics
  totalLitters?: number;
  totalOffspring?: number;
  survivingOffspring?: number;
  averageLitterSize?: number;
  survivalRate?: number;
  averageWeightAtWeaning?: number;
  reproductionEfficiency?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  weightUnit: 'g' | 'kg';
  enableQR: boolean;
  locale: 'fr-FR' | 'en-US' | 'es-ES';
  schemaVersion: number;
  // Customizable durations (in days)
  gestationDuration: number; // Default: 31 days
  weaningDuration: number; // Default: 28 days
  reproductionReadyDuration: number; // Default: 90 days (after birth)
  slaughterReadyDuration: number; // Default: 70 days (for meat rabbits)
  // Export/Import preferences
  exportFormat: 'json' | 'csv' | 'excel';
  includeImages: boolean;
}

export interface BackupFile {
  schemaVersion: number;
  exportedAt: string;
  animals: Animal[];
  breedings: Breeding[];
  litters: Litter[];
  weights: WeightRecord[];
  treatments: Treatment[];
  mortalities: Mortality[];
  cages: Cage[];
  tags: Tag[];
  performanceMetrics: PerformanceMetrics[];
  settings: AppSettings;
}

// Application state interface
export interface AppState {
  animals: Animal[];
  breedings: Breeding[];
  litters: Litter[];
  weights: WeightRecord[];
  treatments: Treatment[];
  mortalities: Mortality[];
  cages: Cage[];
  tags: Tag[];
  performanceMetrics: PerformanceMetrics[];
  settings: AppSettings;
}