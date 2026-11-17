'use client';
// @example {"title":"Variants","description":"Tinted, filled, outlined, borderless or underlined."}
import { Box } from '@mui/material';
import { TextField } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, width: '100%', maxWidth: 560 }}>
      {VARIANTS.map((variant) => (
        <TextField key={variant} variant={variant} label={variant} placeholder="Type here" fullWidth />
      ))}
    </Box>
  );
}
