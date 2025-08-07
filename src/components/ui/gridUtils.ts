/**
 * Utilitaires pour le système de grille
 */

/**
 * Hook helper pour les breakpoints responsive
 */
export const useResponsiveColumns = () => {
  return {
    // Configuration commune pour les listes d'éléments
    card: { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 },
    halfWidth: { xs: 12, sm: 6 },
    thirdWidth: { xs: 12, sm: 6, md: 4 },
    quarterWidth: { xs: 12, sm: 6, md: 4, lg: 3 },
    twoThirds: { xs: 12, md: 8 },
    oneThird: { xs: 12, md: 4 },
  };
};