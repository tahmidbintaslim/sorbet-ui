'use client';
// @example {"title":"Sizes","description":"Five sizes, xs to xl."}
import { Stack } from '@mui/material';
import { Chip } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Chip key={size} size={size} variant="soft" label={`Size ${size}`} />
      ))}
    </Stack>
  );
}
