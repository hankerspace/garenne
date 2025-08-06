import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import App from './App.tsx';
import { RouterErrorBoundary } from './components/ErrorBoundary.tsx';
import { LazyRoute } from './components/LazyRoute.tsx';

// Lazy load all pages for better code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage.tsx'));
const AnimalListPage = lazy(() => import('./pages/Animals/AnimalListPage.tsx'));
const AnimalDetailPage = lazy(() => import('./pages/Animals/AnimalDetailPage.tsx'));
const AnimalFormPage = lazy(() => import('./pages/Animals/AnimalFormPage.tsx'));
const LitterListPage = lazy(() => import('./pages/Litters/LitterListPage.tsx'));
const LitterDetailPage = lazy(() => import('./pages/Litters/LitterDetailPage.tsx'));
const CageListPage = lazy(() => import('./pages/Cages/CageListPage.tsx'));
const CageFormPage = lazy(() => import('./pages/Cages/CageFormPage.tsx'));
const CageVisualizationPage = lazy(() => import('./pages/Cages/CageVisualizationPage.tsx'));
const TagListPage = lazy(() => import('./pages/Tags/TagListPage.tsx'));
const StatisticsPage = lazy(() => import('./pages/Statistics/StatisticsPage.tsx'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage.tsx'));
const ReproductionPlanningPage = lazy(() => import('./pages/ReproductionPlanningPage.tsx'));
const GoalsTrackingPage = lazy(() => import('./pages/GoalsTrackingPage.tsx'));
const QuickActionsPage = lazy(() => import('./pages/QuickActionsPage.tsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <LazyRoute><DashboardPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'animals',
        element: <LazyRoute><AnimalListPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'animals/new',
        element: <LazyRoute><AnimalFormPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'animals/:id/edit',
        element: <LazyRoute><AnimalFormPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'animals/:id',
        element: <LazyRoute><AnimalDetailPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'litters',
        element: <LazyRoute><LitterListPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'litters/:id',
        element: <LazyRoute><LitterDetailPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'planning',
        element: <LazyRoute><ReproductionPlanningPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'goals',
        element: <LazyRoute><GoalsTrackingPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'quick',
        element: <LazyRoute><QuickActionsPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'cages',
        element: <LazyRoute><CageListPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'cages/new',
        element: <LazyRoute><CageFormPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'cages/:id/edit',
        element: <LazyRoute><CageFormPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'cages/visualization',
        element: <LazyRoute><CageVisualizationPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'tags',
        element: <LazyRoute><TagListPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'statistics',
        element: <LazyRoute><StatisticsPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'settings',
        element: <LazyRoute><SettingsPage /></LazyRoute>,
        errorElement: <RouterErrorBoundary />,
      },
    ],
  },
], {
  basename: import.meta.env.PROD ? '/garenne' : '/'
});