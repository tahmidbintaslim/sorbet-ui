'use client';
// @block {"name":"Star ratings","description":"Sample reviews with read-only star ratings and an average score."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Avatar, Card, Rating } from '@sorbet-ui/react';

const REVIEWS = [
  { rating: 5, title: 'Our new default', body: 'Replaced our tracker and two spreadsheets in a week.', name: 'Sam Rivera', role: 'Product lead, Acme', initials: 'SR', color: 'primary' },
  { rating: 5, title: 'Fast and focused', body: 'Keyboard shortcuts everywhere. I barely touch the mouse.', name: 'Casey Park', role: 'Support lead, Vandelay', initials: 'CP', color: 'info' },
  { rating: 4, title: 'Great for small teams', body: 'Exactly enough structure without slowing us down.', name: 'Alex Morgan', role: 'CTO, Umbrella Labs', initials: 'AM', color: 'warning' },
] as const;

export default function TestimonialRating() {
  const average = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, mb: 6 }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em' }}>
              Rated highly by the teams who use it
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Sample testimonials. People, companies and ratings are fictional.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 40, letterSpacing: '-0.03em' }}>{average.toFixed(1)}</Typography>
            <Box>
              <Rating value={average} precision={0.1} readOnly color="warning" size="sm" />
              <Typography variant="body2" color="text.secondary">
                Average of {REVIEWS.length} sample reviews
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Grid container spacing={2}>
          {REVIEWS.map((r) => (
            <Grid key={r.name} size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Rating value={r.rating} readOnly color="warning" size="sm" />
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18, mt: 1.5 }}>
                  {r.title}
                </Typography>
                <Typography component="blockquote" color="text.secondary" sx={{ m: 0, mt: 1, flex: 1 }}>
                  {r.body}
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: 3 }}>
                  <Avatar size="sm" variant="soft" color={r.color} aria-hidden>
                    {r.initials}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{r.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.role}
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
