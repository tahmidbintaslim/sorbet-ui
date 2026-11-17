'use client';
// @example {"title":"Custom cells","description":"cell renders anything in a column: a chip, an avatar, a formatted number."}
import { Box, Stack } from '@mui/material';
import { Avatar, Chip, Table, type TableColumn } from '@sorbet-ui/react';

type Deploy = { id: string; author: string; status: 'Ready' | 'Building' | 'Failed'; size: number };

const deploys: Deploy[] = [
  { id: 'd1', author: 'Ada Lovelace', status: 'Ready', size: 182 },
  { id: 'd2', author: 'Grace Hopper', status: 'Building', size: 240 },
  { id: 'd3', author: 'Katherine Johnson', status: 'Failed', size: 96 },
];

const STATUS_COLOR = { Ready: 'success', Building: 'info', Failed: 'danger' } as const;
const initials = (name: string) => name.split(' ').map((part) => part[0]).join('');

const columns: TableColumn<Deploy>[] = [
  {
    id: 'author',
    header: 'Author',
    accessor: 'author',
    cell: (_value, row) => (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Avatar size="xs" variant="soft">
          {initials(row.author)}
        </Avatar>
        <span>{row.author}</span>
      </Stack>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    cell: (_value, row) => <Chip size="sm" variant="soft" color={STATUS_COLOR[row.status]} label={row.status} />,
  },
  { id: 'size', header: 'Bundle', accessor: 'size', align: 'right', cell: (value) => `${value} kB` },
];

export default function CustomCells() {
  return (
    <Box sx={{ width: '100%' }}>
      <Table aria-label="Deploys, custom cells" data={deploys} columns={columns} getRowId={(row) => row.id} />
    </Box>
  );
}
