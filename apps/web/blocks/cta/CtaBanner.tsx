'use client';
// @block {"name": "Gradient banner", "description": "Headline and two actions on a brand gradient."}
import { Box, Container, Stack, Typography } from '@mui/material';
import { Button } from '@sorbet-ui/react';

export default function CtaBanner() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
          sx={{ p: { xs: 4, md: 6 }, borderRadius: 5, background: 'linear-gradient(135deg, #0369a1, #7e22ce)', color: '#fff' }}
        >
          <Box>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.03em' }}>
              Start your free trial today
            </Typography>
            <Typography sx={{ opacity: 0.9, mt: 1 }}>14 days, every feature, no card required.</Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button size="lg" color="neutral" variant="solid" sx={{ bgcolor: '#fff', color: '#0f172a', '&:hover': { bgcolor: '#f1f5f9' } }}>
              Start trial
            </Button>
            <Button size="lg" variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.7)' }}>
              Talk to sales
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
