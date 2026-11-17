'use client';
// @example {"title":"Disabled and loading","description":"A loading checkbox shows a spinner and cannot be changed."}
import { Stack } from '@mui/material';
import { Checkbox } from '@sorbet-ui/react';

export default function States() {
  return (
    <Stack>
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and checked" disabled defaultChecked />
      <Checkbox label="Saving your choice" loading />
    </Stack>
  );
}
