'use client';
// @example {"title":"Value label","description":"showValue shows the value in a bubble while dragging, or always under the track."}
import { Stack } from '@mui/material';
import { Slider } from '@sorbet-ui/react';

export default function ValueLabel() {
  return (
    <Stack spacing={4} sx={{ width: '100%', maxWidth: 320, pt: 3 }}>
      <Slider aria-label="Brightness" defaultValue={70} showValue />
      <Slider aria-label="Contrast" defaultValue={45} showValue valueLabelPosition="bottom" color="secondary" />
    </Stack>
  );
}
