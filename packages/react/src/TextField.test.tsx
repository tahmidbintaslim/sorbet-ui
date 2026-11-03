import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders with label', () => {
    render(<TextField label="Test Field" />);
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <TextField
          label={`Test ${variant}`}
          variant={variant}
          data-testid={`textfield-${variant}`}
        />
      );
      expect(screen.getByTestId(`textfield-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('handles disabled state', () => {
    render(<TextField label="Disabled" disabled />);
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('displays error state', () => {
    render(<TextField label="Error" error helperText="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('names a field without a visible label through aria-label on the input', () => {
    render(<TextField aria-label="Search" />);
    expect(screen.getByRole('textbox', { name: 'Search' }).tagName).toBe('INPUT');
  });

  it('names the loading spinner and marks the input busy', () => {
    render(<TextField label="Email" loading />);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-busy', 'true');
  });
});
