'use client';
// @example {"title":"Sortable","description":"The table reports the requested sort; you sort the rows. Click a header to try it."}
import * as React from 'react';
import { Box } from '@mui/material';
import { Table, type TableColumn } from '@sorbet-ui/react';

type Project = { id: string; name: string; deploys: number; region: string };

const projects: Project[] = [
  { id: 'p1', name: 'Mango', deploys: 42, region: 'Europe' },
  { id: 'p2', name: 'Raspberry', deploys: 7, region: 'Asia Pacific' },
  { id: 'p3', name: 'Mint', deploys: 128, region: 'United States' },
  { id: 'p4', name: 'Lemon', deploys: 19, region: 'Europe' },
];

const columns: TableColumn<Project>[] = [
  { id: 'name', header: 'Project', accessor: 'name' },
  { id: 'deploys', header: 'Deploys', accessor: 'deploys', align: 'right' },
  { id: 'region', header: 'Region', accessor: 'region', sortable: false },
];

export default function Sortable() {
  const [sortBy, setSortBy] = React.useState('name');
  const [direction, setDirection] = React.useState<'asc' | 'desc'>('asc');
  const sorted = React.useMemo(() => {
    const key = sortBy as keyof Project;
    const rows = [...projects].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
    return direction === 'asc' ? rows : rows.reverse();
  }, [sortBy, direction]);
  return (
    <Box sx={{ width: '100%' }}>
      <Table
        aria-label="Projects, sortable"
        data={sorted}
        columns={columns}
        getRowId={(row) => row.id}
        sortable
        sortBy={sortBy}
        sortDirection={direction}
        onSortChange={(columnId, next) => {
          setSortBy(columnId);
          setDirection(next);
        }}
      />
    </Box>
  );
}
