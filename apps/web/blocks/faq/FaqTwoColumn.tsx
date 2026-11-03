'use client';
// @block {"name":"Two-column grid","description":"Questions and answers laid out in a two-column grid with a short intro."}
import { Box, Container, Grid, Link, Typography } from '@mui/material';

const FAQS = [
  { q: 'What does Acme cost?', a: 'There is a free plan for small teams. Paid plans are billed per active seat, monthly or yearly.' },
  { q: 'Can I change plans later?', a: 'Upgrade, downgrade or cancel from your workspace settings. Changes apply at the next billing cycle.' },
  { q: 'Does Acme work offline?', a: 'The desktop app keeps recent projects available offline and syncs your changes when you reconnect.' },
  { q: 'Which integrations are included?', a: 'Calendar, chat and code hosting integrations are available on every plan, including the free one.' },
  { q: 'Who owns the data?', a: 'You do. Export everything as CSV or JSON at any time, and we delete it within 30 days of closing an account.' },
  { q: 'Do you have an API?', a: 'Yes. A documented REST API and webhooks let you automate workflows and connect internal tools.' },
];

export default function FaqTwoColumn() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 640, mb: { xs: 5, md: 7 } }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em' }}>
            Questions, answered
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 17 }}>
            Can&apos;t find what you are looking for?{' '}
            <Link href="#" underline="always" sx={{ fontWeight: 600 }}>
              Reach out to our team
            </Link>
            .
          </Typography>
        </Box>
        <Grid container columnSpacing={6} rowSpacing={{ xs: 4, md: 5 }}>
          {FAQS.map((item) => (
            <Grid key={item.q} size={{ xs: 12, md: 6 }} sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
              <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18 }}>
                {item.q}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {item.a}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
