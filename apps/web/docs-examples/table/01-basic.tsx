'use client';
// @example {"title":"Basic","description":"Pass rows as data and describe each column with an id, a header and an accessor."}
import { Box } from '@mui/material';
import { Table, type TableColumn } from '@sorbet-ui/react';

type Member = { id: string; name: string; role: string; team: string };

const members: Member[] = [
  { id: 'm1', name: 'Ada Lovelace', role: 'Engineer', team: 'Platform' },
  { id: 'm2', name: 'Grace Hopper', role: 'Staff engineer', team: 'Compilers' },
  { id: 'm3', name: 'Katherine Johnson', role: 'Analyst', team: 'Research' },
];

const columns: TableColumn<Member>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'role', header: 'Role', accessor: 'role' },
  { id: 'team', header: 'Team', accessor: 'team' },
];

export default function Basic() {
  return (
    <Box sx={{ width: '100%' }}>
      <Table data={members} columns={columns} caption="Team members" />
    </Box>
  );
}
