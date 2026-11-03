import { FormControlLabel } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<FormControlLabel control={<Checkbox />} label="Test" />);
    expect(screen.getByLabelText('Test')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <Checkbox variant={variant} data-testid={`checkbox-${variant}`} />
      );
      expect(screen.getByTestId(`checkbox-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('names an unlabeled checkbox through aria-label on the input', () => {
    render(<Checkbox aria-label="Accept terms" />);
    const input = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(input.tagName).toBe('INPUT');
  });

  it('exposes indeterminate natively instead of aria-checked', () => {
    render(<Checkbox indeterminate aria-label="Select all" />);
    const input = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(input).not.toHaveAttribute('aria-checked');
    expect(input.indeterminate).toBe(true);
  });

  it('honours defaultChecked when uncontrolled', () => {
    render(<Checkbox defaultChecked aria-label="Checked" />);
    expect(screen.getByRole('checkbox', { name: 'Checked' })).toBeChecked();
  });

  it('names the loading spinner and marks the control busy', () => {
    const { container } = render(<Checkbox loading label="Saving" />);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  });
});
