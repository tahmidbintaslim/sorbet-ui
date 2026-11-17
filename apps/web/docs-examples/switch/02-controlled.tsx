'use client';
// @example {"title":"Controlled","description":"Drive checked from state to react to the change."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Switch } from '@sorbet-ui/react';

export default function Controlled() {
  const [on, setOn] = React.useState(false);
  return (
    <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
      <Switch label="Maintenance mode" color="warning" checked={on} onChange={(_e, checked) => setOn(checked)} />
      <Typography variant="body2" color="text.secondary">
        {on ? 'Visitors see the maintenance page.' : 'The site is live.'}
      </Typography>
    </Stack>
  );
}
