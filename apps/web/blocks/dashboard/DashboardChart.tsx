'use client';
// @block {"name":"Bar chart","description":"Revenue bar chart drawn with plain boxes, with tabs to switch the time range."}
import * as React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Card, Tabs } from '@sorbet-ui/react';

type Range = '7d' | '30d' | '12m';

const data: Record<Range, { label: string; total: string; points: [string, number][] }> = {
  '7d': {
    label: 'last 7 days',
    total: '$12,480',
    points: [['Mon', 1420], ['Tue', 1890], ['Wed', 1610], ['Thu', 2240], ['Fri', 2680], ['Sat', 1530], ['Sun', 1110]],
  },
  '30d': {
    label: 'last 30 days',
    total: '$48,290',
    points: [['Wk 1', 10200], ['Wk 2', 12850], ['Wk 3', 11400], ['Wk 4', 13840]],
  },
  '12m': {
    label: 'last 12 months',
    total: '$512,700',
    points: [
      ['Nov', 34], ['Dec', 51], ['Jan', 29], ['Feb', 31], ['Mar', 38], ['Apr', 40],
      ['May', 42], ['Jun', 39], ['Jul', 44], ['Aug', 47], ['Sep', 45], ['Oct', 48],
    ].map(([m, k]) => [m as string, (k as number) * 1000 + 300]),
  },
};

const fmt = (n: number) => (n >= 10000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString('en-US')}`);

function Bars({ range }: { range: Range }) {
  const { points, label } = data[range];
  const max = Math.max(...points.map((p) => p[1]));
  const description = `Revenue for the ${label}: ${points.map(([k, v]) => `${k} ${fmt(v)}`).join(', ')}.`;
  return (
    <Box role="img" aria-label={description} sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1.5 }, height: 220, borderBottom: 1, borderColor: 'divider' }}>
        {points.map(([k, v]) => (
          <Box key={k} sx={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Typography aria-hidden variant="caption" color="text.secondary" sx={{ mb: 0.5, display: { xs: points.length > 7 ? 'none' : 'block', sm: 'block' }, fontSize: 11 }}>
              {fmt(v)}
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: 48,
                height: `${(v / max) * 85}%`,
                bgcolor: v === max ? 'primary.main' : 'primary.light',
                borderRadius: '6px 6px 0 0',
                transition: 'height 200ms ease',
              }}
            />
          </Box>
        ))}
      </Box>
      <Box aria-hidden sx={{ display: 'flex', gap: { xs: 0.5, sm: 1.5 }, mt: 1 }}>
        {points.map(([k]) => (
          <Typography key={k} variant="caption" color="text.secondary" sx={{ flex: 1, minWidth: 0, textAlign: 'center', overflow: 'hidden', fontSize: { xs: 10, sm: 12 } }}>
            {k}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default function DashboardChart() {
  const [range, setRange] = React.useState<Range>('7d');
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-start' }} spacing={2}>
            <Box>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
                Revenue
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', mt: 0.5 }}>{data[range].total}</Typography>
              <Typography variant="body2" color="text.secondary">
                Acme store, {data[range].label}
              </Typography>
            </Box>
            <Tabs
              aria-label="Chart range"
              variant="soft"
              size="sm"
              value={range}
              onChange={(id) => setRange(id as Range)}
              renderPanels={false}
              tabs={[
                { id: '7d', label: '7 days' },
                { id: '30d', label: '30 days' },
                { id: '12m', label: '12 months' },
              ]}
            />
          </Stack>
          <Bars range={range} />
        </Card>
      </Container>
    </Box>
  );
}
