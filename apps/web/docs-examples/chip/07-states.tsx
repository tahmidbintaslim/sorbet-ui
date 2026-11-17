'use client';
// @example {"title":"Disabled and loading","description":"A loading chip shows a spinner in place of its icon."}
import { Stack } from '@mui/material';
import { Chip } from '@sorbet-ui/react';

export default function States() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      <Chip variant="soft" label="Disabled" disabled />
      <Chip variant="soft" color="info" label="Syncing" loading />
    </Stack>
  );
}
