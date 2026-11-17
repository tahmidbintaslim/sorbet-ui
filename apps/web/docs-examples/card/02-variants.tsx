'use client';
// @example {"title":"Variants","description":"Outlined by default; solid, soft, ghost and plain are available."}
import { Box, Typography } from '@mui/material';
import { Card } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, width: '100%' }}>
      {VARIANTS.map((variant) => (
        <Card key={variant} variant={variant} color="primary" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>{variant}</Typography>
          <Typography variant="body2">A {variant} card.</Typography>
        </Card>
      ))}
    </Box>
  );
}
