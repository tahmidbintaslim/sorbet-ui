import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

const root = (container: HTMLElement) => container.querySelector('.MuiSkeleton-root') as HTMLElement;

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />);
    expect(root(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('defaults to a text line with the pulse animation', () => {
    const { container } = render(<Skeleton />);
    expect(root(container)).toHaveClass('MuiSkeleton-text', 'MuiSkeleton-pulse');
  });

  it.each(['text', 'rectangular', 'rounded', 'circular'] as const)('renders the %s shape', (shape) => {
    const { container } = render(<Skeleton shape={shape} />);
    expect(root(container)).toHaveClass(`MuiSkeleton-${shape}`);
  });

  it("accepts MUI's shape values in variant for drop-in compatibility", () => {
    const { container } = render(<Skeleton variant="circular" width={40} height={40} />);
    expect(root(container)).toHaveClass('MuiSkeleton-circular');
    expect(root(container).style.width).toBe('40px');
  });

  it('sizes a circle from the size preset unless width and height are given', () => {
    const { container, rerender } = render(<Skeleton shape="circular" size="xl" />);
    expect(root(container).style.width).toBe('64px');
    expect(root(container).style.height).toBe('64px');
    rerender(<Skeleton shape="circular" size="xl" width={20} height={20} />);
    expect(root(container).style.width).toBe('20px');
  });

  it('gives blocks a height from the size preset', () => {
    const { container } = render(<Skeleton shape="rounded" size="sm" />);
    expect(root(container).style.height).toBe('72px');
  });

  it('supports the wave animation and no animation', () => {
    const { container, rerender } = render(<Skeleton animation="wave" />);
    expect(root(container)).toHaveClass('MuiSkeleton-wave');
    rerender(<Skeleton animation={false} />);
    expect(root(container)).not.toHaveClass('MuiSkeleton-pulse');
    expect(root(container)).not.toHaveClass('MuiSkeleton-wave');
  });

  it('turns the animation off under prefers-reduced-motion', () => {
    render(<Skeleton animation="wave" />);
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('\n');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\{[^}]*animation:none/);
  });

  it('renders every variant and color', () => {
    for (const variant of ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const) {
      for (const color of ['primary', 'danger', 'neutral'] as const) {
        const { container, unmount } = render(<Skeleton variant={variant} color={color} />);
        expect(root(container)).toBeInTheDocument();
        unmount();
      }
    }
  });

  it('forwards the ref', () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Skeleton ref={ref} />);
    expect(ref.current).toHaveClass('MuiSkeleton-root');
  });
});
