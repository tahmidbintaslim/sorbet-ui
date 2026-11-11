'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Link, Typography } from '@mui/material';
import { CATALOG } from '@/lib/catalog';
import { TOUCH } from '@/lib/touch';
import { scoop, type Scoop } from '@/lib/scoops';
import { SECTION_FLAVOR } from '@/lib/sections';
import { ScoopDot } from './fun/Decor';

// Every group has a flavor dot; the current page is a pill in its section's flavor.
const GROUPS: { title: string; c: Scoop; items: { href: string; label: string; c: Scoop }[] }[] = [
  {
    title: 'Overview',
    c: SECTION_FLAVOR.docs,
    items: [
      { href: '/docs', label: 'Getting started', c: SECTION_FLAVOR.docs },
      { href: '/docs/theming', label: 'Theming', c: SECTION_FLAVOR.theming },
    ],
  },
  {
    title: 'Components',
    c: SECTION_FLAVOR.components,
    items: [
      { href: '/docs/components', label: 'All components', c: SECTION_FLAVOR.components },
      ...CATALOG.map((d) => ({ href: `/docs/components/${d.slug}`, label: d.name, c: SECTION_FLAVOR.components })),
    ],
  },
];

/** Label of the docs page at `pathname`, for the mobile "Browse docs" bar. */
export function docsPageLabel(pathname: string) {
  for (const g of GROUPS) for (const i of g.items) if (i.href === pathname) return i.label;
  return undefined;
}

/**
 * Docs sidebar. On desktop it sticks beside the content; in the mobile drawer
 * (`inDrawer`) it scrolls the current page into view and reports link taps so
 * the drawer can close.
 */
export default function DocsNav({ inDrawer = false, onNavigate }: { inDrawer?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (!inDrawer) return;
    ref.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
  }, [inDrawer]);
  return (
    <Box ref={ref} component="nav" aria-label="Docs" sx={inDrawer ? { p: 2 } : { position: { md: 'sticky' }, top: { md: 88 } }}>
      {GROUPS.map((g) => (
        <Box key={g.title} sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <ScoopDot c={g.c} size={10} />
            {g.title}
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {g.items.map((i) => {
              const active = pathname === i.href;
              return (
                <li key={i.href}>
                  <Link
                    component={NextLink}
                    href={i.href}
                    underline="none"
                    color="text.primary"
                    aria-current={active ? 'page' : undefined}
                    onClick={onNavigate}
                    sx={{
                      display: 'block',
                      py: 0.5,
                      [TOUCH]: { display: 'flex', alignItems: 'center', minHeight: 44, py: 0 },
                      px: 1.5,
                      borderRadius: 999,
                      fontWeight: active ? 700 : 400,
                      transition: 'background-color .2s, color .2s',
                      ...(active && { bgcolor: scoop(i.c, 'pastel'), color: scoop(i.c, 'pill') }),
                      '&:hover': { bgcolor: scoop(i.c, 'pastel'), color: scoop(i.c, 'pill') },
                    }}
                  >
                    {i.label}
                  </Link>
                </li>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
