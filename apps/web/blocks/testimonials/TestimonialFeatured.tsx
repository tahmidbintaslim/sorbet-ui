'use client';
// @block {"name":"Featured quote","description":"One large sample quote with two supporting quotes beside it."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import FormatQuote from '@mui/icons-material/FormatQuote';
import { Avatar, Card } from '@sorbet-ui/react';

const SIDE = [
  { quote: 'We retired three tools the month we switched.', name: 'Priya Kapoor', role: 'Engineering manager, Globex', initials: 'PK', color: 'secondary' },
  { quote: 'Onboarding new hires is now a single link.', name: 'Jordan Lee', role: 'Design lead, Initech', initials: 'JL', color: 'success' },
] as const;

export default function TestimonialFeatured() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em' }}>
          What teams are saying
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, mb: 5 }}>
          Sample testimonials. People and companies are fictional.
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="soft" color="primary" sx={{ p: { xs: 3, md: 6 }, height: '100%' }}>
              <FormatQuote sx={{ fontSize: 48, color: 'primary.main' }} aria-hidden />
              <Typography
                component="blockquote"
                sx={{ m: 0, mt: 1, fontWeight: 600, fontSize: { xs: 22, md: 30 }, lineHeight: 1.3, letterSpacing: '-0.02em' }}
              >
                Acme gave us one place to see the whole roadmap. Our releases are smaller, more frequent and far less
                stressful.
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 4 }}>
                <Avatar size="lg" variant="solid" color="primary" aria-hidden>
                  SR
                </Avatar>
                <Box>
                  <Typography component="h3" sx={{ fontWeight: 700 }}>
                    Sam Rivera
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Product lead, Acme
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {SIDE.map((q) => (
                <Card key={q.name} variant="outlined" sx={{ p: 3, flex: 1 }}>
                  <Typography component="blockquote" sx={{ m: 0 }}>
                    &ldquo;{q.quote}&rdquo;
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2.5 }}>
                    <Avatar size="sm" variant="soft" color={q.color} aria-hidden>
                      {q.initials}
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
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
