'use client';
// Component catalog card: a scoop-colored stripe and mark per card, so the grid reads
// like a row of flavors while the text stays plain and readable.
import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { CATALOG } from '@/lib/catalog';
import { scoop, scoopAt } from '@/lib/scoops';

export default function CatalogCard({ href, name, description }: { href: string; name: string; description: string }) {
  const s = scoopAt(Math.max(0, CATALOG.findIndex((c) => href.endsWith(`/${c.slug}`))));
  return (
    <Box
      component={NextLink}
      href={href}
      sx={{
        position: 'relative',
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        pl: 2.75,
        color: 'inherit',
        textDecoration: 'none',
        height: '100%',
        bgcolor: 'background.paper',
        transition: 'transform .35s cubic-bezier(.3,1.6,.5,1), box-shadow .25s, border-color .2s',
        '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, bgcolor: scoop(s, 'fill') },
        '&:hover': { borderColor: scoop(s, 'fill'), transform: 'translateY(-3px)', boxShadow: '0 14px 28px -18px rgb(15 23 42 / 0.45)' },
        '&:hover .mark': { transform: 'rotate(-12deg) scale(1.15)' },
        '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' }, '&:hover .mark': { transform: 'none' } },
      }}
    >
      <Box
        aria-hidden
        className="mark"
        sx={{ flexShrink: 0, mt: 0.5, width: 14, height: 14, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', bgcolor: scoop(s, 'fill'), transition: 'transform .35s cubic-bezier(.3,1.8,.5,1)' }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}
