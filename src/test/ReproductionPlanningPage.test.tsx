import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../utils/theme';
import ReproductionPlanningPage from '../pages/ReproductionPlanningPage';
import { useAppStore } from '../state/store';
import { Sex, Status, BreedingMethod } from '../models/types';

// Helper to render with required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={lightTheme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const todayISO = new Date().toISOString().split('T')[0];

describe('ReproductionPlanningPage - Available Females', () => {
  beforeEach(() => {
    useAppStore.getState().clearAllData();
  });

  it('treats NOT_PREGNANT recent breeding as available and UNKNOWN as not available', async () => {
    const store = useAppStore.getState();

    // Create two female reproducers
    const femaleAvailable = store.addAnimal({
      name: 'Femelle A',
      identifier: 'FA',
      sex: Sex.Female,
      status: Status.Reproducer,
      createdAt: todayISO,
      updatedAt: todayISO,
    } as any);

    const femaleBlocked = store.addAnimal({
      name: 'Femelle B',
      identifier: 'FB',
      sex: Sex.Female,
      status: Status.Reproducer,
      createdAt: todayISO,
      updatedAt: todayISO,
    } as any);

    // Add recent NOT_PREGNANT breeding for Femelle A
    store.addBreeding({
      femaleId: femaleAvailable.id,
      method: BreedingMethod.Natural,
      date: todayISO,
      diagnosis: 'NOT_PREGNANT',
    } as any);

    // Add recent UNKNOWN breeding for Femelle B
    store.addBreeding({
      femaleId: femaleBlocked.id,
      method: BreedingMethod.Natural,
      date: todayISO,
      diagnosis: 'UNKNOWN',
    } as any);

    renderWithProviders(<ReproductionPlanningPage />);

    // Locate the "Femelles disponibles pour saillie" section
    const heading = screen.getByText(/Femelles disponibles pour saillie/i);
    const grid = heading.parentElement?.nextElementSibling as HTMLElement;
    expect(grid).toBeTruthy();

    // Femelle A should be present (NOT_PREGNANT)
    expect(within(grid).getByText('Femelle A')).toBeInTheDocument();

    // Femelle B should not be present in the available list (UNKNOWN)
    expect(within(grid).queryByText('Femelle B')).toBeNull();
  });
});
