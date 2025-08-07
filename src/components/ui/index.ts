/**
 * Système de composants UI réutilisables
 */

// Imports des composants
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { Modal } from './Modal';
import { GridContainer, GridItem } from './Grid';
import GridDefault from './Grid';
import { useResponsiveColumns } from './gridUtils';
import { ModalActions, useModal } from './modalUtils';

// Export des composants de base
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Card, type CardProps } from './Card';
export { Modal, type ModalProps } from './Modal';

// Export du système de grille
export { 
  default as Grid,
  GridContainer, 
  GridItem, 
  type GridProps,
  type GridItemProps
} from './Grid';
export { useResponsiveColumns } from './gridUtils';

// Export des utilitaires Modal
export { ModalActions, useModal } from './modalUtils';

// Export d'un objet principal pour utilisation groupée
export const UI = {
  Button,
  Input, 
  Card,
  Modal,
  Grid: GridDefault,
};

export default UI;