'use client';
// @example {"title":"Colors","description":"Seven colors for the checked box."}
import { Stack } from '@mui/material';
import { Checkbox } from '@sorbet-ui/react';

const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

export default function Colors() {
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', columnGap: 1 }}>
      {COLORS.map((color) => (
        <Checkbox key={color} color={color} label={color} defaultChecked />
      ))}
    </Stack>
  );
}
