'use client';
// @example {"title":"Sizes, variants and colors","description":"size sets the bar height; height overrides it in pixels."}
import { Stack } from '@mui/material';
import { Progress } from '@sorbet-ui/react';

export default function SizesAndVariants() {
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 360 }}>
      <Progress size="xs" value={50} aria-label="Extra small" />
      <Progress size="md" value={50} variant="soft" color="warning" aria-label="Medium soft" />
      <Progress size="xl" value={50} variant="outlined" color="danger" aria-label="Extra large outlined" />
      <Progress height={14} rounded={false} value={50} color="success" aria-label="Square corners" />
    </Stack>
  );
}
