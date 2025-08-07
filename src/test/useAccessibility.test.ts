import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAccessibility, useScreenReaderAnnouncement } from '../hooks/useAccessibility';

describe('useAccessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns correct accessibility props', () => {
    const { result } = renderHook(() => 
      useAccessibility({
        ariaLabel: 'Test label',
        ariaDescription: 'Test description'
      })
    );

    const props = result.current.getAccessibilityProps();
    expect(props['aria-label']).toBe('Test label');
    expect(props['aria-describedby']).toBe('description');
    expect(props['title']).toBe('Test description');
  });

  it('includes keyboard shortcut in title', () => {
    const { result } = renderHook(() => 
      useAccessibility({
        ariaLabel: 'Test label',
        keyboardShortcut: 'ctrl+k'
      })
    );

    const props = result.current.getAccessibilityProps();
    expect(props['title']).toBe('Test label (ctrl+k)');
  });

  it('handles keyboard shortcuts', () => {
    const onActivation = vi.fn();
    
    renderHook(() => 
      useAccessibility({
        keyboardShortcut: 'ctrl+k',
        onKeyboardActivation: onActivation
      })
    );

    // Simuler Ctrl+K
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true
      });
      document.dispatchEvent(event);
    });

    expect(onActivation).toHaveBeenCalledTimes(1);
  });

  it('handles complex keyboard shortcuts', () => {
    const onActivation = vi.fn();
    
    renderHook(() => 
      useAccessibility({
        keyboardShortcut: 'ctrl+shift+a',
        onKeyboardActivation: onActivation
      })
    );

    // Simuler Ctrl+Shift+A
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        shiftKey: true
      });
      document.dispatchEvent(event);
    });

    expect(onActivation).toHaveBeenCalledTimes(1);
  });
});

describe('useScreenReaderAnnouncement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('creates announcement element with correct attributes', () => {
    const { result } = renderHook(() => useScreenReaderAnnouncement());

    act(() => {
      result.current.announce('Test announcement');
    });

    const announcement = document.querySelector('[aria-live="polite"]');
    expect(announcement).toBeInTheDocument();
    expect(announcement).toHaveAttribute('aria-atomic', 'true');
    expect(announcement).toHaveTextContent('Test announcement');
  });

  it('supports assertive announcements', () => {
    const { result } = renderHook(() => useScreenReaderAnnouncement());

    act(() => {
      result.current.announce('Urgent announcement', 'assertive');
    });

    const announcement = document.querySelector('[aria-live="assertive"]');
    expect(announcement).toBeInTheDocument();
  });

  it('removes announcement after timeout', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useScreenReaderAnnouncement());

    act(() => {
      result.current.announce('Test announcement');
    });

    expect(document.querySelector('[aria-live]')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(document.querySelector('[aria-live]')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('applies screen reader only styles', () => {
    const { result } = renderHook(() => useScreenReaderAnnouncement());

    act(() => {
      result.current.announce('Test announcement');
    });

    const announcement = document.querySelector('[aria-live]') as HTMLElement;
    expect(announcement.style.position).toBe('absolute');
    expect(announcement.style.left).toBe('-10000px');
    expect(announcement.style.width).toBe('1px');
    expect(announcement.style.height).toBe('1px');
    expect(announcement.style.overflow).toBe('hidden');
  });
});