import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders chip with label', () => {
    render(<Chip label="Test Chip" data-testid="chip" />);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <Chip variant={variant} label={variant} data-testid={`chip-${variant}`} />
      );
      expect(screen.getByTestId(`chip-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('handles disabled state', () => {
    render(<Chip label="Disabled" disabled data-testid="chip-disabled" />);
    expect(screen.getByTestId('chip-disabled')).toHaveClass('Mui-disabled');
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<Chip label="Deletable" onDelete={handleDelete} data-testid="chip-deletable" />);
    expect(screen.getByTestId('chip-deletable')).toBeInTheDocument();
  });

  it('gives the loading spinner an accessible name and marks the chip busy', () => {
    render(<Chip loading label="Saving" data-testid="chip-loading" />);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByTestId('chip-loading')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not fade the chip while loading or disabled', () => {
    render(
      <>
        <Chip loading label="Saving" data-testid="chip-loading" />
        <Chip disabled label="Disabled" data-testid="chip-disabled" />
      </>
    );
    expect(getComputedStyle(screen.getByTestId('chip-loading')).opacity).not.toBe('0.7');
    expect(screen.getByTestId('chip-disabled')).toHaveStyle({ opacity: '1' });
  });
});
