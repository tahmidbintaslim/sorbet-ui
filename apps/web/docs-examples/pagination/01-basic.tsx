'use client';
// @example {"title":"Basic","description":"Controlled with page and onChange. Each button has a name such as \"Go to page 3\"."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Pagination } from '@sorbet-ui/react';

export default function Basic() {
  const [page, setPage] = React.useState(2);
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Pagination count={8} page={page} onChange={(_e, next) => setPage(next)} />
      <Typography variant="body2" color="text.secondary" role="status">
        Page {page} of 8
      </Typography>
    </Stack>
  );
}
