'use client';
// @example {"title":"Pagination","description":"pagination pages the rows on the client and adds a rows-per-page picker."}
import { Box } from '@mui/material';
import { Table, type TableColumn } from '@sorbet-ui/react';

type Build = { id: string; branch: string; duration: string };

// Sample rows, generated so the example stays short.
const builds: Build[] = Array.from({ length: 23 }, (_, i) => ({
  id: `#${240 - i}`,
  branch: ['main', 'feat/search', 'fix/focus-ring', 'docs/examples'][i % 4],
  duration: `${1 + (i % 3)}m ${10 + ((i * 7) % 50)}s`,
}));

const columns: TableColumn<Build>[] = [
  { id: 'id', header: 'Build', accessor: 'id' },
  { id: 'branch', header: 'Branch', accessor: 'branch' },
  { id: 'duration', header: 'Duration', accessor: 'duration', align: 'right' },
];

export default function Pagination() {
  return (
    <Box sx={{ width: '100%' }}>
      <Table aria-label="Builds, paginated" data={builds} columns={columns} getRowId={(row) => row.id} pagination rowsPerPage={5} rowsPerPageOptions={[5, 10, 25]} />
    </Box>
  );
}
