'use client';
// @example {"title":"Colors and scale","description":"color tints the filled stars; max sets how many there are."}
import { Stack } from '@mui/material';
import { Rating } from '@sorbet-ui/react';

export default function ColorsAndMax() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Rating aria-label="Danger rating" color="danger" defaultValue={2} />
      <Rating aria-label="Success rating" color="success" defaultValue={4} />
      <Rating aria-label="Rating out of ten" color="info" max={10} defaultValue={7} />
    </Stack>
  );
}
