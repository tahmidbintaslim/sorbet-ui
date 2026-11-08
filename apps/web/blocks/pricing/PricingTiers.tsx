'use client';
// @block {"name":"Tiers","description":"Three plans with a monthly or yearly toggle that updates the prices."}
import * as React from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Check from '@mui/icons-material/Check';
import { Button, Card, Chip, ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

type Period = 'monthly' | 'yearly';

const PLANS = [
  {
    name: 'Starter',
    blurb: 'For side projects and small teams.',
    monthly: 0,
    yearly: 0,
    features: ['Up to 3 members', '2 projects', 'Community support'],
    featured: false,
  },
  {
    name: 'Team',
    blurb: 'For growing teams that ship every week.',
    monthly: 12,
    yearly: 10,
    features: ['Unlimited members', 'Unlimited projects', 'Automations', 'Email support'],
    featured: true,
  },
  {
    name: 'Business',
    blurb: 'For companies with security needs.',
    monthly: 24,
    yearly: 20,
    features: ['Everything in Team', 'SSO and audit log', 'Custom roles', 'Priority support'],
    featured: false,
  },
];

export default function PricingTiers() {
  const [period, setPeriod] = React.useState<Period>('monthly');
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 620, mx: 'auto' }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em' }}>
            Simple pricing that grows with you
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            Sample prices in USD, per member. Switch to yearly to save about 17%.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <ToggleButtonGroup
              exclusive
              value={period}
              onChange={(_e, v: Period | null) => v && setPeriod(v)}
              aria-label="Billing period"
              variant="soft"
              size="sm"
            >
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        <Grid container spacing={3} sx={{ alignItems: 'stretch', mt: 6 }}>
          {PLANS.map((plan) => {
            const price = period === 'monthly' ? plan.monthly : plan.yearly;
            return (
              <Grid key={plan.name} size={{ xs: 12, md: 4 }}>
                <Card
                  variant={plan.featured ? 'soft' : 'outlined'}
                  color="primary"
                  sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }} spacing={1}>
                    <Typography component="h3" sx={{ fontWeight: 700, fontSize: 20 }}>
                      {plan.name}
                    </Typography>
                    {plan.featured && <Chip size="sm" variant="solid" color="primary" label="Most popular" />}
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {plan.blurb}
                  </Typography>
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline', mt: 3 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em' }}>${price}</Typography>
                    <Typography color="text.secondary">
                      {price === 0 ? 'forever' : period === 'monthly' ? '/ month' : '/ month, billed yearly'}
                    </Typography>
                  </Stack>
                  <Stack component="ul" spacing={1.25} sx={{ listStyle: 'none', p: 0, m: 0, mt: 3, flex: 1 }}>
                    {plan.features.map((f) => (
                      <Stack component="li" key={f} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Check fontSize="small" color="success" aria-hidden />
                        <Typography variant="body2">{f}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button variant={plan.featured ? 'solid' : 'outlined'} shape="block" sx={{ mt: 4 }}>
                    {price === 0 ? 'Start free' : `Choose ${plan.name}`}
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
