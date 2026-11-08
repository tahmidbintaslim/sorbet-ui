'use client';
// @block {"name":"Single plan","description":"One plan card with a price, an included list and a call to action."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { Button, Card, Chip } from '@sorbet-ui/react';

const INCLUDED = [
  'Unlimited projects and members',
  'Automations and integrations',
  'SSO and audit log',
  'Priority email support',
  '99.9% uptime target',
  'Export your data any time',
];

export default function PricingSimple() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto', mb: 6 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em' }}>
            One plan. Everything included.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            No tiers to compare and no surprise add-ons. Sample pricing shown.
          </Typography>
        </Box>
        <Card variant="outlined" sx={{ maxWidth: 880, mx: 'auto', p: 0 }}>
          <Grid container>
            <Grid size={{ xs: 12, md: 7 }} sx={{ p: { xs: 3, md: 5 } }}>
              <Typography component="h3" sx={{ fontWeight: 700, fontSize: 22 }}>
                Acme Pro
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Everything your team needs to plan, build and ship.
              </Typography>
              <Typography sx={{ fontWeight: 700, mt: 4, mb: 2 }}>What&apos;s included</Typography>
              <Grid container component="ul" spacing={1.5} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {INCLUDED.map((item) => (
                  <Grid key={item} size={{ xs: 12, sm: 6 }} component="li">
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                      <CheckCircle fontSize="small" color="primary" aria-hidden sx={{ mt: 0.25 }} />
                      <Typography variant="body2">{item}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                p: { xs: 3, md: 5 },
                borderTop: { xs: 1, md: 0 },
                borderLeft: { xs: 0, md: 1 },
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Box>
                <Chip size="sm" label="Billed monthly" variant="soft" color="secondary" />
              </Box>
              <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'center', alignItems: 'baseline', mt: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 52, letterSpacing: '-0.04em' }}>$15</Typography>
                <Typography color="text.secondary">/ member</Typography>
              </Stack>
              <Button size="lg" shape="block" sx={{ mt: 3 }}>
                Get started
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
                14-day free trial. Cancel any time.
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}
