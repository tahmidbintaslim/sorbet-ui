'use client';
// @example {"title":"Shapes","description":"text, circular, rectangular and rounded placeholders."}
import { Stack } from '@mui/material';
import { Skeleton } from '@sorbet-ui/react';

export default function Shapes() {
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 300 }}>
      <Skeleton shape="text" />
      <Skeleton shape="circular" />
      <Skeleton shape="rectangular" />
      <Skeleton shape="rounded" />
    </Stack>
  );
}
