import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Slide,
  SlideProps,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => string;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
  // Convenience methods
  showSuccess: (message: string, options?: Partial<Notification>) => string;
  showError: (message: string, options?: Partial<Notification>) => string;
  showWarning: (message: string, options?: Partial<Notification>) => string;
  showInfo: (message: string, options?: Partial<Notification>) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Slide transition component
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

// Generate unique ID
const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Notification Provider Component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-hide notification after duration (if not persistent)
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message: string, options?: Partial<Notification>) => {
    return showNotification({ type: 'success', message, ...options });
  }, [showNotification]);

  const showError = useCallback((message: string, options?: Partial<Notification>) => {
    return showNotification({ 
      type: 'error', 
      message, 
      duration: 8000, // Errors stay longer
      ...options 
    });
  }, [showNotification]);

  const showWarning = useCallback((message: string, options?: Partial<Notification>) => {
    return showNotification({ type: 'warning', message, ...options });
  }, [showNotification]);

  const showInfo = useCallback((message: string, options?: Partial<Notification>) => {
    return showNotification({ type: 'info', message, ...options });
  }, [showNotification]);

  const value: NotificationContextType = {
    notifications,
    showNotification,
    hideNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// Notification Container Component
function NotificationContainer() {
  const context = useContext(NotificationContext);
  if (!context) return null;

  const { notifications, hideNotification } = context;

  // Show only the most recent notification
  const currentNotification = notifications[notifications.length - 1];

  if (!currentNotification) return null;

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification(currentNotification.id);
  };

  const handleAction = () => {
    if (currentNotification.action) {
      currentNotification.action.onClick();
      hideNotification(currentNotification.id);
    }
  };

  return (
    <Snackbar
      open={true}
      autoHideDuration={currentNotification.persistent ? null : currentNotification.duration}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ maxWidth: 600 }}
    >
      <Alert
        severity={currentNotification.type}
        onClose={handleClose}
        action={
          <>
            {currentNotification.action && (
              <IconButton
                size="small"
                aria-label={currentNotification.action.label}
                color="inherit"
                onClick={handleAction}
              >
                {currentNotification.action.label}
              </IconButton>
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
        sx={{ width: '100%' }}
      >
        {currentNotification.title && (
          <AlertTitle>{currentNotification.title}</AlertTitle>
        )}
        {currentNotification.message}
      </Alert>
    </Snackbar>
  );
}

// Hook to use notifications
function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// HOC to wrap components with notification capability
function withNotifications<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithNotificationsComponent(props: P) {
    return (
      <NotificationProvider>
        <Component {...props} />
      </NotificationProvider>
    );
  };
}

export default NotificationProvider;