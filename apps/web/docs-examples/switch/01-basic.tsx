'use client';
// @example {"title":"With a label","description":"label renders a clickable label beside the switch."}
import { Stack } from '@mui/material';
import { Switch } from '@sorbet-ui/react';

export default function Basic() {
  return (
    <Stack>
      <Switch label="Email notifications" defaultChecked />
      <Switch label="Weekly digest" />
    </Stack>
  );
}
