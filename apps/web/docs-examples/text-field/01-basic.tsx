'use client';
// @example {"title":"Label and helper text","description":"A label names the field; helper text explains it."}
import { Stack } from '@mui/material';
import { TextField } from '@sorbet-ui/react';

export default function Basic() {
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 340 }}>
      <TextField label="Full name" placeholder="Ada Lovelace" fullWidth />
      <TextField label="Work email" type="email" placeholder="you@example.com" helperText="We only use it for sign-in." fullWidth />
      <TextField label="Team name" required fullWidth />
    </Stack>
  );
}
