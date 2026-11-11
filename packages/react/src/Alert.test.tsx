import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders alert with children', () => {
    render(<Alert data-testid="alert">Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('renders alert with different severities', () => {
    const severities = ['success', 'info', 'warning', 'error'] as const;
    severities.forEach((severity) => {
      const { unmount } = render(
        <Alert severity={severity} data-testid={`alert-${severity}`}>
          {severity} alert
        </Alert>
      );
      expect(screen.getByTestId(`alert-${severity}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <Alert variant={variant} data-testid={`alert-${variant}`}>
          {variant} alert
        </Alert>
      );
      expect(screen.getByTestId(`alert-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders alert with action button', () => {
    render(
      <Alert data-testid="alert-action" action={<button>Close</button>}>
        Alert with action
      </Alert>
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('gives the loading spinner an accessible name and marks the alert busy', () => {
    render(
      <Alert loading data-testid="alert-loading">
        Loading data...
      </Alert>
    );
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByTestId('alert-loading')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not fade the alert while loading', () => {
    render(
      <Alert loading variant="solid" data-testid="alert-loading">
        Loading data...
      </Alert>
    );
    expect(getComputedStyle(screen.getByTestId('alert-loading')).opacity).not.toBe('0.8');
  });

  it('shows the icon that matches its color, not a check mark for everything', () => {
    const cases = [
      ['info', 'InfoOutlinedIcon'],
      ['success', 'CheckCircleOutlinedIcon'],
      ['warning', 'ReportProblemOutlinedIcon'],
      ['danger', 'ErrorOutlinedIcon'],
      ['neutral', 'InfoOutlinedIcon'],
    ] as const;
    for (const [color, testId] of cases) {
      const { unmount } = render(<Alert color={color}>{color}</Alert>);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      unmount();
    }
  });

  it('hides the icon with icon={false}', () => {
    render(<Alert icon={false} data-testid="no-icon">Plain</Alert>);
    expect(screen.getByTestId('no-icon').querySelector('.MuiAlert-icon')).toBeNull();
  });
});
