import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

expect.extend(toHaveNoViolations);

describe('Slider', () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // Basic Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders slider', () => {
      render(<Slider data-testid="slider" />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<Slider defaultValue={50} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('renders with controlled value', () => {
      render(<Slider value={75} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '75');
    });

    it('renders with custom min and max', () => {
      render(<Slider min={10} max={200} defaultValue={50} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '10');
      expect(slider).toHaveAttribute('aria-valuemax', '200');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Variants
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

    variants.forEach((variant) => {
      it(`renders ${variant} variant`, () => {
        render(<Slider variant={variant} defaultValue={50} />);
        const slider = screen.getByRole('slider');
        expect(slider).toBeInTheDocument();
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
        render(<Slider color={color} defaultValue={50} />);
        const slider = screen.getByRole('slider');
        expect(slider).toBeInTheDocument();
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
        render(<Slider size={size} defaultValue={50} />);
        const slider = screen.getByRole('slider');
        expect(slider).toBeInTheDocument();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Value Changes
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Value Changes', () => {
    it('calls onChange when value changes', async () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={50} onChange={handleChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      expect(handleChange).toHaveBeenCalled();
    });

    it('respects step prop', async () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={50} step={10} onChange={handleChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      expect(handleChange).toHaveBeenCalledWith(expect.anything(), 60, expect.anything());
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Range Slider
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Range Slider', () => {
    it('renders range slider with two thumbs', () => {
      render(<Slider defaultValue={[20, 80]} />);
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });

    it('has correct values for range slider', () => {
      render(<Slider defaultValue={[25, 75]} />);
      const sliders = screen.getAllByRole('slider');
      expect(sliders[0]).toHaveAttribute('aria-valuenow', '25');
      expect(sliders[1]).toHaveAttribute('aria-valuenow', '75');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Disabled State
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Disabled State', () => {
    it('renders disabled slider', () => {
      render(<Slider disabled defaultValue={50} data-testid="slider" />);
      const slider = screen.getByRole('slider');
      // MUI slider uses disabled state on parent, check slider is rendered
      expect(slider).toBeInTheDocument();
    });

    it('renders with disabled prop', () => {
      const { container } = render(<Slider disabled defaultValue={50} />);
      const disabledSlider = container.querySelector('.Mui-disabled');
      expect(disabledSlider).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // With Marks
  // ─────────────────────────────────────────────────────────────────────────────

  describe('With Marks', () => {
    it('renders with marks', () => {
      const marks = [
        { value: 0, label: '0°C' },
        { value: 50, label: '50°C' },
        { value: 100, label: '100°C' },
      ];
      render(<Slider marks={marks} defaultValue={50} />);

      expect(screen.getByText('0°C')).toBeInTheDocument();
      expect(screen.getByText('50°C')).toBeInTheDocument();
      expect(screen.getByText('100°C')).toBeInTheDocument();
    });

    it('renders auto marks when marks=true', () => {
      render(<Slider marks step={25} defaultValue={50} />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Value Display
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Value Display', () => {
    it('shows min/max labels when showMinMax is true', () => {
      render(<Slider showMinMax min={0} max={100} defaultValue={50} />);
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('formats min/max labels with custom formatter', () => {
      render(
        <Slider showMinMax min={0} max={100} defaultValue={50} formatValue={(v) => `$${v}`} />
      );
      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
    });

    it('shows value label when showValue is true and position is bottom', () => {
      render(<Slider showValue valueLabelPosition="bottom" defaultValue={75} />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard Navigation
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Keyboard Navigation', () => {
    it('increases value with ArrowRight', () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={50} onChange={handleChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      expect(handleChange).toHaveBeenCalled();
    });

    it('decreases value with ArrowLeft', () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={50} onChange={handleChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });

      expect(handleChange).toHaveBeenCalled();
    });

    it('goes to min with Home key', () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={50} min={0} onChange={handleChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'Home' });

      expect(handleChange).toHaveBeenCalledWith(expect.anything(), 0, expect.anything());
    });

    it('goes to max with End key', () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={50} max={100} onChange={handleChange} />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'End' });

      expect(handleChange).toHaveBeenCalledWith(expect.anything(), 100, expect.anything());
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Orientation
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Orientation', () => {
    it('renders horizontal slider by default', () => {
      render(<Slider defaultValue={50} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('renders vertical slider when orientation is vertical', () => {
      render(<Slider orientation="vertical" defaultValue={50} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // ARIA Attributes
  // ─────────────────────────────────────────────────────────────────────────────

  describe('ARIA Attributes', () => {
    it('has correct ARIA attributes', () => {
      render(<Slider min={10} max={90} defaultValue={50} />);
      const slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('aria-valuemin', '10');
      expect(slider).toHaveAttribute('aria-valuemax', '90');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('supports aria-label', () => {
      render(<Slider aria-label="Volume" defaultValue={50} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-label', 'Volume');
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <label id="slider-label">Volume</label>
          <Slider aria-labelledby="slider-label" defaultValue={50} />
        </>
      );
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-labelledby', 'slider-label');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Accessibility
  // ─────────────────────────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Slider aria-label="Test slider" defaultValue={50} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with marks', async () => {
      const marks = [
        { value: 0, label: '0' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
      ];
      const { container } = render(
        <Slider aria-label="Test slider" marks={marks} defaultValue={50} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when disabled', async () => {
      const { container } = render(<Slider aria-label="Test slider" defaultValue={50} disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('range slider has no accessibility violations', async () => {
      const { container } = render(<Slider aria-label="Price range" defaultValue={[20, 80]} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('names each range thumb through getAriaLabel', () => {
    render(
      <Slider
        defaultValue={[20, 80]}
        getAriaLabel={(i) => (i === 0 ? 'Minimum price' : 'Maximum price')}
      />
    );
    expect(screen.getByRole('slider', { name: 'Minimum price' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Maximum price' })).toBeInTheDocument();
  });
});
