'use client';
// @example {"title":"Anchors","description":"anchor slides the sheet in from the left, right, top or bottom."}
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Drawer } from '@sorbet-ui/react';

const ANCHORS = ['left', 'right', 'top', 'bottom'] as const;
type Anchor = (typeof ANCHORS)[number];

export default function Anchors() {
  const [anchor, setAnchor] = React.useState<Anchor>('left');
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {ANCHORS.map((a) => (
          <Button
            key={a}
            size="sm"
            variant="soft"
            onClick={() => {
              setAnchor(a);
              setOpen(true);
            }}
          >
            {a}
          </Button>
        ))}
      </Stack>
      <Drawer anchor={anchor} size="sm" open={open} onClose={() => setOpen(false)} aria-label={`Drawer from the ${anchor}`}>
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>From the {anchor}</Typography>
          <Button size="sm" variant="outlined" color="neutral" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
