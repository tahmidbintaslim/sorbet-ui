'use client';
// @example {"title":"Disabled","description":"Disabled buttons share one muted look in every variant."}
import { Stack } from '@mui/material';
import { Button } from '@sorbet-ui/react';

export default function Disabled() {
  return (
    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button disabled>Solid</Button>
      <Button variant="soft" disabled>
        Soft
      </Button>
      <Button variant="outlined" disabled>
        Outlined
      </Button>
      <Button variant="plain" disabled>
        Plain
      </Button>
    </Stack>
  );
}
