'use client';
// @block {"name":"Centered links","description":"Brand on the left, centered links, and a search button with a primary action on the right."}
import { Box, Container, IconButton, Link, Stack } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { Button } from '@sorbet-ui/react';

const LINKS = ['Overview', 'Features', 'Pricing', 'Blog', 'Help'];

export default function NavbarCentered() {
  return (
    <Box component="header" sx={{ py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr auto', md: '1fr auto 1fr' },
            alignItems: 'center',
            columnGap: 3,
            rowGap: 1.5,
          }}
        >
          <Link href="#" underline="none" color="text.primary" sx={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', justifySelf: 'start' }}>
            Acme
          </Link>
          <Stack
            component="nav"
            aria-label="Centered navbar links"
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            useFlexGap
            sx={{ flexWrap: 'wrap', justifyContent: 'center', rowGap: 1, gridColumn: { xs: '1 / -1', md: 'auto' }, gridRow: { xs: 2, md: 'auto' } }}
          >
            {LINKS.map((l) => (
              <Link key={l} href="#" color="text.secondary" underline="none" sx={{ fontWeight: 500, fontSize: 15, '&:hover': { color: 'text.primary' } }}>
                {l}
              </Link>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifySelf: 'end' }}>
            <IconButton aria-label="Search" size="small">
              <Search />
            </IconButton>
            <Button size="sm" href="#">
              Try Acme
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
