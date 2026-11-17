'use client';
// @example {"title":"Validation and disabled","description":"error and helperText work as on TextField."}
import { Stack } from '@mui/material';
import { Autocomplete } from '@sorbet-ui/react';

const owners = [
  { label: 'Ada Lovelace', value: 'ada' },
  { label: 'Grace Hopper', value: 'grace' },
];

export default function Validation() {
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 320 }}>
      <Autocomplete options={owners} label="Owner" required error helperText="Pick an owner before you save." fullWidth />
      <Autocomplete options={owners} defaultValue={owners[0]} label="Reviewer" disabled fullWidth />
    </Stack>
  );
}
