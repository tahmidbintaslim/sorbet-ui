'use client';
// @block {"name":"Simple","description":"A single row with the brand, a few links and a copyright line."}
import { Box, Container, Link, Stack, Typography } from '@mui/material';

const LINKS = ['About', 'Pricing', 'Privacy', 'Terms', 'Contact'];

export default function FooterSimple() {
  return (
    <Box component="footer" sx={{ py: { xs: 4, md: 5 }, borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 4 }}
          sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}>Acme</Typography>
          <Stack
            component="nav"
            aria-label="Simple footer links"
            direction="row"
            spacing={3}
            useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', rowGap: 1 }}
          >
            {LINKS.map((l) => (
              <Link key={l} href="#" color="text.secondary" underline="hover" variant="body2">
                {l}
              </Link>
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            © 2026 Acme, Inc.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
