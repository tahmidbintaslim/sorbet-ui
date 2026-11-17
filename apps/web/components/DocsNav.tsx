'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Link, Typography } from '@mui/material';
import { CATALOG, catalogByGroup } from '@/lib/catalog';
import { TOUCH } from '@/lib/touch';
import { scoop, type Scoop } from '@/lib/scoops';
import { SECTION_FLAVOR } from '@/lib/sections';
import { ScoopDot } from './fun/Decor';
import DocsSearch from './docs/DocsSearch';

// Every group has a flavor dot; the current page is a pill in its section's flavor.
type NavItem = { href: string; label: string; c: Scoop };
// Items can be split under small sub-headings (the component groups).
const GROUPS: { title: string; c: Scoop; items: NavItem[]; sections?: { title: string; items: NavItem[] }[] }[] = [
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
    ],
    sections: catalogByGroup().map(({ group, entries }) => ({
      title: group,
      items: entries.map((d) => ({ href: `/docs/components/${d.slug}`, label: d.name, c: SECTION_FLAVOR.components })),
    })),
  },
];

/** Label of the docs page at `pathname`, for the mobile "Browse docs" bar. */
export function docsPageLabel(pathname: string) {
  for (const g of GROUPS) for (const i of g.items) if (i.href === pathname) return i.label;
  return CATALOG.find((c) => `/docs/components/${c.slug}` === pathname)?.name;
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
    const current = ref.current?.querySelector('[aria-current="page"]');
    if (inDrawer) current?.scrollIntoView({ block: 'center' });
    // Desktop: the sidebar scrolls on its own, so bring the current page into view inside it only.
    else if (current instanceof HTMLElement && ref.current && ref.current.scrollHeight > ref.current.clientHeight) {
      ref.current.scrollTop = current.offsetTop - ref.current.clientHeight / 2;
    }
  }, [inDrawer, pathname]);

  const list = (items: NavItem[]) => (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {items.map((i) => {
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
  );

  return (
    <Box
      ref={ref}
      component="nav"
      aria-label="Docs"
      sx={
        inDrawer
          ? { p: 2 }
          : { position: { md: 'sticky' }, top: { md: 88 }, maxHeight: { md: 'calc(100vh - 104px)' }, overflowY: { md: 'auto' }, pr: { md: 1 }, pb: { md: 2 }, overscrollBehavior: 'contain' }
      }
    >
      {!inDrawer && (
        <Box sx={{ mb: 2.5, position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.default', pb: 0.5 }}>
          <DocsSearch />
        </Box>
      )}
      {GROUPS.map((g) => (
        <Box key={g.title} sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <ScoopDot c={g.c} size={10} />
            {g.title}
          </Typography>
          {list(g.items)}
          {g.sections?.map((sec) => (
            <Box key={sec.title} sx={{ mt: 1.5 }}>
              <Typography component="p" sx={{ px: 1.5, py: 0.5, fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>
                {sec.title}
              </Typography>
              {list(sec.items)}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
