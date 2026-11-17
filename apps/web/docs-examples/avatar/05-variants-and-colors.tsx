'use client';
// @example {"title":"Variants and colors","description":"Five variants in seven colors."}
import { Stack } from '@mui/material';
import { Avatar } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

export default function VariantsAndColors() {
  return (
    <Stack spacing={1.5}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {COLORS.map((color) => (
            <Avatar key={color} variant={variant} color={color} size="sm">
              {color.slice(0, 2).toUpperCase()}
            </Avatar>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
