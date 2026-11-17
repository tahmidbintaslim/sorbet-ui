'use client';
// @example {"title":"Read only and disabled","description":"readOnly shows a score that cannot be changed; disabled also dims it."}
import { Stack, Typography } from '@mui/material';
import { Rating } from '@sorbet-ui/react';

export default function ReadOnly() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Rating aria-label="Average rating" value={4.5} precision={0.5} readOnly />
        <Typography variant="body2" color="text.secondary">
          4.5 average (sample data)
        </Typography>
      </Stack>
      <Rating aria-label="Disabled rating" value={2} disabled />
    </Stack>
  );
}
