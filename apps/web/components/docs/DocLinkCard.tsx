'use client';
// Bordered link card used for "Related" and previous / next on component pages.
// A client component so the Next link can be handed to MUI's `component` prop.
import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import { scoop } from '@/lib/scoops';
import { SECTION_FLAVOR } from '@/lib/sections';

export default function DocLinkCard({
  href,
  title,
  note,
  rel,
  align = 'left',
}: {
  href: string;
  title: string;
  /** Small line of text: above the title for prev/next, below it otherwise. */
  note: string;
  rel?: 'prev' | 'next';
  align?: 'left' | 'right';
}) {
  const label = (
    <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
      {note}
    </Typography>
  );
  return (
    <Box
      component={NextLink}
      href={href}
      rel={rel}
      sx={{
        display: 'block',
        height: '100%',
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
        color: 'inherit',
        textDecoration: 'none',
        textAlign: { xs: 'left', sm: align },
        transition: 'border-color .2s, transform .2s',
        '&:hover': { borderColor: scoop(SECTION_FLAVOR.components, 'fill'), transform: 'translateY(-2px)' },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      {rel && label}
      <Typography component="span" sx={{ display: 'block', fontWeight: 700 }}>
        {rel === 'prev' && '← '}
        {title}
        {rel === 'next' && ' →'}
      </Typography>
      {!rel && label}
    </Box>
  );
}
