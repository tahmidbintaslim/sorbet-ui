'use client';
// @example {"title":"Controlled value","description":"Keep the selection in state and use it elsewhere."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Autocomplete } from '@sorbet-ui/react';

const zones = [
  { label: 'Lisbon (UTC+0)', value: 'Europe/Lisbon' },
  { label: 'Berlin (UTC+1)', value: 'Europe/Berlin' },
  { label: 'Nairobi (UTC+3)', value: 'Africa/Nairobi' },
  { label: 'Tokyo (UTC+9)', value: 'Asia/Tokyo' },
];

export default function Controlled() {
  const [zone, setZone] = React.useState<(typeof zones)[number] | null>(zones[1]);
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 320 }}>
      <Autocomplete options={zones} value={zone} onChange={(_e, next) => setZone(next)} label="Time zone" fullWidth />
      <Typography variant="body2" color="text.secondary">
        Selected: {zone ? zone.value : 'nothing'}
      </Typography>
    </Stack>
  );
}
