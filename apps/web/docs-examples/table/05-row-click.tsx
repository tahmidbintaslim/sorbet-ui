'use client';
// @example {"title":"Row click","description":"onRowClick makes rows focusable; Enter or Space activates the focused row."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Table, type TableColumn } from '@sorbet-ui/react';

type Order = { id: string; item: string; status: string };

const orders: Order[] = [
  { id: 'A-1041', item: 'Mango sorbet, 2 tubs', status: 'Packed' },
  { id: 'A-1042', item: 'Waffle cones, 24', status: 'Shipped' },
  { id: 'A-1043', item: 'Raspberry ripple, 1 tub', status: 'Delivered' },
];

const columns: TableColumn<Order>[] = [
  { id: 'id', header: 'Order', accessor: 'id' },
  { id: 'item', header: 'Item', accessor: 'item' },
  { id: 'status', header: 'Status', accessor: 'status' },
];

export default function RowClick() {
  const [opened, setOpened] = React.useState<Order | null>(null);
  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      <Table aria-label="Orders, clickable rows" data={orders} columns={columns} getRowId={(row) => row.id} onRowClick={setOpened} />
      <Typography variant="body2" color="text.secondary" role="status">
        {opened ? `Opened ${opened.id}: ${opened.item}` : 'Click a row, or focus it and press Enter.'}
      </Typography>
    </Stack>
  );
}
