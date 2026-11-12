import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';
import LinkButton from '@/components/LinkButton';
import DroppedCone from '@/components/fun/DroppedCone';
import { Springy } from '@/components/fun/Decor';
import { scoop } from '@/lib/scoops';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center', overflow: 'hidden' }}>
      <DroppedCone size={300} />
      <Typography
        aria-hidden
        component="span"
        sx={{ display: 'block', mt: 2, fontFamily: 'var(--font-hand), cursive', fontSize: 34, lineHeight: 1, color: scoop('danger', 'ink'), rotate: '-4deg' }}
      >
        oops!
      </Typography>
      <Typography component="h1" sx={{ mt: 1, fontWeight: 800, fontSize: { xs: 32, md: 44 }, letterSpacing: '-0.03em' }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2, fontSize: 18 }}>
        This scoop hit the floor. The page doesn&apos;t exist or has moved.
      </Typography>
      <Springy style={{ marginTop: 32 }}>
        <LinkButton href="/" variant="contained" size="large" disableElevation sx={{ borderRadius: 999, px: 3.5, fontWeight: 700 }}>
          Back to home
        </LinkButton>
      </Springy>
    </Container>
  );
}
