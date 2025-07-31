import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import AnimalListPage from './pages/Animals/AnimalListPage.tsx';
import AnimalDetailPage from './pages/Animals/AnimalDetailPage.tsx';
import LitterListPage from './pages/Litters/LitterListPage.tsx';
import LitterDetailPage from './pages/Litters/LitterDetailPage.tsx';
import SettingsPage from './pages/Settings/SettingsPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'animals',
        element: <AnimalListPage />,
      },
      {
        path: 'animals/:id',
        element: <AnimalDetailPage />,
      },
      {
        path: 'litters',
        element: <LitterListPage />,
      },
      {
        path: 'litters/:id',
        element: <LitterDetailPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);