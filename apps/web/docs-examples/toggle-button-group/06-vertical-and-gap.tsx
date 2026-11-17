'use client';
// @example {"title":"Vertical, gap and full width","description":"Stack the buttons, separate them with a gap, or stretch the group across its container."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

export default function VerticalAndGap() {
  const [plan, setPlan] = React.useState('team');
  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 420, alignItems: 'center' }}>
      <ToggleButtonGroup exclusive fullWidth color="secondary" value={plan} onChange={(_e, next) => next && setPlan(next)} aria-label="Plan (full width)">
        <ToggleButton value="solo">Solo</ToggleButton>
        <ToggleButton value="team">Team</ToggleButton>
        <ToggleButton value="org">Org</ToggleButton>
      </ToggleButtonGroup>
      <Stack direction="row" spacing={4} sx={{ alignItems: 'flex-start' }}>
        <ToggleButtonGroup exclusive orientation="vertical" variant="soft" value={plan} onChange={(_e, next) => next && setPlan(next)} aria-label="Plan (vertical)">
          <ToggleButton value="solo">Solo</ToggleButton>
          <ToggleButton value="team">Team</ToggleButton>
          <ToggleButton value="org">Org</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup exclusive gap={8} variant="outlined" value={plan} onChange={(_e, next) => next && setPlan(next)} aria-label="Plan (with gap)">
          <ToggleButton value="solo">Solo</ToggleButton>
          <ToggleButton value="team">Team</ToggleButton>
          <ToggleButton value="org">Org</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
