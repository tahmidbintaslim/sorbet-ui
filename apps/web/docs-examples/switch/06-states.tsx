'use client';
// @example {"title":"Disabled and loading","description":"A loading switch shows a spinner on the thumb and cannot be toggled."}
import { Stack } from '@mui/material';
import { Switch } from '@sorbet-ui/react';

export default function States() {
  return (
    <Stack>
      <Switch label="Disabled" disabled />
      <Switch label="Disabled and on" disabled defaultChecked />
      <Switch label="Saving" loading defaultChecked />
    </Stack>
  );
}
