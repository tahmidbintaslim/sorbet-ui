'use client';
// @block {"name":"Quote grid","description":"Six short sample quotes in a responsive grid of cards."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Avatar, Card, Chip } from '@sorbet-ui/react';

const QUOTES = [
  { quote: 'Our planning meeting went from an hour to fifteen minutes.', name: 'Sam Rivera', role: 'Product lead, Acme', color: 'primary' },
  { quote: 'The automations alone saved our team a day every sprint.', name: 'Priya Kapoor', role: 'Engineering manager, Globex', color: 'secondary' },
  { quote: 'Finally a tool the designers and engineers both enjoy using.', name: 'Jordan Lee', role: 'Design lead, Initech', color: 'success' },
  { quote: 'Setup took one afternoon. We moved every project over that week.', name: 'Alex Morgan', role: 'CTO, Umbrella Labs', color: 'warning' },
  { quote: 'Weekly reports write themselves, and leadership actually reads them.', name: 'Taylor Chen', role: 'Operations, Hooli', color: 'info' },
  { quote: 'Search is so fast it feels like the app reads your mind.', name: 'Casey Park', role: 'Support lead, Vandelay', color: 'danger' },
] as const;

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('');
}

export default function TestimonialGrid() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 620, mb: 6 }}>
          <Chip label="Testimonials" variant="soft" color="primary" />
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em', mt: 2 }}>
            Teams that ship with Acme
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Sample testimonials. People and companies are fictional.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {QUOTES.map((q) => (
            <Grid key={q.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography component="blockquote" sx={{ m: 0, flex: 1, fontSize: 17 }}>
                  &ldquo;{q.quote}&rdquo;
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
                  <Avatar variant="soft" color={q.color} aria-hidden>
                    {initials(q.name)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography component="h3" sx={{ fontWeight: 700, fontSize: 15 }}>
                      {q.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {q.role}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
