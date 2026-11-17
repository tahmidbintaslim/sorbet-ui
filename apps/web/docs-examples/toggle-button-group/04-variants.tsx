'use client';
// @example {"title":"Variants","description":"The five shared variants change how the pressed button is drawn."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  const [value, setValue] = React.useState('week');
  return (
    <Stack spacing={1.5}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 64 }}>
            {variant}
          </Typography>
          <ToggleButtonGroup exclusive variant={variant} value={value} onChange={(_e, next) => next && setValue(next)} aria-label={`Range (${variant})`}>
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      ))}
    </Stack>
  );
}
