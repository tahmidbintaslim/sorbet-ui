import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders pagination with correct page count', () => {
    render(<Pagination count={10} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    // Should show page numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

    variants.forEach((variant) => {
      const { unmount } = render(
        <Pagination count={5} variant={variant} data-testid={`pagination-${variant}`} />
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles page change', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Pagination count={10} onChange={handleChange} />);

    const page2 = screen.getByText('2');
    await user.click(page2);

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows first and last buttons when enabled', () => {
    render(<Pagination count={10} showFirstButton showLastButton />);

    const buttons = screen.getAllByRole('button');
    // Should have first, prev, pages, next, last
    expect(buttons.length).toBeGreaterThan(4);
  });

  it('hides nav buttons when specified', () => {
    render(<Pagination count={10} hideNextButton hidePrevButton />);

    // Should only show page numbers, not navigation buttons
    const buttons = screen.getAllByRole('button');
    // All buttons should be page numbers or ellipsis
    expect(
      buttons.every(
        (btn) => btn.getAttribute('aria-label')?.includes('page') || btn.textContent?.includes('…')
      )
    ).toBe(true);
  });

  it('disables pagination when disabled prop is true', () => {
    render(<Pagination count={10} disabled />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('disabled');
    });
  });

  it('renders with custom sibling count', () => {
    render(<Pagination count={20} page={10} siblingCount={2} />);

    // With siblingCount=2, should show pages 8, 9, 10, 11, 12
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<Pagination count={10} aria-label="Test pagination" />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Test pagination');
  });

  it('marks selected page', () => {
    render(<Pagination count={10} page={5} />);

    const page5Button = screen.getByText('5').closest('button');
    expect(page5Button).toHaveClass('Mui-selected');
  });

  it('handles controlled mode', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(<Pagination count={10} page={1} onChange={handleChange} />);

    // Page 1 should be selected
    expect(screen.getByText('1').closest('button')).toHaveClass('Mui-selected');

    // Click page 3
    await user.click(screen.getByText('3'));
    expect(handleChange).toHaveBeenCalled();

    // Simulate parent updating the page prop
    rerender(<Pagination count={10} page={3} onChange={handleChange} />);
    expect(screen.getByText('3').closest('button')).toHaveClass('Mui-selected');
  });

  it('forwards aria-label so several pagination navs can be told apart', () => {
    render(
      <>
        <Pagination count={5} aria-label="Results pages" />
        <Pagination count={5} aria-label="Comments pages" />
      </>
    );
    expect(screen.getByRole('navigation', { name: 'Results pages' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Comments pages' })).toBeInTheDocument();
  });
});
