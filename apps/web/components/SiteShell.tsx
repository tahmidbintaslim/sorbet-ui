'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Box, Container, IconButton, Link, Stack, Toolbar, Typography } from '@mui/material';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import GitHub from '@mui/icons-material/GitHub';
import { useColorMode } from './ColorMode';
import { SITE } from '@/lib/site';

const NAV = [
  { href: '/docs', label: 'Docs' },
  { href: '/docs/components', label: 'Components' },
  { href: '/docs/theming', label: 'Theming' },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { mode, toggle } = useColorMode();
  const pathname = usePathname();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Link
        href="#main"
        sx={{
          position: 'absolute',
          left: -9999,
          '&:focus': { left: 8, top: 8, zIndex: 2000, bgcolor: 'background.paper', p: 1 },
        }}
      >
        Skip to content
      </Link>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Typography
            component={NextLink}
            href="/"
            variant="h6"
            sx={{ fontWeight: 700, color: 'inherit', textDecoration: 'none', mr: 2 }}
          >
            Sorbet UI
          </Typography>
          <Box component="nav" aria-label="Main" sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            {NAV.map((n) => {
              const active = n.href === '/docs' ? pathname === '/docs' : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  component={NextLink}
                  href={n.href}
                  underline={active ? 'always' : 'hover'}
                  color="inherit"
                  aria-current={active ? 'page' : undefined}
                  sx={{ fontWeight: active ? 700 : 400 }}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link href={SITE.storybook} color="inherit" underline="hover" rel="noopener">
              Storybook
            </Link>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              component="a"
              href={SITE.github}
              aria-label="Sorbet UI on GitHub"
              color="inherit"
              rel="noopener"
            >
              <GitHub />
            </IconButton>
            <IconButton
              onClick={toggle}
              color="inherit"
              aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="main" id="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 4, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            MIT licensed. Built on Material UI v7.{' '}
            <Link href={SITE.github} rel="noopener">
              GitHub
            </Link>{' '}
            ·{' '}
            <Link href={SITE.storybook} rel="noopener">
              Storybook
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
