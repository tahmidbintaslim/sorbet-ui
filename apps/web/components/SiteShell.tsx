'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Chip, Container, Divider, Drawer, GlobalStyles, Grid, IconButton, Link, Stack, Typography } from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import GitHub from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import { useColorMode } from './ColorMode';
import Logo from './Logo';
import GitHubStars from './GitHubStars';
import { SITE } from '@/lib/site';
import { TOUCH, touchRow, touchTarget } from '@/lib/touch';
import { NO_MOTION, SCOOPS, scoop, scoopVars, type Scoop } from '@/lib/scoops';
import { SECTION_FLAVOR, flavorOf } from '@/lib/sections';
import { Drips, ScoopRow } from './fun/Decor';

const wiggle = keyframes`
  0%, 100% { transform: rotate(0) scale(1); }
  20% { transform: rotate(-14deg) scale(1.1); }
  45% { transform: rotate(10deg) scale(1.05); }
  70% { transform: rotate(-5deg); }
`;

// Each section keeps its flavor everywhere: nav pill, page header band, accents.
const NAV: { href: string; label: string; c: Scoop }[] = [
  { href: '/docs', label: 'Docs', c: SECTION_FLAVOR.docs },
  { href: '/docs/components', label: 'Components', c: SECTION_FLAVOR.components },
  { href: '/docs/theming', label: 'Theming', c: SECTION_FLAVOR.theming },
  { href: '/blocks', label: 'Blocks', c: SECTION_FLAVOR.blocks },
  { href: '/templates', label: 'Templates', c: SECTION_FLAVOR.templates },
  { href: '/demo', label: 'Demo', c: SECTION_FLAVOR.demo },
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

const isActive = (href: string, pathname: string) => (href === '/docs' ? pathname === '/docs' : pathname.startsWith(href));

const navLinkSx = {
  px: 1.5,
  py: 0.75,
  borderRadius: 999,
  fontSize: 15,
  whiteSpace: 'nowrap',
  transition: 'background-color .2s, color .2s, transform .3s cubic-bezier(.3,1.8,.5,1)',
} as const;

/** Each nav item is its own scoop: a pastel pill on hover and when active. */
const scoopPill = (s: Scoop, active: boolean) => {
  const on = { color: scoop(s, 'pill'), bgcolor: scoop(s, 'pastel') };
  return {
    ...(active && on),
    '&:hover': { ...on, transform: 'translateY(-1px) rotate(-2deg)' },
    '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' } },
  };
};

