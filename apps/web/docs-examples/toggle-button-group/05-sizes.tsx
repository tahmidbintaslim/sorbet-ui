'use client';
// @example {"title":"Sizes","description":"Five sizes, xs to xl."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  const [value, setValue] = React.useState('on');
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      {SIZES.map((size) => (
        <ToggleButtonGroup key={size} exclusive size={size} value={value} onChange={(_e, next) => next && setValue(next)} aria-label={`Mode (${size})`}>
          <ToggleButton value="on">On</ToggleButton>
          <ToggleButton value="auto">Auto</ToggleButton>
          <ToggleButton value="off">Off</ToggleButton>
        </ToggleButtonGroup>
      ))}
    </Stack>
  );
}
