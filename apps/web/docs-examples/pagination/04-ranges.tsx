'use client';
// @example {"title":"Siblings and boundaries","description":"siblingCount sets the pages around the current one; boundaryCount sets the pages kept at each end."}
import { Stack } from '@mui/material';
import { Pagination } from '@sorbet-ui/react';

export default function Ranges() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Pagination count={30} defaultPage={15} siblingCount={0} aria-label="Pagination, no siblings" />
      <Pagination count={30} defaultPage={15} siblingCount={1} boundaryCount={2} aria-label="Pagination, two boundary pages" />
    </Stack>
  );
}
