'use client';
// @example {"title":"Sizes","description":"Five sizes, xs to xl."}
import { Stack } from '@mui/material';
import { Alert } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 480 }}>
      {SIZES.map((size) => (
        <Alert key={size} size={size} color="info">
          Size {size}
        </Alert>
      ))}
    </Stack>
  );
}
