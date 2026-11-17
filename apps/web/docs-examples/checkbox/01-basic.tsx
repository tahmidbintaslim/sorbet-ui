'use client';
// @example {"title":"With a label","description":"label renders a clickable label beside the box."}
import { Stack } from '@mui/material';
import { Checkbox } from '@sorbet-ui/react';

export default function Basic() {
  return (
    <Stack>
      <Checkbox label="Email me product updates" defaultChecked />
      <Checkbox label="Email me security alerts" />
    </Stack>
  );
}
