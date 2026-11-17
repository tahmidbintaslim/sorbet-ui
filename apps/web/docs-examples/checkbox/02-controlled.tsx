'use client';
// @example {"title":"Controlled","description":"Drive checked from state and read the new value in onChange."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Button, Checkbox } from '@sorbet-ui/react';

export default function Controlled() {
  const [agreed, setAgreed] = React.useState(false);
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <Checkbox label="I agree to the terms" checked={agreed} onChange={(_e, checked) => setAgreed(checked)} />
      <Button disabled={!agreed}>Create account</Button>
      <Typography variant="body2" color="text.secondary">
        {agreed ? 'Thanks. You can continue.' : 'Tick the box to continue.'}
      </Typography>
    </Stack>
  );
}
