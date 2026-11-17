'use client';
// @example {"title":"Colors","description":"color tints soft and solid cards."}
import { Box, Typography } from '@mui/material';
import { Card } from '@sorbet-ui/react';

const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;

export default function Colors() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2, width: '100%' }}>
      {COLORS.map((color) => (
        <Card key={color} variant="soft" color={color} sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>{color}</Typography>
        </Card>
      ))}
    </Box>
  );
}
