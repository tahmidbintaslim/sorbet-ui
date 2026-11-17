'use client';
// @example {"title":"Filter chips","description":"onClick makes a chip a button. aria-pressed tells assistive tech which filters are on."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Chip } from '@sorbet-ui/react';

const FILTERS = ['Open', 'In review', 'Merged', 'Closed'];

export default function Filter() {
  const [active, setActive] = React.useState<string[]>(['Open']);
  const toggle = (name: string) => setActive((list) => (list.includes(name) ? list.filter((n) => n !== name) : [...list, name]));
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {FILTERS.map((name) => (
          <Chip
            key={name}
            label={name}
            variant={active.includes(name) ? 'solid' : 'outlined'}
            aria-pressed={active.includes(name)}
            onClick={() => toggle(name)}
          />
        ))}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Showing: {active.length ? active.join(', ') : 'everything'}
      </Typography>
    </Stack>
  );
}
