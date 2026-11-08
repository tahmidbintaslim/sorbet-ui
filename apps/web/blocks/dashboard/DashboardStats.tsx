'use client';
// @block {"name":"KPI cards","description":"Four headline metrics with change-since-last-period chips."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Card, Chip } from '@sorbet-ui/react';

const stats = [
  { label: 'Revenue', value: '$48,290', delta: 12.4, note: 'vs. last month' },
  { label: 'New customers', value: '1,204', delta: 8.1, note: 'vs. last month' },
  { label: 'Churn rate', value: '2.3%', delta: -0.4, note: 'vs. last month', lowerIsBetter: true },
  { label: 'Avg. order value', value: '$86.40', delta: -3.2, note: 'vs. last month' },
];

export default function DashboardStats() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 32 }, letterSpacing: '-0.03em' }}>
          Overview
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
          Acme store performance for October.
        </Typography>
        <Grid container spacing={2}>
          {stats.map((s) => {
            const up = s.delta >= 0;
            const good = s.lowerIsBetter ? !up : up;
            return (
              <Grid key={s.label} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                  <Typography component="h3" variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {s.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', mt: 1 }}>{s.value}</Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.5 }}>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={good ? 'success' : 'danger'}
                      icon={up ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      label={`${up ? '+' : ''}${s.delta}%`}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {s.note}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
