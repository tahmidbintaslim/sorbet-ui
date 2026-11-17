'use client';
// @example {"title":"Sizes","description":"Five heights, from compact filters to large hero inputs."}
import { Stack } from '@mui/material';
import { TextField } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 340 }}>
      {SIZES.map((size) => (
        <TextField key={size} size={size} aria-label={`Size ${size}`} placeholder={`Size ${size}`} fullWidth />
      ))}
    </Stack>
  );
}
