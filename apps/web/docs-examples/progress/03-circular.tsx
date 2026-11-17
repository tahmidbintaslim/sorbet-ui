'use client';
// @example {"title":"Circular","description":"type=\"circular\" draws a ring; circleSize and thickness size it."}
import { Stack } from '@mui/material';
import { Progress } from '@sorbet-ui/react';

export default function Circular() {
  return (
    <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
      <Progress type="circular" value={25} aria-label="Quarter done" />
      <Progress type="circular" value={60} showLabel color="success" aria-label="Sixty percent done" />
      <Progress type="circular" value={90} showLabel circleSize={72} thickness={5} color="secondary" aria-label="Ninety percent done" />
    </Stack>
  );
}
