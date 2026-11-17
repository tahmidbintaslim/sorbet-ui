'use client';
// Component catalog card: a small live preview of the component on a scoop-tinted
// stage, with its name and description underneath. The preview is decoration (inert
// and hidden from assistive tech); the title link covers the whole card.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { CATALOG } from '@/lib/catalog';
import { scoop, scoopAt } from '@/lib/scoops';
import { getDemo } from './demos';

/** Mounts its children the first time the placeholder comes near the viewport. */
function LazyMount({ children, height }: { children: React.ReactNode; height: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShown(true);
      },
      { rootMargin: '240px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return (
    <Box ref={ref} data-mounted={shown} sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {shown ? children : null}
    </Box>
  );
}

export default function CatalogCard({ slug, name, description }: { slug: string; name: string; description: string }) {
  const s = scoopAt(Math.max(0, CATALOG.findIndex((c) => c.slug === slug)));
  const demo = getDemo(slug);
  return (
    <Box
      data-testid={`catalog-card-${slug}`}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        borderRadius: 4,
        height: '100%',
        bgcolor: 'background.paper',
        transition: 'transform .35s cubic-bezier(.3,1.6,.5,1), box-shadow .25s, border-color .2s',
        '&:hover': { borderColor: scoop(s, 'fill'), transform: 'translateY(-3px)', boxShadow: '0 14px 28px -18px rgb(15 23 42 / 0.45)' },
        '&:focus-within': { borderColor: scoop(s, 'fill') },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      <Box
        aria-hidden
        inert
        data-testid={`catalog-preview-${slug}`}
        sx={{ bgcolor: scoop(s, 'tint'), borderBottom: 1, borderColor: 'divider', px: 2, pointerEvents: 'none', userSelect: 'none' }}
      >
        <LazyMount height={132}>
          <Box sx={{ transform: 'scale(.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '122%', flexShrink: 0 }}>
            {demo?.render({ variant: 'soft', color: s, size: 'md' }, {})}
          </Box>
        </LazyMount>
      </Box>
      <Box sx={{ p: 2, minWidth: 0 }}>
        <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
          <Box
            component={NextLink}
            href={`/docs/components/${slug}`}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              // The link covers the whole card, so the card is one big target.
              '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 4 },
              '&:focus-visible': { outline: 'none' },
              '&:focus-visible::after': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
            }}
          >
            {name}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}
