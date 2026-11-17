'use client';
// @example {"title":"Sizes","description":"Five sizes, xs to xl."}
import { Stack } from '@mui/material';
import { Pagination } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Pagination key={size} size={size} count={5} defaultPage={3} siblingCount={0} aria-label={`Pagination (${size})`} />
      ))}
    </Stack>
  );
}
