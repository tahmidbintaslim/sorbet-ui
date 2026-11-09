'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Link, Typography } from '@mui/material';
import { CATALOG } from '@/lib/catalog';
import { TOUCH } from '@/lib/touch';

const GROUPS = [
  {
    title: 'Overview',
    items: [
      { href: '/docs', label: 'Getting started' },
      { href: '/docs/theming', label: 'Theming' },
    ],
  },
  {
    title: 'Components',
    items: [
      { href: '/docs/components', label: 'All components' },
      ...CATALOG.map((d) => ({ href: `/docs/components/${d.slug}`, label: d.name })),
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
          <Typography variant="overline" color="text.secondary">
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
                      px: 1,
                      borderRadius: 1,
                      fontWeight: active ? 700 : 400,
                      bgcolor: active ? 'action.selected' : 'transparent',
                      borderLeft: 3,
                      borderColor: active ? 'primary.main' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
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
