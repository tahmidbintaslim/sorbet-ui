'use client';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Alert, Button, Chip } from '@sorbet-ui/react';

const CODE = `const client = new Acme({ key: process.env.ACME_KEY });

await client.events.send({
  name: 'signup',
  user: { id: 'u_123' },
});`;

export default function HeroCode() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Alert color="info" sx={{ maxWidth: 520, mb: 4 }}>
          The v3 SDK is out. Read the migration guide.
        </Alert>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 38, md: 54 }, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Event tracking in five lines
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 18, mt: 2.5 }}>
              Typed SDKs for every runtime. Send an event, see it in the dashboard a second later.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 3 }} flexWrap="wrap" useFlexGap>
              {['Node', 'Edge', 'Python', 'Go'].map((r) => (
                <Chip key={r} label={r} variant="outlined" color="neutral" />
              ))}
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
              <Button size="lg">Read the docs</Button>
              <Button size="lg" variant="soft">
                Get an API key
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
            <Box
              component="pre"
              tabIndex={0}
              aria-label="SDK example"
              sx={{ m: 0, p: 3, borderRadius: 3, bgcolor: '#0b1220', color: '#e2e8f0', fontSize: 14, lineHeight: 1.7, overflowX: 'auto', fontFamily: 'ui-monospace, monospace' }}
            >
              {CODE}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
