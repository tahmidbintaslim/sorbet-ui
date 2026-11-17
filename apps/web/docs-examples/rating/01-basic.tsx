'use client';
// @example {"title":"Basic","description":"Click a star, or use the arrow keys. Click the same star again to clear it."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Rating } from '@sorbet-ui/react';

export default function Basic() {
  const [value, setValue] = React.useState<number | null>(3);
  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      <Rating aria-label="Your rating" value={value} onChange={(_e, next) => setValue(next)} />
      <Typography variant="body2" color="text.secondary">
        {value === null ? 'Not rated yet' : `You rated it ${value} out of 5`}
      </Typography>
    </Stack>
  );
}
