import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';
import LinkButton from '@/components/LinkButton';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 12, md: 20 }, textAlign: 'center' }}>
      <Typography component="h1" sx={{ fontWeight: 600, fontSize: { xs: 32, md: 44 }, letterSpacing: '-0.03em' }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2, fontSize: 18 }}>
        The page you asked for doesn&apos;t exist or has moved.
      </Typography>
      <LinkButton href="/" variant="contained" size="large" disableElevation sx={{ mt: 4, borderRadius: 2.5, px: 3 }}>
        Back to home
      </LinkButton>
    </Container>
  );
}
