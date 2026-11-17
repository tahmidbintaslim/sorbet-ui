'use client';
// @example {"title":"Variants and colors","description":"Five variants in seven colors."}
import { Box, Stack } from '@mui/material';
import { Badge } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

const Tile = () => <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: 'action.selected' }} />;

export default function VariantsAndColors() {
  return (
    <Stack spacing={2.5}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={3} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {COLORS.map((color) => (
            <Badge key={color} variant={variant} color={color} badgeContent={7}>
              <Tile />
            </Badge>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
