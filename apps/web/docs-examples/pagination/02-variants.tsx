'use client';
// @example {"title":"Variants","description":"Five variants for the current page."}
import { Stack } from '@mui/material';
import { Pagination } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      {VARIANTS.map((variant) => (
        <Pagination key={variant} variant={variant} count={5} defaultPage={2} aria-label={`Pagination (${variant})`} />
      ))}
    </Stack>
  );
}
