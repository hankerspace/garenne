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
  FamilyRestroom as ReproductionIcon,
  Settings as SettingsIcon,
  Home as CageIcon,
} from '@mui/icons-material';
import { lightTheme, darkTheme } from './utils/theme';
import { useAppStore } from './state/store';
import { useTranslation } from './hooks/useTranslation';
import logo from './assets/icon.png';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { t } = useTranslation();
  
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
    if (location.pathname.startsWith('/cages')) return 2;
    if (location.pathname.startsWith('/planning') || location.pathname.startsWith('/litters')) return 3;
    if (location.pathname.startsWith('/settings') || location.pathname.startsWith('/tags')) return 4;
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
        navigate('/cages/visualization');
        break;
      case 3:
        navigate('/planning');
        break;
      case 4:
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
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <img 
                  src={logo}
                  alt="Garenne Logo" 
                  style={{ 
                    height: '40px', 
                    marginRight: '12px',
                    objectFit: 'contain',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      padding: '2px',
                      cursor: 'pointer',
                  }} 
                  onClick={() => navigate('/')}
                />
                <Typography 
                  variant="h6" 
                  component="h1"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/')}
                >
                  Garenne
                </Typography>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          pb: 7,
          width: '100%',
          overflow: 'auto',
        }}>
          <Outlet />
        </Box>

        {/* Bottom Navigation */}
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
              label={t('nav.dashboard')} 
              icon={<HomeIcon />} 
            />
            <BottomNavigationAction 
              label={t('nav.animals')} 
              icon={<PetsIcon />} 
            />
            <BottomNavigationAction 
              label={t('nav.cages')} 
              icon={<CageIcon />} 
            />
            <BottomNavigationAction 
              label={t('nav.reproduction')} 
              icon={<ReproductionIcon />} 
            />
            <BottomNavigationAction 
              label={t('nav.settings')} 
              icon={<SettingsIcon />} 
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
