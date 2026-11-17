'use client';
// @example {"title":"Sizes and variants","description":"Sizes change the track and thumb; variants restyle the track."}
import { Stack } from '@mui/material';
import { Slider } from '@sorbet-ui/react';

export default function SizesAndVariants() {
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 320 }}>
      <Slider aria-label="Extra small" size="xs" defaultValue={30} />
      <Slider aria-label="Medium soft" size="md" variant="soft" defaultValue={50} />
      <Slider aria-label="Large outlined" size="lg" variant="outlined" defaultValue={70} />
      <Slider aria-label="Disabled" defaultValue={40} disabled />
    </Stack>
  );
}
