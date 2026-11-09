'use client';
// @block {"name":"Comparison table","description":"Feature-by-feature plan comparison with check icons."}
import { Box, Container, Stack, Typography } from '@mui/material';
import Check from '@mui/icons-material/Check';
import Remove from '@mui/icons-material/Remove';
import { Button, Card, Chip, Table, type TableColumn } from '@sorbet-ui/react';

type Value = boolean | string;
type Row = { id: string; feature: string; starter: Value; team: Value; business: Value };

const ROWS: Row[] = [
  { id: 'members', feature: 'Members', starter: 'Up to 3', team: 'Unlimited', business: 'Unlimited' },
  { id: 'projects', feature: 'Projects', starter: '2', team: 'Unlimited', business: 'Unlimited' },
  { id: 'history', feature: 'Version history', starter: '7 days', team: '90 days', business: 'Unlimited' },
  { id: 'automations', feature: 'Automations', starter: false, team: true, business: true },
  { id: 'guests', feature: 'Guest access', starter: false, team: true, business: true },
  { id: 'sso', feature: 'SSO (SAML)', starter: false, team: false, business: true },
  { id: 'audit', feature: 'Audit log', starter: false, team: false, business: true },
  { id: 'support', feature: 'Support', starter: 'Community', team: 'Email', business: 'Priority' },
];

function renderValue(value: unknown) {
  if (value === true) return <Check color="success" titleAccess="Included" />;
  if (value === false) return <Remove sx={{ color: 'text.disabled' }} titleAccess="Not included" />;
  return <Typography variant="body2">{String(value)}</Typography>;
}

const PLANS = [
  { key: 'starter', name: 'Starter' },
  { key: 'team', name: 'Team' },
  { key: 'business', name: 'Business' },
] as const;

const COLUMNS: TableColumn<Row>[] = [
  {
    id: 'feature',
    header: 'Feature',
    accessor: 'feature',
    cell: (v) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {String(v)}
      </Typography>
    ),
  },
  { id: 'starter', header: 'Starter', accessor: 'starter', align: 'center', cell: renderValue },
  { id: 'team', header: 'Team', accessor: 'team', align: 'center', cell: renderValue },
  { id: 'business', header: 'Business', accessor: 'business', align: 'center', cell: renderValue },
];

export default function PricingCompare() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, mb: 4 }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Chip label="Compare plans" variant="soft" color="primary" />
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em', mt: 2 }}>
              Find the plan that fits
            </Typography>
          </Box>
          <Button variant="outlined">Talk to sales</Button>
        </Stack>
        {/* Phones: one list per plan, so no column is hidden off-screen. */}
        <Stack spacing={2} sx={{ display: { xs: 'flex', sm: 'none' } }}>
          {PLANS.map((plan) => (
            <Card key={plan.key} variant="outlined" sx={{ p: 2.5 }}>
              <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18 }}>
                {plan.name}
              </Typography>
              <Box component="dl" sx={{ m: 0, mt: 1 }}>
                {ROWS.map((row) => (
                  <Stack
                    key={row.id}
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: 'center', py: 1, borderTop: 1, borderColor: 'divider' }}
                  >
                    <Typography component="dt" variant="body2" sx={{ fontWeight: 600 }}>
                      {row.feature}
                    </Typography>
                    <Box component="dd" sx={{ m: 0, display: 'flex' }}>
                      {renderValue(row[plan.key])}
                    </Box>
                  </Stack>
                ))}
              </Box>
            </Card>
          ))}
        </Stack>
        <Box tabIndex={0} role="region" aria-label="Plan comparison table" sx={{ overflowX: 'auto', display: { xs: 'none', sm: 'block' } }}>
          <Box sx={{ minWidth: 600 }}>
            <Table data={ROWS} columns={COLUMNS} striped getRowId={(r) => r.id} caption="Plan comparison" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
