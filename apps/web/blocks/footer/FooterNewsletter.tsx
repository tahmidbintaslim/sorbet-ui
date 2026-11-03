'use client';
// @block {"name":"Newsletter footer","description":"Footer with a newsletter signup, a row of links and a copyright line."}
import * as React from 'react';
import { Box, Container, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import { Alert, Button, TextField } from '@sorbet-ui/react';

const LINKS = ['Product', 'Pricing', 'Docs', 'Blog', 'Careers', 'Contact'];

export default function FooterNewsletter() {
  const [sent, setSent] = React.useState(false);
  return (
    <Box component="footer" sx={{ py: { xs: 8, md: 12 }, borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.03em' }}>
              Stay in the loop
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Product updates and practical tips from the Acme team, twice a month.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {sent ? (
              <Alert color="success">You are subscribed. Watch your inbox for a confirmation.</Alert>
            ) : (
              <Box
                component="form"
                onSubmit={(e: React.FormEvent) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField label="Email address" type="email" required variant="soft" autoComplete="email" sx={{ flex: 1 }} />
                  <Button type="submit" size="lg">
                    Subscribe
                  </Button>
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: { xs: 4, md: 6 } }} />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>Acme</Typography>
          <Stack
            component="nav"
            aria-label="Newsletter footer links"
            direction="row"
            spacing={3}
            useFlexGap
            flexWrap="wrap"
            rowGap={1}
          >
            {LINKS.map((l) => (
              <Link key={l} href="#" color="text.secondary" underline="hover" variant="body2">
                {l}
              </Link>
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            © 2026 Acme, Inc.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
