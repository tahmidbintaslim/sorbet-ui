import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Autocomplete, AutocompleteOption } from './Autocomplete';

expect.extend(toHaveNoViolations);

const options: AutocompleteOption[] = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Another Option', value: 4 },
  { label: 'Last Option', value: 5 },
];

describe('Autocomplete', () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // Basic Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders autocomplete with label', () => {
      render(<Autocomplete options={options} label="Test Label" />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renders autocomplete with placeholder', () => {
      render(<Autocomplete options={options} placeholder="Select an option..." />);
      expect(screen.getByPlaceholderText('Select an option...')).toBeInTheDocument();
    });

    it('renders autocomplete with helper text', () => {
      render(<Autocomplete options={options} label="Test" helperText="Helper text here" />);
      expect(screen.getByText('Helper text here')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Variants
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

    variants.forEach((variant) => {
      it(`renders ${variant} variant`, () => {
        render(<Autocomplete options={options} label={`${variant} variant`} variant={variant} />);
        expect(screen.getByLabelText(`${variant} variant`)).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Colors
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Colors', () => {
    const colors = [
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'info',
      'neutral',
    ] as const;

    colors.forEach((color) => {
      it(`renders ${color} color`, () => {
        render(<Autocomplete options={options} label={`${color} color`} color={color} />);
        expect(screen.getByLabelText(`${color} color`)).toBeInTheDocument();
      });
    });
  });

  describe('Theme colors', () => {
    it('fills a solid danger field with the Sorbet danger palette', () => {
      const { container } = render(
        <Autocomplete options={options} label="Danger" color="danger" variant="solid" />
      );
      // danger main (#e11d48) with white text, not the old hard-coded MUI blue
      expect(container.querySelector('.MuiOutlinedInput-root')).toHaveStyle({
        backgroundColor: 'rgb(225, 29, 72)',
        color: 'rgb(255, 255, 255)',
      });
    });

    it('does not fade a disabled field with opacity', () => {
      const { container } = render(<Autocomplete options={options} label="Off" disabled />);
      expect(getComputedStyle(container.firstChild as Element).opacity).not.toBe('0.5');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Sizes
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach((size) => {
      it(`renders ${size} size`, () => {
        render(<Autocomplete options={options} label={`${size} size`} size={size} />);
        expect(screen.getByLabelText(`${size} size`)).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Selection Behavior
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Selection Behavior', () => {
    it('opens dropdown when clicked', async () => {
      render(<Autocomplete options={options} label="Test" />);

      const input = screen.getByLabelText('Test');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('shows options in dropdown', async () => {
      render(<Autocomplete options={options} label="Test" />);

      const input = screen.getByLabelText('Test');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
    });

    it('selects option on click', async () => {
      const handleChange = vi.fn();
      render(<Autocomplete options={options} label="Test" onChange={handleChange} />);

      const input = screen.getByLabelText('Test');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('Option 1'));

      expect(handleChange).toHaveBeenCalled();
    });

    it('filters options based on input', async () => {
      render(<Autocomplete options={options} label="Test" />);

      const input = screen.getByLabelText('Test');
      await userEvent.type(input, 'Another');

      await waitFor(() => {
        expect(screen.getByText('Another Option')).toBeInTheDocument();
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Multiple Selection
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Multiple Selection', () => {
    it('allows multiple selections', async () => {
      const handleChange = vi.fn();
      render(<Autocomplete multiple options={options} label="Test" onChange={handleChange} />);

      const input = screen.getByLabelText('Test');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('Option 1'));

      expect(handleChange).toHaveBeenCalled();
    });

    it('displays chips for selected values', async () => {
      render(
        <Autocomplete multiple options={options} label="Test" value={[options[0], options[1]]} />
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Free Solo
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Free Solo', () => {
    it('allows custom input in free solo mode', async () => {
      const handleChange = vi.fn();
      render(
        <Autocomplete
          freeSolo
          options={options.map((o) => o.label)}
          label="Test"
          onInputChange={handleChange}
        />
      );

      const input = screen.getByLabelText('Test');
      await userEvent.type(input, 'Custom Value');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Disabled State
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Disabled State', () => {
    it('renders disabled autocomplete', () => {
      render(<Autocomplete options={options} label="Test" disabled />);

      const input = screen.getByLabelText('Test');
      expect(input).toBeDisabled();
    });

    it('does not open dropdown when disabled', async () => {
      render(<Autocomplete options={options} label="Test" disabled />);

      const input = screen.getByLabelText('Test');
      await userEvent.click(input).catch(() => {});

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Error State
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Error State', () => {
    it('renders error state', () => {
      render(<Autocomplete options={options} label="Test" error helperText="Error message" />);

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Loading State
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Loading State', () => {
    it('shows loading state', async () => {
      render(<Autocomplete options={[]} label="Test" loading />);

      const input = screen.getByLabelText('Test');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('Loading…')).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Full Width
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Full Width', () => {
    it('renders full width', () => {
      const { container } = render(<Autocomplete options={options} label="Test" fullWidth />);

      const autocomplete = container.querySelector('.MuiAutocomplete-root');
      expect(autocomplete).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard Navigation
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Keyboard Navigation', () => {
    it('opens dropdown on arrow down', async () => {
      render(<Autocomplete options={options} label="Test" />);

      const input = screen.getByLabelText('Test');
      input.focus();
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('closes dropdown on escape', async () => {
      render(<Autocomplete options={options} label="Test" />);

      const input = screen.getByLabelText('Test');
      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Clearable
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Clearable', () => {
    it('shows clear button when value is selected', async () => {
      render(<Autocomplete options={options} label="Test" value={options[0]} />);

      const clearButton = screen.getByTitle('Clear');
      expect(clearButton).toBeInTheDocument();
    });

    it('clears value when clear button is clicked', async () => {
      const handleChange = vi.fn();
      render(
        <Autocomplete options={options} label="Test" value={options[0]} onChange={handleChange} />
      );

      const clearButton = screen.getByTitle('Clear');
      await userEvent.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith(expect.anything(), null, 'clear', undefined);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Accessibility
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Autocomplete options={options} label="Select an option" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when disabled', async () => {
      const { container } = render(
        <Autocomplete options={options} label="Select an option" disabled />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with error', async () => {
      const { container } = render(
        <Autocomplete options={options} label="Select an option" error helperText="Error message" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for multiple selection', async () => {
      const { container } = render(
        <Autocomplete multiple options={options} label="Select options" value={[options[0]]} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
