import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  Container,
} from '@mui/material';
import {
  Home as HomeIcon,
  Pets as PetsIcon,
  FamilyRestroom as FamilyIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { lightTheme, darkTheme } from './utils/theme';
import { useAppStore } from './state/store';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const settings = useAppStore((state) => state.settings);
  const loadData = useAppStore((state) => state.loadData);

  // Load data on app start
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Determine current theme
  const theme = useMemo(() => {
    if (settings.theme === 'system') {
      return prefersDarkMode ? darkTheme : lightTheme;
    }
    return settings.theme === 'dark' ? darkTheme : lightTheme;
  }, [settings.theme, prefersDarkMode]);

  // Determine current navigation value
  const navigationValue = useMemo(() => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/animals')) return 1;
    if (location.pathname.startsWith('/litters')) return 2;
    if (location.pathname.startsWith('/settings')) return 3;
    return 0;
  }, [location.pathname]);

  const handleNavigationChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/animals');
        break;
      case 2:
        navigate('/litters');
        break;
      case 3:
        navigate('/settings');
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
      }}>
        {/* Top App Bar */}
        <AppBar position="sticky" elevation={1}>
          <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
            <Toolbar sx={{ px: 0 }}>
              <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                Garenne
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          pb: { xs: 7, sm: 0 },
          width: '100%',
          overflow: 'auto',
        }}>
          <Outlet />
        </Box>

        {/* Bottom Navigation - Mobile Only */}
        {isMobile && (
          <Paper 
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} 
            elevation={3}
          >
            <BottomNavigation
              value={navigationValue}
              onChange={handleNavigationChange}
              showLabels
            >
              <BottomNavigationAction 
                label="Accueil" 
                icon={<HomeIcon />} 
              />
              <BottomNavigationAction 
                label="Animaux" 
                icon={<PetsIcon />} 
              />
              <BottomNavigationAction 
                label="Portées" 
                icon={<FamilyIcon />} 
              />
              <BottomNavigationAction 
                label="Paramètres" 
                icon={<SettingsIcon />} 
              />
            </BottomNavigation>
          </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
