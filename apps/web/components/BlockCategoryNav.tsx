'use client';
// Back link + category pills for /blocks/[category]. Client-side because MUI
// receives NextLink (a function) as its `component`.
import NextLink from 'next/link';
import { Box, Link, Stack } from '@mui/material';
import { categoriesWithBlocks } from '@/lib/blocks';

export function BackToBlocks() {
  return (
    <Link component={NextLink} href="/blocks" underline="hover" sx={{ fontSize: 14 }}>
      ← All blocks
    </Link>
  );
}

export default function BlockCategoryNav({ current }: { current: string }) {
  return (
    <Stack direction="row" component="nav" aria-label="Block categories" spacing={1} sx={{ mt: 3, overflowX: 'auto', pb: 1 }}>
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
            borderRadius: 2,
            border: 1,
            borderColor: x.id === current ? 'primary.main' : 'divider',
            color: 'text.primary',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            bgcolor: x.id === current ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          {x.title}
        </Box>
      ))}
    </Stack>
  );
}
