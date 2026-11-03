import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

expect.extend(toHaveNoViolations);

describe('Progress', () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // Basic Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders linear progress by default', () => {
      render(<Progress value={50} data-testid="progress" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '50');
    });

    it('renders circular progress when type is circular', () => {
      render(<Progress type="circular" value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<Progress />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Variants
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

    variants.forEach((variant) => {
      it(`renders ${variant} variant for linear progress`, () => {
        render(<Progress variant={variant} value={50} data-testid={`progress-${variant}`} />);
        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
      });
    });

    variants.forEach((variant) => {
      it(`renders ${variant} variant for circular progress`, () => {
        render(
          <Progress
            type="circular"
            variant={variant}
            value={50}
            data-testid={`circular-${variant}`}
          />
        );
        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
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
        render(<Progress color={color} value={50} />);
        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Sizes
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach((size) => {
      it(`renders ${size} size for linear progress`, () => {
        render(<Progress size={size} value={50} />);
        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
      });
    });

    sizes.forEach((size) => {
      it(`renders ${size} size for circular progress`, () => {
        render(<Progress type="circular" size={size} value={50} />);
        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Value Handling
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Value Handling', () => {
    it('normalizes value below 0 to 0', () => {
      render(<Progress value={-10} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });

    it('normalizes value above 100 to 100', () => {
      render(<Progress value={150} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
    });

    it('handles decimal values', () => {
      render(<Progress value={33.33} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '33.33');
    });

    it('handles 0% value', () => {
      render(<Progress value={0} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });

    it('handles 100% value', () => {
      render(<Progress value={100} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Indeterminate
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Indeterminate', () => {
    it('renders linear indeterminate progress', () => {
      render(<Progress indeterminate />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      // Indeterminate progress should not have aria-valuenow
      expect(progress).not.toHaveAttribute('aria-valuenow');
    });

    it('renders circular indeterminate progress', () => {
      render(<Progress type="circular" indeterminate />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Labels
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Labels', () => {
    it('shows label when showLabel is true for linear progress', () => {
      render(<Progress value={75} showLabel />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('shows label when showLabel is true for circular progress', () => {
      render(<Progress type="circular" value={50} showLabel />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('uses custom label formatter', () => {
      render(<Progress value={42} showLabel formatLabel={(v) => `${v} of 100`} />);
      expect(screen.getByText('42 of 100')).toBeInTheDocument();
    });

    it('does not show label for indeterminate progress', () => {
      render(<Progress indeterminate showLabel />);
      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });

    it('renders label at different positions', () => {
      const { rerender } = render(<Progress value={50} showLabel labelPosition="end" />);
      expect(screen.getByText('50%')).toBeInTheDocument();

      rerender(<Progress value={50} showLabel labelPosition="top" />);
      expect(screen.getByText('50%')).toBeInTheDocument();

      rerender(<Progress value={50} showLabel labelPosition="bottom" />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Buffer (Linear Only)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Buffer', () => {
    it('renders buffer progress', () => {
      render(<Progress value={30} bufferValue={60} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '30');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Custom Styling
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Custom Styling', () => {
    it('applies custom height to linear progress', () => {
      render(<Progress value={50} height={20} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('applies rounded corners', () => {
      render(<Progress value={50} rounded />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('applies square corners when rounded is false', () => {
      render(<Progress value={50} rounded={false} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('applies custom circular size', () => {
      render(<Progress type="circular" value={50} circleSize={100} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('applies custom thickness to circular progress', () => {
      render(<Progress type="circular" value={50} thickness={8} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Progress value={50} className="custom-progress" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass('custom-progress');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ARIA Attributes
  // ─────────────────────────────────────────────────────────────────────────────

  describe('ARIA Attributes', () => {
    it('has correct ARIA attributes for determinate progress', () => {
      render(<Progress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('has correct ARIA attributes for indeterminate progress', () => {
      render(<Progress indeterminate />);
      const progress = screen.getByRole('progressbar');
      expect(progress).not.toHaveAttribute('aria-valuenow');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Accessibility
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('linear progress has no accessibility violations', async () => {
      const { container } = render(<Progress value={50} aria-label="Loading progress" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('circular progress has no accessibility violations', async () => {
      const { container } = render(
        <Progress type="circular" value={50} aria-label="Loading progress" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('linear progress with label has no accessibility violations', async () => {
      const { container } = render(<Progress value={75} showLabel aria-label="Upload progress" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('circular progress with label has no accessibility violations', async () => {
      const { container } = render(
        <Progress type="circular" value={75} showLabel aria-label="Download progress" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('indeterminate progress has no accessibility violations', async () => {
      const { container } = render(<Progress indeterminate aria-label="Loading" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('buffer progress has no accessibility violations', async () => {
      const { container } = render(
        <Progress value={30} bufferValue={60} aria-label="Buffering progress" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Type Switching
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Type Switching', () => {
    it('switches from linear to circular', () => {
      const { rerender } = render(<Progress value={50} />);
      let progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();

      rerender(<Progress type="circular" value={50} />);
      progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
    });
  });

  describe('Accessible name', () => {
    it('defaults to "Progress"', () => {
      render(<Progress value={40} />);
      expect(screen.getByRole('progressbar', { name: 'Progress' })).toBeInTheDocument();
    });

    it('defaults to "Loading" when indeterminate', () => {
      render(<Progress indeterminate type="circular" />);
      expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    });

    it('uses the caller aria-label', () => {
      render(<Progress value={40} aria-label="Upload" />);
      expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument();
    });
  });
});
