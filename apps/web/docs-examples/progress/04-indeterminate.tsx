'use client';
// @example {"title":"Indeterminate","description":"For work with no known length. The accessible name defaults to \"Loading\"."}
import { Stack } from '@mui/material';
import { Progress } from '@sorbet-ui/react';

export default function Indeterminate() {
  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 360, alignItems: 'center' }}>
      <Progress indeterminate aria-label="Loading results" sx={{ width: '100%' }} />
      <Progress type="circular" indeterminate color="info" aria-label="Loading profile" />
    </Stack>
  );
}
