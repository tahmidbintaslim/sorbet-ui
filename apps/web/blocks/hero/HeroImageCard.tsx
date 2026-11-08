'use client';
// @block {"name":"App preview","description":"Copy on the left, a mock app window built from Card, Table and Chip on the right."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Button, Card, Chip, Table, type TableColumn } from '@sorbet-ui/react';

type Task = { id: string; task: string; owner: string; status: 'Done' | 'In review' | 'Planned' };

const TASKS: Task[] = [
  { id: '1', task: 'Billing page redesign', owner: 'Sam', status: 'Done' },
  { id: '2', task: 'Usage export API', owner: 'Priya', status: 'In review' },
  { id: '3', task: 'Team invites', owner: 'Jordan', status: 'In review' },
  { id: '4', task: 'Audit log filters', owner: 'Lee', status: 'Planned' },
];

const STATUS_COLOR = { Done: 'success', 'In review': 'warning', Planned: 'neutral' } as const;

const COLUMNS: TableColumn<Task>[] = [
  { id: 'task', header: 'Task', accessor: 'task' },
  { id: 'owner', header: 'Owner', accessor: 'owner' },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    cell: (_value, row) => <Chip size="sm" variant="soft" color={STATUS_COLOR[row.status]} label={row.status} />,
  },
];

export default function HeroImageCard() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Chip label="Release tracking" variant="soft" color="primary" />
            <Typography
              component="h2"
              sx={{ fontWeight: 800, fontSize: { xs: 38, md: 52 }, letterSpacing: '-0.04em', lineHeight: 1.05, mt: 2.5 }}
            >
              See every release at a glance
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 18, mt: 2 }}>
              Acme shows who owns what and where it stands, so stand-ups take five minutes instead of thirty.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
              <Button size="lg">Try the demo</Button>
              <Button size="lg" variant="ghost">
                Read the docs
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
              >
                {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                  <Box key={c} aria-hidden sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
                ))}
                <Typography variant="body2" color="text.secondary" sx={{ pl: 1.5 }}>
                  acme.example / sprint-24
                </Typography>
              </Stack>
              <Box sx={{ p: 2 }}>
                <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
                  <Chip size="sm" variant="solid" color="primary" label="Sprint 24" />
                  <Chip size="sm" variant="outlined" color="neutral" label="4 tasks" />
                  <Chip size="sm" variant="outlined" color="success" label="1 shipped" />
                </Stack>
                <Box tabIndex={0} role="region" aria-label="Sprint 24 tasks table" sx={{ overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 420 }}>
                    <Table data={TASKS} columns={COLUMNS} size="sm" hoverable getRowId={(r) => r.id} caption="Sprint 24 tasks" />
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
