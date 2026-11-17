'use client';
// @example {"title":"Disabled and compact","description":"disabled blocks every button; hide the arrows for a compact pager."}
import { Stack } from '@mui/material';
import { Pagination } from '@sorbet-ui/react';

export default function Disabled() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Pagination count={6} defaultPage={2} disabled aria-label="Disabled pagination" />
      <Pagination count={6} defaultPage={2} hidePrevButton hideNextButton variant="soft" aria-label="Pagination without arrows" />
    </Stack>
  );
}
