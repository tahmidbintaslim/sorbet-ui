'use client';
// @example {"title":"Value label","description":"showLabel prints the value beside the stars; formatLabel sets its text."}
import { Stack } from '@mui/material';
import { Rating } from '@sorbet-ui/react';

const WORDS = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

export default function WithLabel() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Rating aria-label="Service" defaultValue={4} showLabel />
      <Rating
        aria-label="Food"
        defaultValue={3}
        showLabel
        labelPosition="bottom"
        formatLabel={(value) => (value ? WORDS[Math.ceil(value) - 1] : 'Not rated')}
        helperText="Hover the stars to preview."
        color="secondary"
      />
    </Stack>
  );
}
