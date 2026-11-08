'use client';
// @block {"name":"Responsive menu","description":"Inline links on desktop; on small screens a menu button expands a collapsible list of links."}
import * as React from 'react';
import { Box, Collapse, Container, IconButton, Link, Stack } from '@mui/material';
import Close from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';
import { Button } from '@sorbet-ui/react';

const LINKS = ['Product', 'Solutions', 'Pricing', 'Resources', 'Company'];
const MENU_ID = 'navbar-with-menu-links';

export default function NavbarWithMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <Box component="header" sx={{ py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={4} useFlexGap>
          <Link href="#" underline="none" color="text.primary" sx={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>
            Acme
          </Link>
          <Stack
            component="nav"
            aria-label="Responsive navbar links"
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, flex: 1 }}
          >
            {LINKS.map((l) => (
              <Link key={l} href="#" color="text.secondary" underline="none" sx={{ fontWeight: 500, fontSize: 15, '&:hover': { color: 'text.primary' } }}>
                {l}
              </Link>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', ml: 'auto' }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              <Button variant="plain" color="neutral" size="sm" href="#">
                Sign in
              </Button>
              <Button size="sm" href="#">
                Get started
              </Button>
            </Box>
            <IconButton
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls={MENU_ID}
              onClick={() => setOpen((o) => !o)}
              sx={{ display: { md: 'none' } }}
            >
              {open ? <Close /> : <Menu />}
            </IconButton>
          </Stack>
        </Stack>
        <Collapse in={open} sx={{ display: { md: 'none' } }}>
          <Box component="nav" id={MENU_ID} aria-label="Responsive navbar menu" sx={{ pt: 2 }}>
            <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {LINKS.map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    color="text.primary"
                    underline="none"
                    onClick={() => setOpen(false)}
                    sx={{ display: 'block', py: 1.25, px: 1, borderRadius: 1, fontWeight: 500, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2, display: { sm: 'none' } }}>
              <Button variant="ghost" href="#">
                Sign in
              </Button>
              <Button href="#">Get started</Button>
            </Stack>
          </Box>
        </Collapse>
      </Container>
    </Box>
  );
}
