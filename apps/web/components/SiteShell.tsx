'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Chip, Container, Grid, IconButton, Link, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import GitHub from '@mui/icons-material/GitHub';
import { useColorMode } from './ColorMode';
import Logo from './Logo';
import GitHubStars from './GitHubStars';
import { SITE } from '@/lib/site';

const NAV = [
  { href: '/docs', label: 'Docs' },
  { href: '/docs/components', label: 'Components' },
  { href: '/docs/theming', label: 'Theming' },
  { href: '/blocks', label: 'Blocks' },
  { href: '/templates', label: 'Templates' },
  { href: '/demo', label: 'Demo' },
];

const FOOTER = [
  {
    title: 'Docs',
    links: [
      { href: '/docs', label: 'Getting started' },
      { href: '/docs/components', label: 'Components' },
      { href: '/docs/theming', label: 'Theming' },
      { href: '/blocks', label: 'Blocks' },
      { href: '/templates', label: 'Templates' },
      { href: '/demo', label: 'Demo' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: SITE.github, label: 'GitHub' },
      { href: SITE.storybook, label: 'Storybook' },
      { href: SITE.npm, label: 'npm' },
    ],
  },
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

      {/* Translucent sticky header; on phones the nav drops to its own scrollable row. */}
      <Box
        component="header"
        sx={(t) => ({
          position: 'sticky',
          top: 0,
          zIndex: t.zIndex.appBar,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: alpha(t.palette.background.default, 0.8),
          backdropFilter: 'saturate(180%) blur(12px)',
        })}
      >
        <Container
          maxWidth="lg"
          sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 3, minHeight: 64 }}
        >
          <Stack
            component={NextLink}
            href="/"
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', color: 'text.primary', textDecoration: 'none', py: 1.5 }}
          >
            <Logo />
            <Typography component="span" sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
              {SITE.name}
            </Typography>
          </Stack>

          <Box
            component="nav"
            aria-label="Main"
            sx={{
              order: { xs: 3, md: 0 },
              width: { xs: '100%', md: 'auto' },
              flexGrow: { md: 1 },
              display: 'flex',
              gap: 0.5,
              overflowX: 'auto',
              pb: { xs: 1, md: 0 },
              mx: { xs: -1, md: 0 },
            }}
          >
            {NAV.map((n) => {
              const active = n.href === '/docs' ? pathname === '/docs' : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  component={NextLink}
                  href={n.href}
                  underline="none"
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 2,
                    fontSize: 15,
                    whiteSpace: 'nowrap',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'text.primary' : 'text.secondary',
                    bgcolor: active ? 'action.selected' : 'transparent',
                    '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link
              href={SITE.storybook}
              underline="none"
              rel="noopener"
              sx={{
                px: 1.25,
                py: 0.75,
                borderRadius: 2,
                fontSize: 15,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                color: 'text.secondary',
                '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
              }}
            >
              Storybook
            </Link>
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', ml: 'auto' }}>
            <Chip
              component="a"
              href={SITE.npm}
              clickable
              label="v0.1.0"
              size="small"
              variant="outlined"
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 600, mr: 0.5 }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <GitHubStars />
            </Box>
            <IconButton component="a" href={SITE.github} aria-label="Sorbet UI on GitHub" rel="noopener" sx={{ display: { sm: 'none' } }}>
              <GitHub />
            </IconButton>
            <IconButton
              onClick={toggle}
              aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Stack>
        </Container>
      </Box>

      <Box component="main" id="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', pt: 6, pb: 4, mt: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Logo size={24} />
                <Typography sx={{ fontWeight: 800 }}>{SITE.name}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 360 }}>
                {SITE.description}
              </Typography>
            </Grid>
            {FOOTER.map((col) => (
              <Grid key={col.title} size={{ xs: 6, md: 3 }}>
                <Typography component="h2" variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {col.title}
                </Typography>
                <Stack spacing={1}>
                  {col.links.map((l) =>
                    l.href.startsWith('/') ? (
                      <Link key={l.label} component={NextLink} href={l.href} color="text.secondary" underline="hover" variant="body2">
                        {l.label}
                      </Link>
                    ) : (
                      <Link key={l.label} href={l.href} rel="noopener" color="text.secondary" underline="hover" variant="body2">
                        {l.label}
                      </Link>
                    ),
                  )}
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mt: 5, pt: 3, borderTop: 1, borderColor: 'divider' }}
          >
            <Typography variant="body2" color="text.secondary">
              MIT licensed. Built on Material UI v7 and v9.
            </Typography>
            <Box>
              <GitHubStars />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
