import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import AnimalListPage from './pages/Animals/AnimalListPage.tsx';
import AnimalDetailPage from './pages/Animals/AnimalDetailPage.tsx';
import AnimalFormPage from './pages/Animals/AnimalFormPage.tsx';
import LitterListPage from './pages/Litters/LitterListPage.tsx';
import LitterDetailPage from './pages/Litters/LitterDetailPage.tsx';
import CageListPage from './pages/Cages/CageListPage.tsx';
import CageFormPage from './pages/Cages/CageFormPage.tsx';
import TagListPage from './pages/Tags/TagListPage.tsx';
import StatisticsPage from './pages/Statistics/StatisticsPage.tsx';
import SettingsPage from './pages/Settings/SettingsPage.tsx';
import { RouterErrorBoundary } from './components/ErrorBoundary.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'animals',
        element: <AnimalListPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'animals/new',
        element: <AnimalFormPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'animals/:id/edit',
        element: <AnimalFormPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'animals/:id',
        element: <AnimalDetailPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'litters',
        element: <LitterListPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'litters/:id',
        element: <LitterDetailPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'cages',
        element: <CageListPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'cages/new',
        element: <CageFormPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'cages/:id/edit',
        element: <CageFormPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'tags',
        element: <TagListPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'statistics',
        element: <StatisticsPage />,
        errorElement: <RouterErrorBoundary />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        errorElement: <RouterErrorBoundary />,
      },
    ],
  },
], {
  basename: import.meta.env.PROD ? '/garenne' : '/'
});