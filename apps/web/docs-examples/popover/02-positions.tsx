'use client';
// @example {"title":"Positions","description":"anchorOrigin picks the point on the trigger; transformOrigin picks the point on the panel."}
import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { Button, Popover } from '@sorbet-ui/react';

const POSITIONS = {
  above: { anchorOrigin: { vertical: 'top', horizontal: 'center' }, transformOrigin: { vertical: 'bottom', horizontal: 'center' } },
  below: { anchorOrigin: { vertical: 'bottom', horizontal: 'center' }, transformOrigin: { vertical: 'top', horizontal: 'center' } },
  right: { anchorOrigin: { vertical: 'center', horizontal: 'right' }, transformOrigin: { vertical: 'center', horizontal: 'left' } },
} as const;

type Position = keyof typeof POSITIONS;

export default function Positions() {
  const [state, setState] = React.useState<{ anchor: HTMLElement; position: Position } | null>(null);
  const [position, setPosition] = React.useState<Position>('below');
  return (
    <>
      <Stack direction="row" spacing={1}>
        {(Object.keys(POSITIONS) as Position[]).map((p) => (
          <Button
            key={p}
            size="sm"
            variant="soft"
            aria-haspopup="dialog"
            onClick={(e) => {
              setPosition(p);
              setState({ anchor: e.currentTarget, position: p });
            }}
          >
            {p}
          </Button>
        ))}
      </Stack>
      <Popover open={Boolean(state)} anchorEl={state?.anchor ?? null} onClose={() => setState(null)} {...POSITIONS[position]}>
        <Box sx={{ p: 1.5 }}>Opened {position}</Box>
      </Popover>
    </>
  );
}
