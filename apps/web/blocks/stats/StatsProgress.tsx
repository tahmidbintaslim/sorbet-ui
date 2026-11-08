'use client';
// @block {"name":"KPI progress","description":"KPI cards showing progress toward sample quarterly goals."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Card, Chip, Progress } from '@sorbet-ui/react';

const KPIS = [
  { label: 'Quarterly revenue', value: '$84k', goal: '$120k goal', percent: 70, color: 'primary', trend: '+12%' },
  { label: 'Active workspaces', value: '1,920', goal: '2,000 goal', percent: 96, color: 'success', trend: '+8%' },
  { label: 'Tickets resolved', value: '640', goal: '1,000 goal', percent: 64, color: 'warning', trend: '+3%' },
  { label: 'Roadmap shipped', value: '9 of 15', goal: '15 items', percent: 60, color: 'secondary', trend: '+2' },
] as const;

export default function StatsProgress() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, mb: 5 }}
        >
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em' }}>
            Q3 goals
          </Typography>
          <Chip size="sm" variant="soft" color="neutral" label="Sample data" />
        </Stack>
        <Grid container spacing={2}>
          {KPIS.map((k) => (
            <Grid key={k.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }} spacing={1}>
                  <Typography component="h3" color="text.secondary" sx={{ fontWeight: 600, fontSize: 14 }}>
                    {k.label}
                  </Typography>
                  <Chip size="xs" variant="soft" color="success" label={k.trend} />
                </Stack>
                <Typography sx={{ fontWeight: 800, fontSize: 34, letterSpacing: '-0.03em', mt: 1.5 }}>{k.value}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Progress value={k.percent} color={k.color} size="sm" aria-label={`${k.label}: ${k.percent}% of goal`} />
                </Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {k.goal}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {k.percent}%
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
