import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs';

const testItems: BreadcrumbItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'products', label: 'Products', href: '/products' },
  { id: 'current', label: 'Current Page' },
];

describe('Breadcrumbs', () => {
  it('renders breadcrumbs with items', () => {
    render(<Breadcrumbs items={testItems} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

    variants.forEach((variant) => {
      const { unmount } = render(<Breadcrumbs items={testItems} variant={variant} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      unmount();
    });
  });

  it('marks last item as current page', () => {
    render(<Breadcrumbs items={testItems} />);

    const lastItem = screen.getByText('Current Page');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('renders links for non-last items', () => {
    render(<Breadcrumbs items={testItems} />);

    const homeLink = screen.getByText('Home');
    expect(homeLink.tagName).toBe('A');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders icons when provided', () => {
    const itemsWithIcons: BreadcrumbItem[] = [
      { id: 'home', label: 'Home', icon: <span data-testid="icon">🏠</span> },
      { id: 'current', label: 'Current' },
    ];

    render(<Breadcrumbs items={itemsWithIcons} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('handles click handler on items', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    const items: BreadcrumbItem[] = [
      { id: 'home', label: 'Home', onClick: handleClick },
      { id: 'current', label: 'Current' },
    ];

    render(<Breadcrumbs items={items} />);

    const homeLink = screen.getByText('Home');
    await user.click(homeLink);

    expect(handleClick).toHaveBeenCalled();
  });

  it('disables items when disabled prop is set', () => {
    const items: BreadcrumbItem[] = [
      { id: 'home', label: 'Home', disabled: true },
      { id: 'current', label: 'Current' },
    ];

    render(<Breadcrumbs items={items} />);

    const disabledLink = screen.getByText('Home');
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
  });

  it('collapses items when exceeding maxItems', () => {
    const manyItems: BreadcrumbItem[] = [
      { id: '1', label: 'Item 1', href: '/1' },
      { id: '2', label: 'Item 2', href: '/2' },
      { id: '3', label: 'Item 3', href: '/3' },
      { id: '4', label: 'Item 4', href: '/4' },
      { id: '5', label: 'Item 5', href: '/5' },
      { id: '6', label: 'Current' },
    ];

    render(<Breadcrumbs items={manyItems} maxItems={4} />);

    // Should show ellipsis button
    const ellipsisButton = screen.getByRole('button', { name: /show .* more items/i });
    expect(ellipsisButton).toBeInTheDocument();
  });

  it('renders custom separator', () => {
    render(<Breadcrumbs items={testItems} separator="/" />);

    // Custom separator should be rendered
    const separators = screen.getAllByText('/');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('has correct ARIA attributes', () => {
    render(<Breadcrumbs items={testItems} aria-label="Site breadcrumbs" />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Site breadcrumbs');
  });

  it('opens menu when ellipsis is clicked', async () => {
    const user = userEvent.setup();
    const manyItems: BreadcrumbItem[] = [
      { id: '1', label: 'Item 1', href: '/1' },
      { id: '2', label: 'Item 2', href: '/2' },
      { id: '3', label: 'Item 3', href: '/3' },
      { id: '4', label: 'Item 4', href: '/4' },
      { id: '5', label: 'Item 5', href: '/5' },
      { id: '6', label: 'Current' },
    ];

    render(<Breadcrumbs items={manyItems} maxItems={4} />);

    const ellipsisButton = screen.getByRole('button', { name: /show .* more items/i });
    await user.click(ellipsisButton);

    // Menu should be open with hidden items
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('forwards aria-label so several breadcrumb navs can be told apart', () => {
    const items: BreadcrumbItem[] = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'page', label: 'Page' },
    ];
    render(
      <>
        <Breadcrumbs items={items} aria-label="Primary breadcrumb" />
        <Breadcrumbs items={items} aria-label="Secondary breadcrumb" />
      </>
    );
    expect(screen.getByRole('navigation', { name: 'Primary breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Secondary breadcrumb' })).toBeInTheDocument();
  });
});
