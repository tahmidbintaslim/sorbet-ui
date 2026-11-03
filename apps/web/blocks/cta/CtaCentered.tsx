'use client';
// @block {"name":"Centered","description":"Centered headline with a primary and a ghost action and a short trust line."}
import { Box, Container, Stack, Typography } from '@mui/material';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import { Button } from '@sorbet-ui/react';

const POINTS = ['Free 14-day trial', 'No credit card', 'Cancel any time'];

export default function CtaCentered() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 680, mx: 'auto' }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 48 }, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Ship your next release with less noise
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18, mt: 2 }}>
            Acme turns scattered tasks, docs and reviews into one calm workflow your team will actually use.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 4 }}>
            <Button size="lg" href="#">
              Start free
            </Button>
            <Button size="lg" variant="ghost" href="#">
              See how it works
            </Button>
          </Stack>
          <Stack
            component="ul"
            direction="row"
            useFlexGap
            flexWrap="wrap"
            justifyContent="center"
            spacing={{ xs: 1.5, sm: 3 }}
            sx={{ listStyle: 'none', p: 0, m: 0, mt: 3 }}
          >
            {POINTS.map((p) => (
              <Stack key={p} component="li" direction="row" spacing={0.75} alignItems="center">
                <CheckCircleOutlined fontSize="small" color="success" aria-hidden />
                <Typography variant="body2" color="text.secondary">
                  {p}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
