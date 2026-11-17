'use client';
// @example {"title":"Sizes","description":"Five sizes, xs to xl."}
import { Stack } from '@mui/material';
import { Rating } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Rating key={size} size={size} aria-label={`Rating (${size})`} defaultValue={4} />
      ))}
    </Stack>
  );
}
