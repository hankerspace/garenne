import { Animal, Breeding, Litter, Status, Sex } from '../models/types';
import { addDays, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns';

export enum BreedingStatus {
  PREGNANT = 'PREGNANT',         // Gestante
  WAITING_BREEDING = 'WAITING_BREEDING',   // En attente de saillie
  WAITING_DIAGNOSIS = 'WAITING_DIAGNOSIS', // En attente de diagnostic
  KINDLING_SOON = 'KINDLING_SOON',        // Mise bas prochaine
  RECENTLY_KINDLED = 'RECENTLY_KINDLED',   // Vient de mettre bas
  AVAILABLE = 'AVAILABLE',        // Disponible
  NOT_REPRODUCTIVE = 'NOT_REPRODUCTIVE'    // Non reproducteur
}

export interface BreedingStatusInfo {
  status: BreedingStatus;
  details?: string;
  daysUntil?: number; // Days until expected event (kindling, diagnosis, etc.)
  relatedBreeding?: Breeding;
  relatedLitter?: Litter;
}

/**
 * Calculate the breeding status for an animal
 */
export function calculateBreedingStatus(
  animal: Animal,
  breedings: Breeding[],
  litters: Litter[],
  gestationDuration: number = 31
): BreedingStatusInfo {
  // Only reproductive animals have breeding status
  if (animal.status !== Status.Reproducer) {
    return { status: BreedingStatus.NOT_REPRODUCTIVE };
  }

  // Only female animals can be pregnant or waiting for breeding
  if (animal.sex !== Sex.Female) {
    return { status: BreedingStatus.AVAILABLE };
  }

  const now = new Date();
  
  // Get all breedings for this female, sorted by date (most recent first)
  const femaleBreedings = breedings
    .filter(b => b.femaleId === animal.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get all litters for this female, sorted by date (most recent first)
  const femaleLitters = litters
    .filter(l => l.motherId === animal.id)
    .sort((a, b) => new Date(b.kindlingDate).getTime() - new Date(a.kindlingDate).getTime());

  const mostRecentLitter = femaleLitters[0];
  const mostRecentBreeding = femaleBreedings[0];

  // Check if recently kindled (within last 4 weeks)
  if (mostRecentLitter) {
    const daysSinceKindling = differenceInDays(now, parseISO(mostRecentLitter.kindlingDate));
    
    // If kindled within last 28 days and not weaned yet
    if (daysSinceKindling <= 28 && !mostRecentLitter.weaningDate) {
      return {
        status: BreedingStatus.RECENTLY_KINDLED,
        details: `Mise bas il y a ${daysSinceKindling} jours`,
        daysUntil: 28 - daysSinceKindling,
        relatedLitter: mostRecentLitter
      };
    }
  }

  // Check breeding status
  if (mostRecentBreeding) {
    const breedingDate = parseISO(mostRecentBreeding.date);
    const daysSinceBreeding = differenceInDays(now, breedingDate);

    // Check if pregnant (confirmed diagnosis)
    if (mostRecentBreeding.diagnosis === 'PREGNANT') {
      const expectedKindlingDate = mostRecentBreeding.expectedKindlingDate 
        ? parseISO(mostRecentBreeding.expectedKindlingDate)
        : addDays(breedingDate, gestationDuration);
      
      const daysUntilKindling = differenceInDays(expectedKindlingDate, now);

      if (daysUntilKindling <= 7) {
        return {
          status: BreedingStatus.KINDLING_SOON,
          details: `Mise bas dans ${daysUntilKindling} jours`,
          daysUntil: daysUntilKindling,
          relatedBreeding: mostRecentBreeding
        };
      } else {
        return {
          status: BreedingStatus.PREGNANT,
          details: `Gestante (${daysUntilKindling} jours)`,
          daysUntil: daysUntilKindling,
          relatedBreeding: mostRecentBreeding
        };
      }
    }

    // Check if not pregnant (confirmed negative)
    if (mostRecentBreeding.diagnosis === 'NOT_PREGNANT') {
      // If confirmed not pregnant recently, available for breeding again
      if (daysSinceBreeding <= 7) {
        return {
          status: BreedingStatus.AVAILABLE,
          details: 'Disponible pour saillie',
          relatedBreeding: mostRecentBreeding
        };
      }
    }

    // Check if waiting for diagnosis (bred but no diagnosis yet)
    if (mostRecentBreeding.diagnosis === 'UNKNOWN' || !mostRecentBreeding.diagnosis) {
      // Usually diagnose pregnancy around 10-14 days after breeding
      if (daysSinceBreeding >= 10 && daysSinceBreeding <= 20) {
        return {
          status: BreedingStatus.WAITING_DIAGNOSIS,
          details: `En attente de diagnostic (saillie il y a ${daysSinceBreeding} jours)`,
          daysUntil: Math.max(0, 14 - daysSinceBreeding),
          relatedBreeding: mostRecentBreeding
        };
      }

      // If too early for diagnosis
      if (daysSinceBreeding < 10) {
        const daysUntilDiagnosis = 10 - daysSinceBreeding;
        return {
          status: BreedingStatus.WAITING_DIAGNOSIS,
          details: `Diagnostic possible dans ${daysUntilDiagnosis} jours`,
          daysUntil: daysUntilDiagnosis,
          relatedBreeding: mostRecentBreeding
        };
      }

      // If diagnosis is overdue (>20 days without diagnosis)
      if (daysSinceBreeding > 20) {
        return {
          status: BreedingStatus.WAITING_DIAGNOSIS,
          details: `Diagnostic en retard (saillie il y a ${daysSinceBreeding} jours)`,
          relatedBreeding: mostRecentBreeding
        };
      }
    }
  }

  // Determine if waiting for breeding
  // If no recent breeding or last breeding was unsuccessful/old
  const needsBreeding = !mostRecentBreeding || 
    (mostRecentBreeding.diagnosis === 'NOT_PREGNANT' && differenceInDays(now, parseISO(mostRecentBreeding.date)) > 7) ||
    (mostRecentLitter && differenceInDays(now, parseISO(mostRecentLitter.kindlingDate)) > 35); // Allow breeding 5 weeks after kindling

  if (needsBreeding) {
    return {
      status: BreedingStatus.WAITING_BREEDING,
      details: 'En attente de saillie'
    };
  }

  // Default to available
  return {
    status: BreedingStatus.AVAILABLE,
    details: 'Disponible'
  };
}

/**
 * Get the display label for a breeding status
 */
export function getBreedingStatusLabel(status: BreedingStatus): string {
  switch (status) {
    case BreedingStatus.PREGNANT:
      return 'Gestante';
    case BreedingStatus.WAITING_BREEDING:
      return 'En attente de saillie';
    case BreedingStatus.WAITING_DIAGNOSIS:
      return 'En attente de diagnostic';
    case BreedingStatus.KINDLING_SOON:
      return 'Mise bas prochaine';
    case BreedingStatus.RECENTLY_KINDLED:
      return 'Vient de mettre bas';
    case BreedingStatus.AVAILABLE:
      return 'Disponible';
    case BreedingStatus.NOT_REPRODUCTIVE:
      return '';
    default:
      return '';
  }
}

/**
 * Get the color for a breeding status chip
 */
export function getBreedingStatusColor(status: BreedingStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
    case BreedingStatus.PREGNANT:
      return 'success';
    case BreedingStatus.WAITING_BREEDING:
      return 'warning';
    case BreedingStatus.WAITING_DIAGNOSIS:
      return 'info';
    case BreedingStatus.KINDLING_SOON:
      return 'error';
    case BreedingStatus.RECENTLY_KINDLED:
      return 'secondary';
    case BreedingStatus.AVAILABLE:
      return 'primary';
    default:
      return 'default';
  }
}