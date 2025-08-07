import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Loading component for lazy routes
export const PageLoader = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="200px"
  >
    <CircularProgress />
  </Box>
);

// Wrapper component to add suspense to lazy routes
export const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);