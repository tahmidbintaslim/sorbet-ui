'use client';
// @block {"name":"Simple","description":"Brand on the left, primary links in the middle, sign in and get started on the right."}
import { Box, Container, Link, Stack } from '@mui/material';
import { Button } from '@sorbet-ui/react';

const LINKS = ['Product', 'Pricing', 'Features', 'Docs'];

export default function NavbarSimple() {
  return (
    <Box component="header" sx={{ py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={{ xs: 2, md: 4 }} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1.5 }}>
          <Link href="#" underline="none" color="text.primary" sx={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>
            Acme
          </Link>
          <Stack
            component="nav"
            aria-label="Simple navbar links"
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            useFlexGap
            sx={{ flexWrap: 'wrap', rowGap: 1, order: { xs: 3, md: 0 }, width: { xs: '100%', md: 'auto' }, flex: { md: 1 } }}
          >
            {LINKS.map((l) => (
              <Link key={l} href="#" color="text.secondary" underline="none" sx={{ fontWeight: 500, fontSize: 15, '&:hover': { color: 'text.primary' } }}>
                {l}
              </Link>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <Button variant="plain" color="neutral" size="sm" href="#">
              Sign in
            </Button>
            <Button size="sm" href="#">
              Get started
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
