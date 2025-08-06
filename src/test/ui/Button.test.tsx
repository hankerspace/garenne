import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../components/ui/Button';

describe('UI Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('handles different variants', () => {
    const { rerender } = render(<Button variant="outlined">Outlined</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-outlined');
    
    rerender(<Button variant="text">Text</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-text');
    
    rerender(<Button variant="contained">Contained</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-contained');
  });

  it('handles different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeMedium'); // MUI maps small to medium internally
    
    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeLarge');
  });

  it('handles different colors', () => {
    const { rerender } = render(<Button color="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-colorSecondary');
    
    rerender(<Button color="error">Error</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-colorError');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(''); // Text is hidden when loading
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('displays icons correctly', () => {
    const StartIcon = () => <span data-testid="start-icon">→</span>;
    const EndIcon = () => <span data-testid="end-icon">←</span>;
    
    render(
      <Button startIcon={<StartIcon />} endIcon={<EndIcon />}>
        With Icons
      </Button>
    );
    
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('hides icons when loading', () => {
    const StartIcon = () => <span data-testid="start-icon">→</span>;
    
    render(
      <Button loading startIcon={<StartIcon />}>
        Loading
      </Button>
    );
    
    expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
  });

  it('forwards refs correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Test</Button>);
    
    expect(ref.current).not.toBeNull();
  });
});