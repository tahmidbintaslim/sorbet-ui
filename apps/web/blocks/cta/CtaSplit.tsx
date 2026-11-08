'use client';
// @block {"name":"Split card","description":"Headline and copy on the left, two actions on the right, on a soft tinted card."}
import { Box, Container, Stack, Typography } from '@mui/material';
import { Button, Card } from '@sorbet-ui/react';

export default function CtaSplit() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Card variant="soft" color="primary" sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 3, md: 6 }} sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}
          >
            <Box sx={{ maxWidth: 560 }}>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Ready to bring your team into Acme?
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 17 }}>
                Import your projects in minutes and invite everyone on a free plan. Upgrade only when you need more.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}>
              <Button size="lg" href="#">
                Get started
              </Button>
              <Button size="lg" variant="ghost" href="#">
                Contact sales
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
