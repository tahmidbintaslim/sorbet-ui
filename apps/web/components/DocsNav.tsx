'use client';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Link, Typography } from '@mui/material';
import { CATALOG } from '@/lib/catalog';

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

export default function DocsNav() {
  const pathname = usePathname();
  return (
    <Box component="nav" aria-label="Docs" sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
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
                    sx={{
                      display: 'block',
                      py: 0.5,
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
