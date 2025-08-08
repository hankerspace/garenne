import React from 'react';
import { 
  Breadcrumbs, 
  Link, 
  Typography, 
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ARIA_LABELS } from '../utils/accessibility';
import { NAVIGATION_CONSTANTS } from '../constants';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface BreadcrumbsNavigationProps {
  /** Custom breadcrumb items */
  items?: BreadcrumbItem[];
  /** Show home icon */
  showHome?: boolean;
  /** Maximum number of breadcrumbs to show */
  maxItems?: number;
  /** Collapse on mobile */
  collapseOnMobile?: boolean;
}

/**
 * Routes configuration for automatic breadcrumb generation
 */
const ROUTE_LABELS: Record<string, string> = {
  '/': 'Accueil',
  '/dashboard': 'Tableau de bord',
  '/animals': 'Animaux',
  '/animals/new': 'Nouvel animal',
  '/animals/edit': 'Modifier animal',
  '/litters': 'Portées',
  '/litters/new': 'Nouvelle portée',
  '/litters/edit': 'Modifier portée',
  '/cages': 'Cages',
  '/cages/new': 'Nouvelle cage',
  '/cages/edit': 'Modifier cage',
  '/tags': 'Étiquettes',
  '/statistics': 'Statistiques',
  '/goals': 'Objectifs',
  '/planning': 'Planification',
  '/visualization': 'Visualisation',
  '/quick-actions': 'Actions rapides',
  '/settings': 'Paramètres',
};

/**
 * Generate breadcrumbs from current route
 */
const generateBreadcrumbsFromRoute = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    
    // Check for dynamic routes (IDs)
    const isId = /^[a-zA-Z0-9-]+$/.test(segments[i]) && i > 0;
    
    if (isId) {
      // For ID segments, use a generic label or try to get from context
      breadcrumbs.push({
        label: `#${segments[i]}`,
        path: currentPath,
        isActive: i === segments.length - 1,
      });
    } else {
      const label = ROUTE_LABELS[currentPath] || segments[i];
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: i === segments.length - 1,
      });
    }
  }

  return breadcrumbs;
};

/**
 * Enhanced breadcrumbs navigation component
 */
export const BreadcrumbsNavigation: React.FC<BreadcrumbsNavigationProps> = ({
  items,
  showHome = true,
  maxItems = NAVIGATION_CONSTANTS.BREADCRUMB_MAX_ITEMS,
  collapseOnMobile = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Use custom items or generate from route
  const breadcrumbItems = items || generateBreadcrumbsFromRoute(location.pathname);
  
  // Add home if not present and requested
  const allItems = showHome && !breadcrumbItems.some(item => item.path === '/') 
    ? [{ label: 'Accueil', path: '/', icon: <HomeIcon fontSize="small" /> }, ...breadcrumbItems]
    : breadcrumbItems;

  // Collapse on mobile if requested
  const displayItems = collapseOnMobile && isMobile && allItems.length > 2
    ? [allItems[0], allItems[allItems.length - 1]] // Show only first and last
    : allItems.slice(-maxItems); // Show last maxItems

  // Handle click for breadcrumb analytics
  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    // Analytics tracking could go here
    console.log('Breadcrumb clicked:', item.label);
  };

  return (
    <Box
      component="nav"
      aria-label={ARIA_LABELS.navigation.breadcrumb}
      sx={{
        py: 1,
        px: { xs: 1, sm: 0 },
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        maxItems={maxItems}
        aria-label={ARIA_LABELS.navigation.breadcrumb}
        sx={{
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'nowrap',
          },
          '& .MuiBreadcrumbs-li': {
            minWidth: 0,
          },
        }}
      >
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isActive = (item as BreadcrumbItem).isActive || isLast;

          if (isActive) {
            return (
              <Box
                key={item.path || item.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  minWidth: 0,
                }}
              >
                {item.icon}
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight="medium"
                  noWrap
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          }

          return (
            <Link
              key={item.path || item.label}
              component={RouterLink}
              to={item.path || '#'}
              onClick={() => handleBreadcrumbClick(item)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                textDecoration: 'none',
                minWidth: 0,
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
                '&:focus': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: 2,
                  borderRadius: 1,
                },
              }}
              aria-label={`Naviguer vers ${item.label}`}
            >
              {item.icon}
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                {item.label}
              </Typography>
            </Link>
          );
        })}

        {/* Show collapsed indicator on mobile */}
        {collapseOnMobile && isMobile && allItems.length > 2 && (
          <Chip
            label="..."
            size="small"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: '0.75rem',
              '& .MuiChip-label': {
                px: 1,
              },
            }}
            aria-label={`${allItems.length - 2} étapes masquées`}
          />
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsNavigation;