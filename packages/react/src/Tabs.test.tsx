import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabItem, Tabs } from './Tabs';

const testTabs: TabItem[] = [
  { id: 'tab1', label: 'First', content: <div>First content</div> },
  { id: 'tab2', label: 'Second', content: <div>Second content</div> },
  { id: 'tab3', label: 'Third', content: <div>Third content</div> },
];

describe('Tabs', () => {
  it('renders tabs with labels', () => {
    render(<Tabs tabs={testTabs} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Second' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Third' })).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

    variants.forEach((variant) => {
      const { unmount } = render(<Tabs tabs={testTabs} variant={variant} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      unmount();
    });
  });

  it('selects first tab by default', () => {
    render(<Tabs tabs={testTabs} />);

    const firstTab = screen.getByRole('tab', { name: 'First' });
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders panel content for selected tab', () => {
    render(<Tabs tabs={testTabs} />);

    expect(screen.getByText('First content')).toBeInTheDocument();
  });

  it('handles tab change', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Tabs tabs={testTabs} onChange={handleChange} />);

    const secondTab = screen.getByRole('tab', { name: 'Second' });
    await user.click(secondTab);

    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('renders controlled value correctly', () => {
    render(<Tabs tabs={testTabs} value="tab2" />);

    const secondTab = screen.getByRole('tab', { name: 'Second' });
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Second content')).toBeInTheDocument();
  });

  it('renders disabled tab', () => {
    const tabsWithDisabled: TabItem[] = [
      { id: 'tab1', label: 'Enabled', content: <div>Content</div> },
      { id: 'tab2', label: 'Disabled', disabled: true, content: <div>Content</div> },
    ];

    render(<Tabs tabs={tabsWithDisabled} />);

    const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
    expect(disabledTab).toHaveClass('Mui-disabled');
  });

  it('renders tabs with icons', () => {
    const tabsWithIcons: TabItem[] = [
      {
        id: 'tab1',
        label: 'Home',
        icon: <span data-testid="icon">🏠</span>,
        content: <div>Content</div>,
      },
    ];

    render(<Tabs tabs={tabsWithIcons} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<Tabs tabs={testTabs} aria-label="Navigation tabs" />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-label', 'Navigation tabs');

    const firstTab = screen.getByRole('tab', { name: 'First' });
    expect(firstTab).toHaveAttribute('aria-controls');
  });

  it('renders vertical orientation', () => {
    render(<Tabs tabs={testTabs} orientation="vertical" />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={testTabs} />);

    const firstTab = screen.getByRole('tab', { name: 'First' });
    firstTab.focus();

    await user.keyboard('{ArrowRight}');

    const secondTab = screen.getByRole('tab', { name: 'Second' });
    expect(document.activeElement).toBe(secondTab);
  });

  it('does not render panels when renderPanels is false', () => {
    render(<Tabs tabs={testTabs} renderPanels={false} />);

    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    expect(screen.queryByText('First content')).not.toBeInTheDocument();
  });

  it('omits aria-controls when panels are not rendered', () => {
    render(<Tabs tabs={testTabs} renderPanels={false} />);

    for (const tab of screen.getAllByRole('tab')) expect(tab).not.toHaveAttribute('aria-controls');
  });

  it('uses defaultValue for uncontrolled mode', () => {
    render(<Tabs tabs={testTabs} defaultValue="tab3" />);

    const thirdTab = screen.getByRole('tab', { name: 'Third' });
    expect(thirdTab).toHaveAttribute('aria-selected', 'true');
  });
});
