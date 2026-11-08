'use client';
// @block {"name":"Gradient","description":"Bold gradient panel with a headline, two actions and three stat chips."}
import { Box, Container, Stack, Typography } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Button, Chip } from '@sorbet-ui/react';

const STATS = ['99.9% uptime target', '14-day free trial', 'No card required'];

export default function HeroGradient() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 6,
            px: { xs: 3, sm: 6, md: 10 },
            py: { xs: 7, md: 11 },
            textAlign: 'center',
            color: '#fff',
            background: 'linear-gradient(135deg, #0369a1 0%, #7e22ce 100%)',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 38, sm: 52, md: 68 },
              letterSpacing: '-0.04em',
              lineHeight: 1.02,
              maxWidth: 820,
              mx: 'auto',
            }}
          >
            Ship the product your customers asked for
          </Typography>
          <Typography sx={{ fontSize: { xs: 17, md: 20 }, mt: 2.5, maxWidth: 600, mx: 'auto', color: '#fff' }}>
            Acme turns scattered feedback into a clear roadmap, then tracks every release until it lands.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center', mt: 4 }}>
            <Button
              size="lg"
              endIcon={<ArrowForward />}
              sx={{ bgcolor: '#fff', color: '#0369a1', '&:hover': { bgcolor: '#f0f9ff' } }}
            >
              Start free
            </Button>
            <Button
              size="lg"
              variant="outlined"
              sx={{ color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(0,0,0,0.15)', color: '#fff' } }}
            >
              See how it works
            </Button>
          </Stack>
          <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'center', mt: 5 }}>
            {STATS.map((s) => (
              <Chip
                key={s}
                label={s}
                size="sm"
                variant="plain"
                sx={{ bgcolor: 'rgba(0,0,0,0.22)', color: '#fff', fontWeight: 600 }}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
