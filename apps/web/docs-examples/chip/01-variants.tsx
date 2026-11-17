'use client';
// @example {"title":"Variants","description":"Solid, soft, outlined, ghost and plain."}
import { Stack } from '@mui/material';
import { Chip } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      {VARIANTS.map((variant) => (
        <Chip key={variant} variant={variant} label={variant} />
      ))}
    </Stack>
  );
}
