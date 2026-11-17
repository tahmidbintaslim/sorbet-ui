'use client';
// @example {"title":"Disabled and loading","description":"Loading shows a spinner and blocks the menu until options are ready."}
import { Stack } from '@mui/material';
import { MenuItem, Select } from '@sorbet-ui/react';

export default function States() {
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 300 }}>
      <Select label="Billing country" value="ca" disabled>
        <MenuItem value="ca">Canada</MenuItem>
      </Select>
      <Select label="Project" value="" loading>
        <MenuItem value="">Loading projects</MenuItem>
      </Select>
    </Stack>
  );
}
