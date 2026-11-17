'use client';
// @example {"title":"Striped, dense and variants","description":"striped shades alternate rows, dense tightens the padding, and variant restyles the header."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Switch, Table, ToggleButton, ToggleButtonGroup, type TableColumn } from '@sorbet-ui/react';

type Row = { key: string; plan: string; seats: number; price: string };

const rows: Row[] = [
  { key: 'solo', plan: 'Solo', seats: 1, price: '$0' },
  { key: 'team', plan: 'Team', seats: 10, price: '$29' },
  { key: 'business', plan: 'Business', seats: 50, price: '$99' },
  { key: 'org', plan: 'Organization', seats: 250, price: 'Custom' },
];

const columns: TableColumn<Row>[] = [
  { id: 'plan', header: 'Plan', accessor: 'plan' },
  { id: 'seats', header: 'Seats', accessor: 'seats', align: 'right' },
  { id: 'price', header: 'Monthly', accessor: 'price', align: 'right' },
];

export default function DensityAndStripes() {
  const [striped, setStriped] = React.useState(true);
  const [dense, setDense] = React.useState(false);
  const [variant, setVariant] = React.useState<'solid' | 'soft' | 'outlined'>('soft');
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
        <ToggleButtonGroup exclusive size="sm" value={variant} onChange={(_e, next) => next && setVariant(next)} aria-label="Table variant">
          <ToggleButton value="solid">Solid</ToggleButton>
          <ToggleButton value="soft">Soft</ToggleButton>
          <ToggleButton value="outlined">Outlined</ToggleButton>
        </ToggleButtonGroup>
        <Switch size="sm" label="Striped" checked={striped} onChange={(_e, on) => setStriped(on)} />
        <Switch size="sm" label="Dense" checked={dense} onChange={(_e, on) => setDense(on)} />
      </Stack>
      <Table aria-label="Plans, styled" data={rows} columns={columns} getRowId={(row) => row.key} variant={variant} striped={striped} dense={dense} />
    </Stack>
  );
}
