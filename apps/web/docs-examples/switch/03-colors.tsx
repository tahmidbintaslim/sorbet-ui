'use client';
// @example {"title":"Colors","description":"Seven colors for the on state."}
import { Stack } from '@mui/material';
import { Switch } from '@sorbet-ui/react';

const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

export default function Colors() {
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', columnGap: 2 }}>
      {COLORS.map((color) => (
        <Switch key={color} color={color} label={color} defaultChecked />
      ))}
    </Stack>
  );
}
