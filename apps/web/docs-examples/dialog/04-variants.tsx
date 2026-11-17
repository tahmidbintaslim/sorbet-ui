'use client';
// @example {"title":"Variants and colors","description":"variant and color style the surface and the title accent."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
type Variant = (typeof VARIANTS)[number];

export default function Variants() {
  const [variant, setVariant] = React.useState<Variant>('solid');
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {VARIANTS.map((v) => (
          <Button
            key={v}
            size="sm"
            variant="soft"
            color="secondary"
            onClick={() => {
              setVariant(v);
              setOpen(true);
            }}
          >
            {v}
          </Button>
        ))}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)} variant={variant} color="secondary" size="sm" aria-labelledby="variants-title">
        <DialogTitle id="variants-title">A {variant} dialog</DialogTitle>
        <DialogContent>The secondary color accents this {variant} dialog.</DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setOpen(false)}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
