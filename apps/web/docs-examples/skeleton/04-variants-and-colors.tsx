'use client';
// @example {"title":"Variants and colors","description":"Variants set how strong the fill is; color tints it."}
import { Stack, Typography } from '@mui/material';
import { Skeleton } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function VariantsAndColors() {
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 340 }}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 64 }}>
            {variant}
          </Typography>
          <Skeleton variant={variant} color="primary" shape="rounded" size="sm" sx={{ flex: 1 }} />
        </Stack>
      ))}
    </Stack>
  );
}
