'use client';
// @example {"title":"Disabled and loading","description":"A loading field shows a spinner, sets aria-busy and cannot be edited."}
import { Stack } from '@mui/material';
import { TextField } from '@sorbet-ui/react';

export default function States() {
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 340 }}>
      <TextField label="Workspace URL" defaultValue="sorbet.example.com" disabled fullWidth />
      <TextField label="Checking name" defaultValue="mint-chip" loading fullWidth />
    </Stack>
  );
}
