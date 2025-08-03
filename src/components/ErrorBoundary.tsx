import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// React Error Boundary Class Component
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
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
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return <ErrorFallback error={{ message: errorMessage, stack: errorDetails }} />;
}

// Error Fallback UI Component
interface ErrorFallbackProps {
  error?: { message?: string; stack?: string };
  resetError?: () => void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { t } = useTranslation();
  
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
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error?.message || t('errors.unexpected')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={handleReload}
            sx={{ minWidth: 120 }}
          >
            {t('errors.reload')}
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleGoHome}
            sx={{ minWidth: 120 }}
          >
            {t('errors.goHome')}
          </Button>
        </Box>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              {t('errors.developmentDetails')}
            </Typography>
            <Paper 
              sx={{ 
                p: 2, 
                backgroundColor: 'grey.100',
                overflow: 'auto',
                maxHeight: 300
              }}
            >
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
                {error.stack}
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ErrorBoundary;