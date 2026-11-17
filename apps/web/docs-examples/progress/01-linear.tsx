'use client';
// @example {"title":"Linear","description":"A determinate bar from 0 to 100. Press the buttons to move it."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Button, Progress } from '@sorbet-ui/react';

export default function Linear() {
  const [value, setValue] = React.useState(40);
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 360 }}>
      <Progress value={value} aria-label="Upload progress" showLabel />
      <Stack direction="row" spacing={1}>
        <Button size="sm" variant="outlined" color="neutral" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          Back 10
        </Button>
        <Button size="sm" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          Forward 10
        </Button>
      </Stack>
    </Stack>
  );
}
