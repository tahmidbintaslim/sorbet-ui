'use client';
// @example {"title":"Sizes","description":"Five sizes, xs to xl."}
import { Stack } from '@mui/material';
import { Avatar } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Avatar key={size} size={size} status="online">
          AL
        </Avatar>
      ))}
    </Stack>
  );
}
