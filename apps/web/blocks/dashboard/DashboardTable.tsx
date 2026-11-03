'use client';
// @block {"name":"Orders table","description":"Searchable orders table with status chips and pagination."}
import * as React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Card, Chip, Pagination, Table, TextField, type TableColumn } from '@sorbet-ui/react';

type Status = 'Paid' | 'Pending' | 'Refunded' | 'Failed';
type Order = { id: string; customer: string; date: string; status: Status; total: number };

const statusColor: Record<Status, 'success' | 'warning' | 'neutral' | 'danger'> = {
  Paid: 'success',
  Pending: 'warning',
  Refunded: 'neutral',
  Failed: 'danger',
};

const orders: Order[] = [
  { id: 'ACM-1042', customer: 'Maya Chen', date: 'Oct 30', status: 'Paid', total: 129 },
  { id: 'ACM-1041', customer: 'Liam Ortiz', date: 'Oct 30', status: 'Pending', total: 64.5 },
  { id: 'ACM-1040', customer: 'Priya Nair', date: 'Oct 29', status: 'Paid', total: 248 },
  { id: 'ACM-1039', customer: 'Jonas Berg', date: 'Oct 29', status: 'Refunded', total: 32 },
  { id: 'ACM-1038', customer: 'Amara Okafor', date: 'Oct 28', status: 'Paid', total: 89.9 },
  { id: 'ACM-1037', customer: 'Hugo Martin', date: 'Oct 28', status: 'Failed', total: 15 },
  { id: 'ACM-1036', customer: 'Sofia Rossi', date: 'Oct 27', status: 'Paid', total: 410 },
  { id: 'ACM-1035', customer: 'Kenji Sato', date: 'Oct 27', status: 'Pending', total: 72 },
  { id: 'ACM-1034', customer: 'Elena Petrova', date: 'Oct 26', status: 'Paid', total: 158 },
  { id: 'ACM-1033', customer: 'Noah Williams', date: 'Oct 25', status: 'Paid', total: 44 },
  { id: 'ACM-1032', customer: 'Zara Ahmed', date: 'Oct 25', status: 'Refunded', total: 99 },
  { id: 'ACM-1031', customer: 'Lucas Silva', date: 'Oct 24', status: 'Paid', total: 205 },
];

const columns: TableColumn<Order>[] = [
  { id: 'id', header: 'Order', accessor: 'id' },
  { id: 'customer', header: 'Customer', accessor: 'customer' },
  { id: 'date', header: 'Date', accessor: 'date' },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    cell: (value) => <Chip size="sm" variant="soft" color={statusColor[value as Status]} label={value as string} />,
  },
  { id: 'total', header: 'Total', accessor: (row) => `$${row.total.toFixed(2)}`, align: 'right' },
];

const PER_PAGE = 5;

export default function DashboardTable() {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);

  const filtered = orders.filter((o) => {
    const q = query.trim().toLowerCase();
    return !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.status.toLowerCase().includes(q);
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Card variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }}>
            <Box>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
                Recent orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filtered.length} of {orders.length} orders
              </Typography>
            </Box>
            <TextField
              label="Search orders"
              size="sm"
              variant="soft"
              startIcon={<SearchIcon fontSize="small" />}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              sx={{ width: { xs: '100%', sm: 260 } }}
            />
          </Stack>
          <Box sx={{ mt: 2.5, overflowX: 'auto' }}>
            <Table<Order>
              data={rows}
              columns={columns}
              getRowId={(row) => row.id}
              caption="Recent Acme orders"
              hoverable
              emptyContent={<Typography color="text.secondary">No orders match “{query}”.</Typography>}
            />
          </Box>
          <Stack direction="row" justifyContent="center" sx={{ mt: 2.5 }}>
            <Pagination
              count={pageCount}
              page={current}
              onChange={(_e, n) => setPage(n)}
              size="sm"
              aria-label="Orders pagination"
            />
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
