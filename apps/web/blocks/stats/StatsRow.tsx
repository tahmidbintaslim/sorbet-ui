'use client';
// @block {"name":"Number row","description":"Four big sample numbers with short labels."}
import { Box, Container, Grid, Typography } from '@mui/material';

const STATS = [
  { value: '12k', label: 'Tasks closed per week' },
  { value: '3.2×', label: 'Faster release cycle' },
  { value: '48', label: 'Countries with active teams' },
  { value: '99.9%', label: 'Uptime target' },
];

export default function StatsRow() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 620, mb: 6 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em' }}>
            Acme by the numbers
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            Sample figures for illustration. Replace them with your own.
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 4, md: 3 }} component="dl" sx={{ m: 0 }}>
          {STATS.map((s) => (
            <Grid
              key={s.label}
              size={{ xs: 6, md: 3 }}
              sx={{ borderLeft: 2, borderColor: 'primary.main', pl: 2.5, display: 'flex', flexDirection: 'column-reverse' }}
            >
              <Typography component="dt" color="text.secondary" sx={{ mt: 0.5 }}>
                {s.label}
              </Typography>
              <Typography
                component="dd"
                sx={{ m: 0, fontWeight: 800, fontSize: { xs: 36, md: 52 }, letterSpacing: '-0.04em', lineHeight: 1 }}
              >
                {s.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
