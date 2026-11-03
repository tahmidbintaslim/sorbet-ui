'use client';
// @block {"name":"Steps","description":"Three numbered steps in a row that stack on small screens."}
import { Box, Container, Grid, Typography } from '@mui/material';
import { Avatar, Chip } from '@sorbet-ui/react';

const STEPS = [
  { title: 'Connect your tools', body: 'Link your repo and chat in a couple of clicks. No scripts to maintain.' },
  { title: 'Plan the work', body: 'Drag ideas into a sprint, set owners and agree on what done means.' },
  { title: 'Ship and measure', body: 'Release behind a flag, watch adoption and roll out when it is ready.' },
];

export default function FeatureSteps() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 620, mx: 'auto', textAlign: 'center', mb: 7 }}>
          <Chip label="How it works" variant="soft" color="primary" />
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em', mt: 2 }}>
            Up and running in three steps
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 5, md: 4 }} component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {STEPS.map((step, i) => (
            <Grid key={step.title} size={{ xs: 12, md: 4 }} component="li" sx={{ position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <Box
                  aria-hidden
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'absolute',
                    top: 28,
                    left: 72,
                    right: 8,
                    borderTop: 2,
                    borderStyle: 'dashed',
                    borderColor: 'divider',
                  }}
                />
              )}
              <Avatar size="lg" variant="solid" color="primary" aria-hidden>
                {i + 1}
              </Avatar>
              <Typography component="h3" sx={{ fontWeight: 700, fontSize: 20, mt: 2.5 }}>
                {step.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 340 }}>
                {step.body}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
