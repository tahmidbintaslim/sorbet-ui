'use client';
// @example {"title":"Labels","description":"showLabel prints the value at the end, above or below; formatLabel changes the text."}
import { Stack } from '@mui/material';
import { Progress } from '@sorbet-ui/react';

export default function Labels() {
  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 360 }}>
      <Progress value={65} showLabel aria-label="Storage used" />
      <Progress value={30} showLabel labelPosition="top" color="secondary" aria-label="Profile completed" />
      <Progress value={80} showLabel labelPosition="bottom" color="success" formatLabel={(value) => `${value} of 100 files`} aria-label="Files synced" />
    </Stack>
  );
}
