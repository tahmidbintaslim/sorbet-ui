'use client';
// Filters + table: chips are toggle buttons that narrow a Sorbet Table.
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Chip, Table, type TableColumn } from '@sorbet-ui/react';
import type { Color } from '@/lib/site';
import { touchTarget } from '@/lib/touch';

type Row = { flavor: string; kind: 'Sorbet' | 'Gelato' | 'Froyo'; tubs: number; price: string };
const ROWS: Row[] = [
  { flavor: 'Raspberry Ripple', kind: 'Sorbet', tubs: 14, price: '$4.50' },
  { flavor: 'Mango Tango', kind: 'Sorbet', tubs: 3, price: '$4.50' },
  { flavor: 'Ube Swirl', kind: 'Gelato', tubs: 2, price: '$5.00' },
  { flavor: 'Sea Salt Caramel', kind: 'Gelato', tubs: 11, price: '$5.00' },
  { flavor: 'Garden Mint', kind: 'Froyo', tubs: 9, price: '$4.00' },
];
const KINDS = ['All', 'Sorbet', 'Gelato', 'Froyo'] as const;
const KIND_COLOR: Record<Row['kind'], Color> = { Sorbet: 'danger', Gelato: 'secondary', Froyo: 'success' };

const COLUMNS: TableColumn<Row>[] = [
  { id: 'flavor', header: 'Flavor', accessor: 'flavor' },
  { id: 'kind', header: 'Kind', accessor: 'kind', cell: (v) => <Chip label={String(v)} size="xs" variant="soft" color={KIND_COLOR[v as Row['kind']]} disableAnimation /> },
  { id: 'tubs', header: 'Tubs', accessor: 'tubs', align: 'right' },
];

export default function Filters() {
  const [kind, setKind] = React.useState<(typeof KINDS)[number]>('All');
  const [lowOnly, setLowOnly] = React.useState(false);
  const rows = ROWS.filter((r) => (kind === 'All' || r.kind === kind) && (!lowOnly || r.tubs < 5));
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.25, p: 1.5 }}>
      <Box role="group" aria-label="Filter flavors" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
        {KINDS.map((k) => (
          <Chip key={k} label={k} size="sm" color="primary" variant={kind === k ? 'solid' : 'outlined'} aria-pressed={kind === k} onClick={() => setKind(k)} sx={touchTarget} />
        ))}
        <Chip label="Low stock" size="sm" color="warning" variant={lowOnly ? 'solid' : 'outlined'} aria-pressed={lowOnly} onClick={() => setLowOnly((v) => !v)} sx={touchTarget} />
      </Box>
      <Box sx={(t) => ({ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: 3, bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}` })}>
        <Table<Row>
          caption="Flavors in the freezer"
          size="sm"
          variant="plain"
          data={rows}
          columns={COLUMNS}
          getRowId={(r) => r.flavor}
          emptyContent="No flavors match these filters."
        />
      </Box>
      <Typography role="status" sx={{ fontSize: 12.5, color: 'text.secondary', px: 0.5 }}>
        {rows.length} of {ROWS.length} flavors
      </Typography>
    </Box>
  );
}