const drawerLinkSx = {
  display: 'flex',
  alignItems: 'center',
  minHeight: 48,
  px: 2,
  borderRadius: 2,
  fontSize: 16,
  color: 'text.primary',
  '&:hover': { bgcolor: 'action.hover' },
} as const;

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { mode, toggle } = useColorMode();
  const pathname = usePathname();
  const flavor = flavorOf(pathname);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuButton = React.useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);
  // Close the menu whenever the route changes (e.g. browser back while it is open).
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GlobalStyles styles={scoopVars} />
      <Link
        href="#main"
        sx={{
          position: 'absolute',
          left: -9999,
          ...touchRow,
          '&:focus': { left: 8, top: 8, zIndex: 2000, bgcolor: 'background.paper', p: 1 },
        }}
      >
        Skip to content
      </Link>

      {/* Translucent sticky header. Below md it is one row: logo, theme toggle and a menu button. */}
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
          // Awning trim under the header: the section's flavor, or every flavor at home.
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -1,
            height: 3,
            background: flavor
              ? `repeating-linear-gradient(90deg, ${scoop(flavor, 'fill')} 0 24px, ${scoop(flavor, 'pastel')} 24px 48px)`
              : `linear-gradient(90deg, ${SCOOPS.map((c) => scoop(c, 'fill')).join(', ')})`,
          },
        })}
      >
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', columnGap: 3, minHeight: 64 }}>
          <Stack
            component={NextLink}
            href="/"
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              color: 'text.primary',
              textDecoration: 'none',
              py: 1.5,
              flexShrink: 0,
              '& .logo': { transformOrigin: '50% 90%' },
              '&:hover .logo, &:focus-visible .logo': { animation: `${wiggle} .7s cubic-bezier(.3,1.4,.5,1)`, ...NO_MOTION },
            }}
          >
            <Logo />
            <Typography component="span" sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
              {SITE.name}
            </Typography>
          </Stack>

          <Box component="nav" aria-label="Main" sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, gap: 0.5 }}>
            {NAV.map((n) => {
              const active = isActive(n.href, pathname);
              return (
                <Link
                  key={n.href}
                  component={NextLink}
                  href={n.href}
                  underline="none"
                  aria-current={active ? 'page' : undefined}
                  sx={{ ...navLinkSx, ...touchRow, fontWeight: active ? 700 : 500, color: 'text.secondary', ...scoopPill(n.c, active) }}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link href={SITE.storybook} underline="none" rel="noopener" sx={{ ...navLinkSx, ...touchRow, fontWeight: 500, color: 'text.secondary' }}>
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
              sx={{ display: { xs: 'none', md: 'inline-flex' }, fontWeight: 600, mr: 0.5 }}
            />
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <GitHubStars />
            </Box>
            <IconButton
              onClick={toggle}
              aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              sx={touchTarget}
            >
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton
              ref={menuButton}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? 'site-menu' : undefined}
              sx={{ display: { md: 'none' }, width: 44, height: 44, mr: -1 }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={closeMenu}
        slotProps={{ paper: { id: 'site-menu', role: 'dialog', 'aria-modal': true, 'aria-label': 'Site menu', sx: { width: 'min(320px, 85vw)' } } }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, minHeight: 64, borderBottom: 1, borderColor: 'divider' }}>
          <Typography component="span" sx={{ fontWeight: 800, fontSize: 18 }}>
            {SITE.name}
          </Typography>
          <IconButton onClick={closeMenu} aria-label="Close menu" sx={{ width: 44, height: 44, mr: -1 }}>
            <Close />
          </IconButton>
        </Stack>
        <Box component="nav" aria-label="Main" sx={{ p: 1 }}>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {NAV.map((n) => {
              const active = isActive(n.href, pathname);
              return (
                <li key={n.href}>
                  <Link
                    component={NextLink}
                    href={n.href}
                    underline="none"
                    onClick={closeMenu}
                    aria-current={active ? 'page' : undefined}
                    sx={{ ...drawerLinkSx, fontWeight: active ? 700 : 500, ...scoopPill(n.c, active) }}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            <li>
              <Link href={SITE.storybook} rel="noopener" underline="none" onClick={closeMenu} sx={drawerLinkSx}>
                Storybook
              </Link>
            </li>
            <li>
              <Link href={SITE.github} rel="noopener" underline="none" onClick={closeMenu} sx={{ ...drawerLinkSx, gap: 1 }}>
                <GitHub fontSize="small" />
                GitHub
              </Link>
            </li>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" id="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box component="footer" sx={{ pb: 4, mt: 12, position: 'relative' }}>
        {/* Melting top edge with a row of cones standing on it. */}
        <ScoopRow size={22} sx={{ position: 'absolute', top: -27, left: '50%', transform: 'translateX(-50%)' }} />
        <Drips />
        <Container maxWidth="lg" sx={{ pt: 3 }}>
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
                <Stack spacing={1} sx={{ [TOUCH]: { gap: 0, '& > :not(style) ~ :not(style)': { mt: 0 } }, alignItems: 'flex-start' }}>
                  {col.links.map((l) =>
                    l.href.startsWith('/') ? (
                      <Link key={l.label} component={NextLink} href={l.href} color="text.secondary" underline="hover" variant="body2" sx={touchRow}>
                        {l.label}
                      </Link>
                    ) : (
                      <Link key={l.label} href={l.href} rel="noopener" color="text.secondary" underline="hover" variant="body2" sx={touchRow}>
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
