'use client';
// @example {"title":"Selectable","description":"selectable adds checkboxes. Selection is controlled through selected and onSelectionChange."}
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Table, type TableColumn } from '@sorbet-ui/react';

type Invoice = { id: string; customer: string; amount: string };

const invoices: Invoice[] = [
  { id: 'INV-001', customer: 'Sample Co', amount: '$120.00' },
  { id: 'INV-002', customer: 'Example Ltd', amount: '$48.50' },
  { id: 'INV-003', customer: 'Placeholder Inc', amount: '$310.00' },
];

const columns: TableColumn<Invoice>[] = [
  { id: 'id', header: 'Invoice', accessor: 'id' },
  { id: 'customer', header: 'Customer', accessor: 'customer' },
  { id: 'amount', header: 'Amount', accessor: 'amount', align: 'right' },
];

export default function Selectable() {
  const [selected, setSelected] = React.useState<string[]>(['INV-002']);
  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
        <Typography variant="body2" color="text.secondary" role="status">
          {selected.length} of {invoices.length} selected
        </Typography>
        <Button size="sm" variant="soft" color="danger" disabled={selected.length === 0} onClick={() => setSelected([])}>
          Clear selection
        </Button>
      </Stack>
      <Box>
        <Table
          aria-label="Invoices, selectable"
          data={invoices}
          columns={columns}
          getRowId={(row) => row.id}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
        />
      </Box>
    </Stack>
  );
}
