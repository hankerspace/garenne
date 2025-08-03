import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { lightTheme } from '../utils/theme'
import { useAppStore } from '../state/store'
import DashboardPage from '../pages/DashboardPage'

// Helper to render with required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={lightTheme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    // Clear the store before each test
    useAppStore.getState().clearAllData()
  })

  it('renders dashboard title', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument()
  })

  it('shows welcome message when no data exists', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByText('Bienvenue dans Garenne !')).toBeInTheDocument()
    expect(screen.getByText('Charger des données d\'exemple')).toBeInTheDocument()
  })

  it('displays KPI cards', () => {
    renderWithProviders(<DashboardPage />)
    
    expect(screen.getByText('Animaux vivants')).toBeInTheDocument()
    expect(screen.getByText('Reproducteurs')).toBeInTheDocument()
    expect(screen.getByText('Planning reproduction')).toBeInTheDocument()
    expect(screen.getAllByText('Actions rapides')).toHaveLength(2) // One in KPI card, one in FAB menu
    expect(screen.getByText('Traitements actifs')).toBeInTheDocument()
  })

  it('displays quick actions section', () => {
    renderWithProviders(<DashboardPage />)
    
    expect(screen.getAllByText('Actions rapides')).toHaveLength(2) // One in KPI card, one in FAB menu
    expect(screen.getByText('Nouvel animal')).toBeInTheDocument()
    expect(screen.getByText('Pesée rapide')).toBeInTheDocument()
    expect(screen.getByText('Codes QR')).toBeInTheDocument()
    expect(screen.getByText('Traitement')).toBeInTheDocument()
  })
})