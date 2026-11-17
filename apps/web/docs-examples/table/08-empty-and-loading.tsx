'use client';
// @example {"title":"Empty and loading","description":"emptyContent replaces the rows when there is no data; loading dims the table and sets aria-busy."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Button, Table, type TableColumn } from '@sorbet-ui/react';

type Key = { id: string; name: string; created: string };

const sample: Key[] = [
  { id: 'k1', name: 'Production', created: '3 Nov 2026' },
  { id: 'k2', name: 'Staging', created: '9 Nov 2026' },
];

const columns: TableColumn<Key>[] = [
  { id: 'name', header: 'Key name', accessor: 'name' },
  { id: 'created', header: 'Created', accessor: 'created' },
];

export default function EmptyAndLoading() {
  const [rows, setRows] = React.useState<Key[]>([]);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const load = () => {
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setRows(sample);
      setLoading(false);
    }, 1200);
  };
  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <Button size="sm" onClick={load} disabled={loading}>
          Load keys
        </Button>
        <Button size="sm" variant="outlined" color="neutral" onClick={() => setRows([])} disabled={loading || rows.length === 0}>
          Clear
        </Button>
      </Stack>
      <Table
        aria-label="API keys"
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        emptyContent={<Typography color="text.secondary">No API keys yet. Load the sample keys to see rows.</Typography>}
      />
    </Stack>
  );
}
