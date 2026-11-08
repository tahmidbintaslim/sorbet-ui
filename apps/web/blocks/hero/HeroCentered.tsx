'use client';
// @block {"name": "Centered", "description": "Badge, headline, two actions and a row of cards."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Button, Card, Chip } from '@sorbet-ui/react';

const CARDS = [
  { title: 'Plan', body: 'Roadmaps your whole team can read.', color: 'primary' },
  { title: 'Build', body: 'Ship from one shared board.', color: 'secondary' },
  { title: 'Review', body: 'Feedback where the work is.', color: 'success' },
] as const;

export default function HeroCentered() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Chip label="New · Acme 2.0" variant="soft" color="secondary" />
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 40, md: 60 }, letterSpacing: '-0.04em', lineHeight: 1.05, mt: 3 }}>
          Plan, build and ship in one place
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 19, mt: 2.5, maxWidth: 560, mx: 'auto' }}>
          Acme keeps your roadmap, tasks and reviews together, so the team always knows what ships next.
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', mt: 4 }}>
          <Button size="lg">Start free</Button>
          <Button size="lg" variant="ghost">
            Book a demo
          </Button>
        </Stack>
      </Container>
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={2}>
          {CARDS.map((c) => (
            <Grid key={c.title} size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ p: 3, textAlign: 'left', height: '100%' }}>
                <Chip size="sm" label={c.title} variant="soft" color={c.color} />
                <Typography sx={{ mt: 1.5 }} color="text.secondary">
                  {c.body}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
