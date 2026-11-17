'use client';
// @example {"title":"Sizes","description":"size sets the maximum width, from 320px (xs) to 900px (xl)."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@sorbet-ui/react';

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
      <Dialog open={open} onClose={() => setOpen(false)} size={size} fullWidth aria-labelledby="sizes-title">
        <DialogTitle id="sizes-title">Size {size}</DialogTitle>
        <DialogContent>The dialog grows up to its size and never past the screen.</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
