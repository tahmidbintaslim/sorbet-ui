'use client';
// @example {"title":"Variants","description":"Five variants, from a solid toast to a plain one."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Button, Snackbar } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  const [variant, setVariant] = React.useState<(typeof VARIANTS)[number]>('solid');
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {VARIANTS.map((v) => (
          <Button
            key={v}
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => {
              setVariant(v);
              setOpen(true);
            }}
          >
            {v}
          </Button>
        ))}
      </Stack>
      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={3000} variant={variant} color="primary" message={`A ${variant} snackbar`} />
    </>
  );
}
