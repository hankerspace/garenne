# API Documentation - Garenne

## Table of Contents

- [Data Models](#data-models)
- [Store API](#store-api)
- [Services](#services)
- [Validation Schemas](#validation-schemas)
- [Utilities](#utilities)

## Data Models

### Animal

```typescript
interface Animal {
  id: UUID;
  name?: string;
  identifier?: string; // Tatouage/QR facultatif
  sex: Sex;
  breed?: string;
  birthDate?: string; // ISO date string
  origin?: 'BORN_HERE' | 'PURCHASED';
  motherId?: UUID;
  fatherId?: UUID;
  cage?: string;
  status: Status;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Litter

```typescript
interface Litter {
  id: UUID;
  motherId: UUID;
  fatherId?: UUID;
  birthDate: string; // ISO date string
  totalBorn: number;
  aliveAtBirth: number;
  weaningDate?: string; // ISO date string
  aliveAtWeaning?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Treatment

```typescript
interface Treatment {
  id: UUID;
  animalId: UUID;
  treatmentType: string;
  medication?: string;
  dose?: string;
  route?: Route;
  waitingPeriod?: number; // en jours
  administeredDate: string; // ISO date string
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Weight

```typescript
interface Weight {
  id: UUID;
  animalId: UUID;
  weight: number; // en grammes
  date: string; // ISO date string
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Breeding

```typescript
interface Breeding {
  id: UUID;
  femaleId: UUID;
  maleId?: UUID;
  method: BreedingMethod;
  date: string; // ISO date string
  expectedDate?: string; // ISO date string (31 jours après)
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Store API

### State Structure

```typescript
interface AppState {
  animals: Animal[];
  litters: Litter[];
  treatments: Treatment[];
  weights: Weight[];
  breedings: Breeding[];
  settings: Settings;
}
```

### Animal Actions

#### `addAnimal(data: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Animal`
Crée un nouvel animal.

**Paramètres:**
- `data`: Données de l'animal (sans id, createdAt, updatedAt)

**Retourne:** L'animal créé avec son ID

**Exemple:**
```typescript
const newAnimal = addAnimal({
  name: "Fluffy",
  sex: Sex.Female,
  status: Status.Grow,
  birthDate: "2024-01-01"
});
```

#### `updateAnimal(id: UUID, data: Partial<Animal>): void`
Met à jour un animal existant.

#### `deleteAnimal(id: UUID): void`
Supprime un animal et toutes ses données associées.

#### `getAnimal(id: UUID): Animal | undefined`
Récupère un animal par son ID.

### Weight Actions

#### `addWeight(data: Omit<Weight, 'id' | 'createdAt' | 'updatedAt'>): Weight`
Ajoute une pesée pour un animal.

#### `updateWeight(id: UUID, data: Partial<Weight>): void`
Met à jour une pesée existante.

#### `deleteWeight(id: UUID): void`
Supprime une pesée.

#### `getAnimalWeights(animalId: UUID): Weight[]`
Récupère toutes les pesées d'un animal, triées par date.

### Treatment Actions

#### `addTreatment(data: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>): Treatment`
Ajoute un traitement pour un animal.

#### `updateTreatment(id: UUID, data: Partial<Treatment>): void`
Met à jour un traitement existant.

#### `deleteTreatment(id: UUID): void`
Supprime un traitement.

#### `getAnimalTreatments(animalId: UUID): Treatment[]`
Récupère tous les traitements d'un animal.

#### `getActiveTreatments(): Treatment[]`
Récupère tous les traitements avec délai d'attente encore actif.

### Litter Actions

#### `addLitter(data: Omit<Litter, 'id' | 'createdAt' | 'updatedAt'>): Litter`
Ajoute une nouvelle portée.

#### `updateLitter(id: UUID, data: Partial<Litter>): void`
Met à jour une portée existante.

#### `deleteLitter(id: UUID): void`
Supprime une portée.

#### `getAnimalLitters(animalId: UUID): Litter[]`
Récupère toutes les portées d'une femelle.

### Breeding Actions

#### `addBreeding(data: Omit<Breeding, 'id' | 'createdAt' | 'updatedAt'>): Breeding`
Enregistre une saillie.

#### `updateBreeding(id: UUID, data: Partial<Breeding>): void`
Met à jour une saillie existante.

#### `deleteBreeding(id: UUID): void`
Supprime une saillie.

#### `getAnimalBreedings(animalId: UUID): Breeding[]`
Récupère toutes les saillies d'une femelle.

### Data Management

#### `saveData(): void`
Sauvegarde l'état actuel dans le localStorage.

#### `loadData(): void`
Charge les données depuis le localStorage.

#### `exportData(): string`
Exporte toutes les données au format JSON.

#### `importData(jsonData: string): boolean`
Importe des données depuis un JSON. Retourne true si succès.

#### `loadSeedData(): void`
Charge des données d'exemple pour découvrir l'application.

#### `clearAllData(): void`
Supprime toutes les données (irréversible).

## Services

### GenerateService

Service pour générer des données d'exemple.

#### `generateSeedAnimals(): Animal[]`
Génère une liste d'animaux d'exemple avec une généalogie cohérente.

#### `generateSeedWeights(animals: Animal[]): Weight[]`
Génère des pesées d'exemple pour les animaux.

#### `generateSeedTreatments(animals: Animal[]): Treatment[]`
Génère des traitements d'exemple.

#### `generateSeedLitters(animals: Animal[]): Litter[]`
Génère des portées d'exemple.

## Validation Schemas

### Animal Schema

```typescript
export const animalSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50),
  identifier: z.string().max(20).optional(),
  sex: z.nativeEnum(Sex),
  breed: z.string().max(30).optional(),
  birthDate: dateString.optional(),
  origin: z.enum(['BORN_HERE', 'PURCHASED']).optional(),
  motherId: z.string().uuid().optional(),
  fatherId: z.string().uuid().optional(),
  cage: z.string().max(20).optional(),
  status: z.nativeEnum(Status),
  notes: z.string().max(500).optional(),
}).refine((data) => {
  // Validation logique parenté
  return true;
});
```

### Weight Schema

```typescript
export const weightSchema = z.object({
  animalId: z.string().uuid(),
  weight: z.number().min(1).max(10000),
  date: dateString,
  notes: z.string().max(200).optional(),
});
```

### Treatment Schema

```typescript
export const treatmentSchema = z.object({
  animalId: z.string().uuid(),
  treatmentType: z.string().min(1).max(100),
  medication: z.string().max(100).optional(),
  dose: z.string().max(50).optional(),
  route: z.nativeEnum(Route).optional(),
  waitingPeriod: z.number().min(0).max(365).optional(),
  administeredDate: dateString,
  notes: z.string().max(500).optional(),
});
```

## Utilities

### Date Utilities

#### `formatDate(date: string | Date): string`
Formate une date au format français.

#### `formatDateTime(date: string | Date): string`
Formate une date avec l'heure.

#### `calculateAge(birthDate: string): string`
Calcule l'âge d'un animal.

#### `addDaysToDate(date: string, days: number): string`
Ajoute des jours à une date.

#### `isDateAfter(date1: string, date2: string): boolean`
Compare deux dates.

### Storage Utilities

#### `compressData(data: any): string`
Compresse des données avec LZ-String.

#### `decompressData(compressedData: string): any`
Décompresse des données.

### Validation Utilities

#### `validateParentage(animal: Animal, allAnimals: Animal[]): string[]`
Valide la cohérence de la parenté d'un animal.

#### `validateBreedingAge(animal: Animal): boolean`
Valide si un animal est en âge de se reproduire.

## Error Handling

L'application utilise des patterns d'error handling consistants :

- **Validation** : Erreurs de validation avec Zod
- **Storage** : Try/catch pour localStorage avec fallback
- **UI** : Messages d'erreur utilisateur via Material-UI Snackbar
- **Development** : Console.error pour debugging

## Performance Considerations

- **Memoization** : Sélecteurs Zustand memoïzés
- **Lazy Loading** : Chargement paresseux des composants
- **Virtual Scrolling** : Pour les listes longues d'animaux
- **Local Storage** : Compression LZ-String pour optimiser l'espace