'use client';
// @example {"title":"Colors","description":"Every variant comes in the seven theme colors."}
import { Stack } from '@mui/material';
import { Button } from '@sorbet-ui/react';

const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

export default function Colors() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      {(['solid', 'soft'] as const).map((variant) => (
        <Stack key={variant} direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {COLORS.map((color) => (
            <Button key={color} variant={variant} color={color} size="sm">
              {color}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
