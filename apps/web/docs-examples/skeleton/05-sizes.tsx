'use client';
// @example {"title":"Sizes","description":"size sets the line height for text, the diameter for circles and the height for blocks."}
import { Stack } from '@mui/material';
import { Skeleton } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Skeleton key={size} shape="circular" size={size} />
      ))}
    </Stack>
  );
}
