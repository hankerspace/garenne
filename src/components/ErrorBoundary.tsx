import React from 'react';
import { Box, Typography, Button, Container, Paper, Collapse, Alert } from '@mui/material';
import { ErrorOutline as ErrorIcon, RefreshRounded, HomeRounded, BugReportRounded } from '@mui/icons-material';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

// Enhanced logging function
const logError = (error: Error, errorInfo?: React.ErrorInfo, context?: string) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    context,
    componentStack: errorInfo?.componentStack,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Context:', context);
    console.groupEnd();
  }

  // In production, you would send this to your error reporting service
  // Example: Sentry, LogRocket, etc.
  // errorReportingService.captureError(errorData);
  
  // Store locally for debugging
  try {
    const errors = JSON.parse(localStorage.getItem('garenne_errors') || '[]');
    errors.push(errorData);
    // Keep only last 10 errors
    localStorage.setItem('garenne_errors', JSON.stringify(errors.slice(-10)));
  } catch (e) {
    console.warn('Failed to store error in localStorage:', e);
  }
};

// React Error Boundary Class Component with enhanced features
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo, 'ErrorBoundary');
    
    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    const maxRetries = 3;
    
    if (retryCount < maxRetries) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: retryCount + 1 
      });
      
      // Auto-retry after a delay if it fails again
      this.retryTimeoutId = setTimeout(() => {
        if (this.state.hasError && this.state.retryCount < maxRetries) {
          this.handleRetry();
        }
      }, 2000);
    }
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || ErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.handleRetry}
          retryCount={this.state.retryCount}
        />
      );
    }

    return this.props.children;
  }
}

// Router Error Element Component
export function RouterErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();
  
  let errorMessage = t('errors.unexpected');
  let errorDetails = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = `${t('common.error')} ${error.status}: ${error.statusText}`;
    errorDetails = error.data?.message || '';
    
    // Log router errors
    logError(
      new Error(`Router Error ${error.status}: ${error.statusText}`),
      undefined,
      'RouterErrorBoundary'
    );
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
    logError(error, undefined, 'RouterErrorBoundary');
  } else if (typeof error === 'string') {
    errorMessage = error;
    logError(new Error(error), undefined, 'RouterErrorBoundary');
  }

  return <ErrorFallback error={{ message: errorMessage, stack: errorDetails }} />;
}

// Enhanced Error Fallback UI Component
interface ErrorFallbackProps {
  error?: { message?: string; stack?: string } | Error;
  errorInfo?: React.ErrorInfo;
  resetError?: () => void;
  retryCount?: number;
}

function ErrorFallback({ error, errorInfo, resetError, retryCount = 0 }: ErrorFallbackProps) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = React.useState(false);
  const [reportSent, setReportSent] = React.useState(false);
  
  const maxRetries = 3;
  const canRetry = resetError && retryCount < maxRetries;
  
  const handleReload = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleSendReport = async () => {
    try {
      // In a real app, this would send to your error reporting service
      const errorReport = {
        message: error?.message || 'Unknown error',
        stack: (error as Error)?.stack || error?.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };
      
      // Simulate sending report
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportSent(true);
      
      console.log('Error report would be sent:', errorReport);
    } catch (e) {
      console.error('Failed to send error report:', e);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <ErrorIcon 
            sx={{ 
              fontSize: 64, 
              color: 'error.main',
              mb: 2 
            }} 
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {t('errors.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {error?.message || t('errors.unexpected')}
          </Typography>
          
          {retryCount > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Tentative {retryCount} sur {maxRetries}
            </Alert>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          {canRetry && (
            <Button 
              variant="contained" 
              onClick={handleReload}
              startIcon={<RefreshRounded />}
              sx={{ minWidth: 140 }}
            >
              Réessayer ({maxRetries - retryCount})
            </Button>
          )}
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleReload}
            startIcon={<RefreshRounded />}
            sx={{ minWidth: 120 }}
          >
            {t('errors.reload')}
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleGoHome}
            startIcon={<HomeRounded />}
            sx={{ minWidth: 120 }}
          >
            {t('errors.goHome')}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Button 
            variant="text" 
            size="small"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
          </Button>
          {!reportSent && (
            <Button 
              variant="text" 
              size="small"
              startIcon={<BugReportRounded />}
              onClick={handleSendReport}
            >
              Envoyer un rapport
            </Button>
          )}
          {reportSent && (
            <Typography variant="body2" color="success.main">
              ✓ Rapport envoyé
            </Typography>
          )}
        </Box>

        <Collapse in={showDetails}>
          {(process.env.NODE_ENV === 'development' || showDetails) && (
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom>
                Détails techniques
              </Typography>
              
              {((error as Error)?.stack || error?.stack) && (
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'grey.100',
                    overflow: 'auto',
                    maxHeight: 300,
                    mb: 2
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Stack Trace:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="pre" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {(error as Error)?.stack || error?.stack}
                  </Typography>
                </Paper>
              )}
              
              {errorInfo?.componentStack && (
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'grey.100',
                    overflow: 'auto',
                    maxHeight: 200
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Component Stack:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="pre" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {errorInfo.componentStack}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </Collapse>
      </Paper>
    </Container>
  );
}

export default ErrorBoundary;