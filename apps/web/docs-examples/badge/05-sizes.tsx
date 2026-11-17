'use client';
// @example {"title":"Sizes","description":"Five sizes, xs to xl."}
import { Box, Stack } from '@mui/material';
import { Badge } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  return (
    <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Badge key={size} size={size} badgeContent={8}>
          <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'action.selected' }} />
        </Badge>
      ))}
    </Stack>
  );
}
