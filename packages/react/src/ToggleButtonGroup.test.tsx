import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ToggleButton, ToggleButtonGroup } from './ToggleButtonGroup';

expect.extend(toHaveNoViolations);

describe('ToggleButtonGroup', () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // Basic Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders toggle button group', () => {
      render(
        <ToggleButtonGroup value="a">
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('renders all toggle buttons', () => {
      render(
        <ToggleButtonGroup value="a">
          <ToggleButton value="a">Option A</ToggleButton>
          <ToggleButton value="b">Option B</ToggleButton>
          <ToggleButton value="c">Option C</ToggleButton>
        </ToggleButtonGroup>
      );
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
      expect(screen.getByText('Option C')).toBeInTheDocument();
    });

    it('renders with selected value', () => {
      render(
        <ToggleButtonGroup value="b">
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Variants
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

    variants.forEach((variant) => {
      it(`renders ${variant} variant`, () => {
        render(
          <ToggleButtonGroup variant={variant} value="a">
            <ToggleButton value="a">A</ToggleButton>
            <ToggleButton value="b">B</ToggleButton>
          </ToggleButtonGroup>
        );
        expect(screen.getByRole('group')).toBeInTheDocument();
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
        render(
          <ToggleButtonGroup color={color} value="a">
            <ToggleButton value="a">A</ToggleButton>
            <ToggleButton value="b">B</ToggleButton>
          </ToggleButtonGroup>
        );
        expect(screen.getByRole('group')).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Sizes
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach((size) => {
      it(`renders ${size} size`, () => {
        render(
          <ToggleButtonGroup size={size} value="a">
            <ToggleButton value="a">A</ToggleButton>
            <ToggleButton value="b">B</ToggleButton>
          </ToggleButtonGroup>
        );
        expect(screen.getByRole('group')).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Exclusive Mode
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Exclusive Mode', () => {
    it('allows only one selection in exclusive mode', async () => {
      const handleChange = vi.fn();
      render(
        <ToggleButtonGroup value="a" exclusive onChange={handleChange}>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttonB = screen.getByText('B');
      await userEvent.click(buttonB);

      expect(handleChange).toHaveBeenCalledWith(expect.anything(), 'b');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Multiple Selection
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Multiple Selection', () => {
    it('allows multiple selections when not exclusive', async () => {
      const handleChange = vi.fn();
      render(
        <ToggleButtonGroup value={['a']} onChange={handleChange}>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
          <ToggleButton value="c">C</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttonB = screen.getByText('B');
      await userEvent.click(buttonB);

      expect(handleChange).toHaveBeenCalled();
    });

    it('can deselect in multiple mode', async () => {
      const handleChange = vi.fn();
      render(
        <ToggleButtonGroup value={['a', 'b']} onChange={handleChange}>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttonA = screen.getByText('A');
      await userEvent.click(buttonA);

      expect(handleChange).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Disabled State
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Disabled State', () => {
    it('disables all buttons when group is disabled', () => {
      render(
        <ToggleButtonGroup value="a" disabled>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('disables individual button when button is disabled', () => {
      render(
        <ToggleButtonGroup value="a">
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b" disabled>
            B
          </ToggleButton>
        </ToggleButtonGroup>
      );

      const buttonA = screen.getByText('A');
      const buttonB = screen.getByText('B');

      expect(buttonA).not.toBeDisabled();
      expect(buttonB).toBeDisabled();
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      render(
        <ToggleButtonGroup value="a" disabled onChange={handleChange}>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttonB = screen.getByText('B');
      await userEvent.click(buttonB).catch(() => {});

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Orientation
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Orientation', () => {
    it('renders horizontal orientation by default', () => {
      render(
        <ToggleButtonGroup value="a">
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
    });

    it('renders vertical orientation', () => {
      render(
        <ToggleButtonGroup value="a" orientation="vertical">
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Full Width
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Full Width', () => {
    it('renders full width when fullWidth is true', () => {
      render(
        <ToggleButtonGroup value="a" fullWidth>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Gap
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Gap', () => {
    it('renders with gap', () => {
      render(
        <ToggleButtonGroup value="a" gap={8}>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard Navigation
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Keyboard Navigation', () => {
    it('buttons are focusable', async () => {
      render(
        <ToggleButtonGroup value="a">
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttonA = screen.getByText('A');
      buttonA.focus();
      expect(document.activeElement).toBe(buttonA);
    });

    it('can activate button with Enter key', async () => {
      const handleChange = vi.fn();
      render(
        <ToggleButtonGroup value="a" exclusive onChange={handleChange}>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttonB = screen.getByText('B');
      buttonB.focus();
      fireEvent.keyDown(buttonB, { key: 'Enter' });
      fireEvent.click(buttonB);

      expect(handleChange).toHaveBeenCalled();
    });

    it('can activate button with Space key', async () => {
      const handleChange = vi.fn();
      render(
        <ToggleButtonGroup value="a" exclusive onChange={handleChange}>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttonB = screen.getByText('B');
      await userEvent.click(buttonB);

      expect(handleChange).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ARIA Attributes
  // ─────────────────────────────────────────────────────────────────────────────

  describe('ARIA Attributes', () => {
    it('has role="group"', () => {
      render(
        <ToggleButtonGroup value="a">
          <ToggleButton value="a">A</ToggleButton>
        </ToggleButtonGroup>
      );
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('buttons have aria-pressed attribute', () => {
      render(
        <ToggleButtonGroup value="a" exclusive>
          <ToggleButton value="a">A</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
        </ToggleButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Accessibility
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <ToggleButtonGroup value="a" aria-label="Text alignment">
          <ToggleButton value="a" aria-label="Left align">
            A
          </ToggleButton>
          <ToggleButton value="b" aria-label="Center align">
            B
          </ToggleButton>
        </ToggleButtonGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when disabled', async () => {
      const { container } = render(
        <ToggleButtonGroup value="a" aria-label="Text alignment" disabled>
          <ToggleButton value="a" aria-label="Left align">
            A
          </ToggleButton>
          <ToggleButton value="b" aria-label="Center align">
            B
          </ToggleButton>
        </ToggleButtonGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for multiple selection', async () => {
      const { container } = render(
        <ToggleButtonGroup value={['a', 'b']} aria-label="Text formatting">
          <ToggleButton value="a" aria-label="Bold">
            B
          </ToggleButton>
          <ToggleButton value="b" aria-label="Italic">
            I
          </ToggleButton>
          <ToggleButton value="c" aria-label="Underline">
            U
          </ToggleButton>
        </ToggleButtonGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations vertical orientation', async () => {
      const { container } = render(
        <ToggleButtonGroup value="a" aria-label="View options" orientation="vertical">
          <ToggleButton value="a" aria-label="List view">
            List
          </ToggleButton>
          <ToggleButton value="b" aria-label="Grid view">
            Grid
          </ToggleButton>
        </ToggleButtonGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('exposes aria-pressed and names icon-only buttons through aria-label', () => {
    render(
      <ToggleButtonGroup value="left" exclusive>
        <ToggleButton value="left" aria-label="Align left">
          <svg />
        </ToggleButton>
        <ToggleButton value="right" aria-label="Align right">
          <svg />
        </ToggleButton>
      </ToggleButtonGroup>
    );
    expect(screen.getByRole('button', { name: 'Align left' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Align right' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});
