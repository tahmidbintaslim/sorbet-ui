import { FormControl, InputLabel } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MenuItem, Select } from './Select';

describe('Select', () => {
  it('renders with options', () => {
    render(
      <FormControl>
        <InputLabel>Test</InputLabel>
        <Select defaultValue="option1">
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </Select>
      </FormControl>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  it('handles disabled state', () => {
    render(
      <FormControl>
        <Select disabled defaultValue="option1">
          <MenuItem value="option1">Option 1</MenuItem>
        </Select>
      </FormControl>
    );
    const selectInput = screen.getByRole('combobox');
    expect(selectInput).toHaveAttribute('aria-disabled', 'true');
  });
  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <FormControl>
          <Select variant={variant} defaultValue="option1" data-testid={`select-${variant}`}>
            <MenuItem value="option1">Option 1</MenuItem>
          </Select>
        </FormControl>
      );
      expect(screen.getByTestId(`select-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('links the visible label to the combobox', () => {
    render(
      <Select label="Topic" value="a" onChange={() => {}}>
        <MenuItem value="a">Billing</MenuItem>
      </Select>
    );
    expect(screen.getByRole('combobox', { name: /^Topic/ })).toBeInTheDocument();
  });

  it('names a select without a visible label through aria-label', () => {
    render(
      <Select aria-label="Sort order" defaultValue="a">
        <MenuItem value="a">Newest</MenuItem>
      </Select>
    );
    expect(screen.getByRole('combobox', { name: 'Sort order' })).toBeInTheDocument();
  });

  it('names the loading spinner and marks the combobox busy', () => {
    render(
      <Select label="Topic" loading defaultValue="a">
        <MenuItem value="a">Billing</MenuItem>
      </Select>
    );
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-busy', 'true');
  });
});
