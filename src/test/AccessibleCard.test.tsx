import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AccessibleCard } from '../components/AccessibleCard';

describe('AccessibleCard', () => {
  it('renders children correctly', () => {
    render(
      <AccessibleCard>
        <div>Test content</div>
      </AccessibleCard>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies aria-label correctly', () => {
    render(
      <AccessibleCard ariaLabel="Test card">
        <div>Content</div>
      </AccessibleCard>
    );
    
    const card = screen.getByLabelText('Test card');
    expect(card).toBeInTheDocument();
  });

  it('handles keyboard navigation with Enter', async () => {
    const handleActivate = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AccessibleCard onActivate={handleActivate}>
        <div>Clickable content</div>
      </AccessibleCard>
    );
    
    // Chercher le CardActionArea spécifiquement
    const cardActionArea = screen.getByRole('button');
    cardActionArea.focus();
    await user.keyboard('{Enter}');
    
    expect(handleActivate).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation with Space', async () => {
    const handleActivate = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AccessibleCard onActivate={handleActivate}>
        <div>Clickable content</div>
      </AccessibleCard>
    );
    
    // Chercher le CardActionArea spécifiquement
    const cardActionArea = screen.getByRole('button');
    cardActionArea.focus();
    await user.keyboard(' ');
    
    expect(handleActivate).toHaveBeenCalledTimes(1);
  });

  it('indicates selected state correctly', () => {
    render(
      <AccessibleCard onActivate={() => {}} selected ariaLabel="Selected card">
        <div>Content</div>
      </AccessibleCard>
    );
    
    const cardActionArea = screen.getByRole('button', { name: 'Selected card' });
    expect(cardActionArea).toHaveAttribute('aria-pressed', 'true');
  });

  it('is focusable when onActivate is provided', () => {
    render(
      <AccessibleCard onActivate={() => {}}>
        <div>Clickable content</div>
      </AccessibleCard>
    );
    
    const cardActionArea = screen.getByRole('button');
    expect(cardActionArea).toBeInTheDocument();
  });

  it('is not focusable when onActivate is not provided', () => {
    render(
      <AccessibleCard>
        <div>Non-clickable content</div>
      </AccessibleCard>
    );
    
    // Il ne devrait pas y avoir de bouton
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies data-index for list navigation', () => {
    render(
      <AccessibleCard index={5} onActivate={() => {}}>
        <div>Item 5</div>
      </AccessibleCard>
    );
    
    const cardActionArea = screen.getByRole('button');
    expect(cardActionArea).toHaveAttribute('data-index', '5');
  });

  it('forwards refs correctly', () => {
    const ref = { current: null };
    render(
      <AccessibleCard ref={ref}>
        <div>Content</div>
      </AccessibleCard>
    );
    
    expect(ref.current).not.toBeNull();
  });
});