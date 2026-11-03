import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders with title', () => {
    render(
      <Tooltip title="Test Tooltip" data-testid="tooltip">
        <span data-testid="tooltip-child">Hover me</span>
      </Tooltip>
    );
    expect(screen.getByTestId('tooltip-child')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <Tooltip variant={variant} title={variant} data-testid={`tooltip-${variant}`}>
          <Button data-testid={`button-${variant}`}>{variant}</Button>
        </Tooltip>
      );
      expect(screen.getByTestId(`button-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('supports arrow prop', () => {
    render(
      <Tooltip title="Tooltip with Arrow" arrow data-testid="tooltip-arrow">
        <span data-testid="tooltip-child">Hover me</span>
      </Tooltip>
    );
    expect(screen.getByTestId('tooltip-child')).toBeInTheDocument();
  });

  it('describes a labeled child instead of renaming it when describeChild is set', () => {
    render(
      <Tooltip title="More details" describeChild>
        <Button>Save</Button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
