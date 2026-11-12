'use client';
// Category pills for /blocks/[category]. Client-side because MUI
// receives NextLink (a function) as its `component`.
import * as React from 'react';
import NextLink from 'next/link';
import { Box } from '@mui/material';
import { categoriesWithBlocks } from '@/lib/blocks';
import { TOUCH } from '@/lib/touch';
import { scoop } from '@/lib/scoops';
import { SECTION_FLAVOR } from '@/lib/sections';

const F = SECTION_FLAVOR.blocks;
const ON = { bgcolor: scoop(F, 'pastel'), color: scoop(F, 'pill'), borderColor: scoop(F, 'fill') };

// Fade the scroll row's edges so it reads as scrollable on phones.
const FADE = 'linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 32px), transparent 100%)';

/** Category pills: a wrapped list from md up, a horizontally scrolling row on phones and tablets. */
export default function BlockCategoryNav({ current }: { current: string }) {
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const row = ref.current;
    // Bring the active pill into view when the row scrolls (phones and tablets).
    if (el && row && row.scrollWidth > row.clientWidth) el.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [current]);
  return (
    <Box
      ref={ref}
      component="nav"
      aria-label="Block categories"
      sx={{
        mt: 3,
        display: 'flex',
        gap: 1,
        position: 'relative',
        flexWrap: { xs: 'nowrap', md: 'wrap' },
        overflowX: { xs: 'auto', md: 'visible' },
        mx: { xs: -2, sm: -3, md: 0 },
        px: { xs: 2, sm: 3, md: 0 },
        pb: 1,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        maskImage: { xs: FADE, md: 'none' },
        WebkitMaskImage: { xs: FADE, md: 'none' },
      }}
    >
      {categoriesWithBlocks().map((x) => (
        <Box
          key={x.id}
          component={NextLink}
          href={`/blocks/${x.id}`}
          aria-current={x.id === current ? 'page' : undefined}
          sx={{
            flexShrink: 0,
            px: 1.5,
            py: 0.75,
            borderRadius: 999,
            border: 1,
            borderColor: 'divider',
            color: 'text.primary',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            transition: 'background-color .2s, color .2s, border-color .2s',
            ...(x.id === current && ON),
            '&:hover': ON,
            [TOUCH]: { minHeight: 44, display: 'inline-flex', alignItems: 'center' },
          }}
        >
          {x.title}
        </Box>
      ))}
    </Box>
  );
}
