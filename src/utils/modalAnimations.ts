/**
 * Modal Animation Utilities
 * 
 * Provides smooth enter/exit animations for modals and dialogs
 * with accessibility considerations.
 */

import { keyframes } from '@emotion/react';
import { transitions } from '../utils/tokens';
import { ANIMATION_CONSTANTS } from '../constants';

// Keyframe animations
export const modalAnimations = {
  // Backdrop animations
  backdropFadeIn: keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `,
  
  backdropFadeOut: keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  `,

  // Modal content animations
  slideUp: keyframes`
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  `,

  slideDown: keyframes`
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
  `,

  slideInFromRight: keyframes`
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `,

  slideOutToRight: keyframes`
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  `,

  zoom: keyframes`
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  `,

  zoomOut: keyframes`
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  `,

  bounce: keyframes`
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  `,
};

// Animation variants
export type ModalAnimationVariant = 'slide' | 'zoom' | 'bounce' | 'slideRight';

// Animation styles for different variants
export const getModalAnimationStyles = (
  variant: ModalAnimationVariant,
  isOpen: boolean,
  reducedMotion: boolean = false
) => {
  // Respect user's motion preferences
  if (reducedMotion) {
    return {
      opacity: isOpen ? 1 : 0,
      transition: `opacity ${transitions.duration.fast} ${transitions.easing.inOut}`,
    };
  }

  const duration = transitions.duration.normal;
  const easing = transitions.easing.inOut;

  const animationStyles = {
    slide: {
      animation: `${isOpen ? modalAnimations.slideUp : modalAnimations.slideDown} ${duration} ${easing}`,
    },
    zoom: {
      animation: `${isOpen ? modalAnimations.zoom : modalAnimations.zoomOut} ${duration} ${easing}`,
    },
    bounce: {
      animation: isOpen ? `${modalAnimations.bounce} ${duration} ${easing}` : 
        `${modalAnimations.zoomOut} ${transitions.duration.fast} ${easing}`,
    },
    slideRight: {
      animation: `${isOpen ? modalAnimations.slideInFromRight : modalAnimations.slideOutToRight} ${duration} ${easing}`,
    },
  };

  return animationStyles[variant];
};

// Backdrop animation styles
export const getBackdropAnimationStyles = (isOpen: boolean, reducedMotion: boolean = false) => {
  if (reducedMotion) {
    return {
      opacity: isOpen ? 1 : 0,
      transition: `opacity ${transitions.duration.fast} ${transitions.easing.inOut}`,
    };
  }

  return {
    animation: `${isOpen ? modalAnimations.backdropFadeIn : modalAnimations.backdropFadeOut} ${transitions.duration.normal} ${transitions.easing.inOut}`,
  };
};

// Hook to detect reduced motion preference
export const useReducedMotion = (): boolean => {
  try {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    return mediaQuery?.matches ?? false;
  } catch {
    // Fallback for test environments or unsupported browsers
    return false;
  }
};

// Animation timing helper
export const getAnimationDuration = (variant: ModalAnimationVariant, reduced: boolean = false): number => {
  if (reduced) {
    return parseInt(transitions.duration.fast);
  }

  const durations = {
    slide: parseInt(transitions.duration.normal),
    zoom: parseInt(transitions.duration.normal),
    bounce: parseInt(transitions.duration.slow),
    slideRight: parseInt(transitions.duration.normal),
  };

  return durations[variant];
};

// Enhanced Modal component with animations
export interface AnimatedModalProps {
  open: boolean;
  onClose: () => void;
  variant?: ModalAnimationVariant;
  children: React.ReactNode;
  disableAnimation?: boolean;
  onExited?: () => void;
  onEntered?: () => void;
}

/**
 * CSS classes for modal animations
 */
export const modalAnimationClasses = {
  // Base modal classes
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300,
  },
  
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
  
  content: {
    position: 'relative' as const,
    outline: 'none',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  
  // Animation state classes
  entering: {
    willChange: 'transform, opacity',
  },
  
  entered: {
    willChange: 'auto',
  },
  
  exiting: {
    willChange: 'transform, opacity',
  },
  
  exited: {
    display: 'none',
  },
};

/**
 * Create enhanced modal transition styles
 */
export const createModalTransition = (
  variant: ModalAnimationVariant = 'slide',
  options: {
    timeout?: number;
    reducedMotion?: boolean;
  } = {}
) => {
  const { timeout, reducedMotion = false } = options;
  const duration = timeout || getAnimationDuration(variant, reducedMotion);

  return {
    timeout: duration,
    classNames: {
      appear: 'modal-appear',
      appearActive: 'modal-appear-active',
      appearDone: 'modal-appear-done',
      enter: 'modal-enter',
      enterActive: 'modal-enter-active',
      enterDone: 'modal-enter-done',
      exit: 'modal-exit',
      exitActive: 'modal-exit-active',
      exitDone: 'modal-exit-done',
    },
    styles: {
      appear: getModalAnimationStyles(variant, false, reducedMotion),
      appearActive: getModalAnimationStyles(variant, true, reducedMotion),
      appearDone: getModalAnimationStyles(variant, true, reducedMotion),
      enter: getModalAnimationStyles(variant, false, reducedMotion),
      enterActive: getModalAnimationStyles(variant, true, reducedMotion),
      enterDone: getModalAnimationStyles(variant, true, reducedMotion),
      exit: getModalAnimationStyles(variant, true, reducedMotion),
      exitActive: getModalAnimationStyles(variant, false, reducedMotion),
      exitDone: getModalAnimationStyles(variant, false, reducedMotion),
    },
  };
};

export default {
  modalAnimations,
  getModalAnimationStyles,
  getBackdropAnimationStyles,
  useReducedMotion,
  getAnimationDuration,
  modalAnimationClasses,
  createModalTransition,
};