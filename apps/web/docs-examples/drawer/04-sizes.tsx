'use client';
// @example {"title":"Sizes","description":"size sets the width for left and right drawers (240px to 680px) and the height for top and bottom ones."}
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Drawer } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
type Size = (typeof SIZES)[number];

export default function Sizes() {
  const [size, setSize] = React.useState<Size>('md');
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {SIZES.map((s) => (
          <Button
            key={s}
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => {
              setSize(s);
              setOpen(true);
            }}
          >
            {s}
          </Button>
        ))}
      </Stack>
      <Drawer anchor="right" size={size} open={open} onClose={() => setOpen(false)} aria-label={`Drawer, size ${size}`}>
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Size {size}</Typography>
          <Button size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
