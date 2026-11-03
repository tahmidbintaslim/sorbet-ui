import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table, TableColumn } from './Table';

interface TestUser {
  id: number;
  name: string;
  email: string;
}

const testData: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

const testColumns: TableColumn<TestUser>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
];

describe('Table', () => {
  it('renders table with data', () => {
    render(<Table data={testData} columns={testColumns} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

    variants.forEach((variant) => {
      const { unmount } = render(
        <Table
          data={testData.slice(0, 1)}
          columns={testColumns}
          variant={variant}
          data-testid={`table-${variant}`}
        />
      );
      expect(screen.getByRole('table')).toBeInTheDocument();
      unmount();
    });
  });

  it('renders column headers', () => {
    render(<Table data={testData} columns={testColumns} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<Table data={[]} columns={testColumns} />);

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders custom empty content', () => {
    render(
      <Table data={[]} columns={testColumns} emptyContent={<div>Custom empty message</div>} />
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('handles row click', async () => {
    const handleRowClick = vi.fn();
    const user = userEvent.setup();

    render(<Table data={testData} columns={testColumns} onRowClick={handleRowClick} />);

    const rows = screen.getAllByRole('row');
    // rows[0] is header, rows[1] is first data row
    await user.click(rows[1]);

    expect(handleRowClick).toHaveBeenCalledWith(testData[0], 0);
  });

  it('handles row selection', async () => {
    const handleSelectionChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Table
        data={testData}
        columns={testColumns}
        selectable
        selected={[]}
        onSelectionChange={handleSelectionChange}
        getRowId={(row) => String(row.id)}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    // checkboxes[0] is "select all", checkboxes[1] is first row
    await user.click(checkboxes[1]);

    expect(handleSelectionChange).toHaveBeenCalledWith(['1']);
  });

  it('handles select all', async () => {
    const handleSelectionChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Table
        data={testData}
        columns={testColumns}
        selectable
        selected={[]}
        onSelectionChange={handleSelectionChange}
        getRowId={(row) => String(row.id)}
      />
    );

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(selectAllCheckbox);

    expect(handleSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('renders caption for accessibility', () => {
    render(<Table data={testData} columns={testColumns} caption="Test Table Caption" />);

    expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'Test Table Caption');
  });

  it('renders custom cell content', () => {
    const columnsWithCustomCell: TableColumn<TestUser>[] = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        cell: (value) => <strong>{String(value)}</strong>,
      },
      { id: 'email', header: 'Email', accessor: 'email' },
    ];

    render(<Table data={testData} columns={columnsWithCustomCell} />);

    const strongElements = screen.getAllByText(/John Doe|Jane Smith|Bob Johnson/);
    expect(strongElements[0].tagName).toBe('STRONG');
  });

  it('applies striped styling class', () => {
    const { container } = render(<Table data={testData} columns={testColumns} striped />);

    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Table data={testData} columns={testColumns} loading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('wraps the table in a focusable, labeled scroll region', () => {
    render(<Table data={[{ id: '1', name: 'A' }]} columns={[{ id: 'name', header: 'Name', accessor: 'name' }]} caption="People" />);
    const region = screen.getByRole('region', { name: 'People' });
    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('names the loading spinner and marks the region busy', () => {
    render(<Table data={testData} columns={testColumns} loading caption="People" />);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'People' })).toHaveAttribute('aria-busy', 'true');
  });

  it('uses aria-label to name the region, so several tables can be told apart', () => {
    render(
      <>
        <Table data={testData} columns={testColumns} aria-label="Customers" />
        <Table data={testData} columns={testColumns} aria-label="Orders" />
      </>
    );
    expect(screen.getByRole('region', { name: 'Customers' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Orders' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Orders' })).toBeInTheDocument();
  });

  it('uses aria-labelledby to name the region and the table', () => {
    render(
      <>
        <h2 id="users-heading">Users</h2>
        <Table data={testData} columns={testColumns} aria-labelledby="users-heading" />
      </>
    );
    expect(screen.getByRole('region', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Users' })).toBeInTheDocument();
  });
});
