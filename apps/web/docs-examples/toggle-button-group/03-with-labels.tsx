'use client';
// @example {"title":"Text labels","description":"Buttons can hold text, or an icon with text."}
import * as React from 'react';
import { Stack } from '@mui/material';
import ViewList from '@mui/icons-material/ViewList';
import ViewModule from '@mui/icons-material/ViewModule';
import { ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

export default function WithLabels() {
  const [range, setRange] = React.useState('week');
  const [view, setView] = React.useState('list');
  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <ToggleButtonGroup exclusive value={range} onChange={(_e, next) => next && setRange(next)} aria-label="Date range">
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup exclusive variant="outlined" value={view} onChange={(_e, next) => next && setView(next)} aria-label="Layout">
        <ToggleButton value="list">
          <ViewList sx={{ mr: 1 }} />
          List
        </ToggleButton>
        <ToggleButton value="grid">
          <ViewModule sx={{ mr: 1 }} />
          Grid
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
