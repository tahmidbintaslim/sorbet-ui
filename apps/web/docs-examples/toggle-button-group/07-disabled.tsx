'use client';
// @example {"title":"Disabled","description":"Disable the whole group, or a single button."}
import { Stack } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

export default function Disabled() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <ToggleButtonGroup exclusive disabled value="week" aria-label="Range (disabled)">
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup exclusive value="day" aria-label="Range (one option disabled)">
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month" disabled>
          Month
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
