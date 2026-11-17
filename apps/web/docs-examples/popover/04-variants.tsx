'use client';
// @example {"title":"Variants and colors","description":"variant and color style the panel surface."}
import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { Button, Popover } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
type Variant = (typeof VARIANTS)[number];

export default function Variants() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [variant, setVariant] = React.useState<Variant>('plain');
  return (
    <>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {VARIANTS.map((v) => (
          <Button
            key={v}
            size="sm"
            variant="outlined"
            color="neutral"
            aria-haspopup="dialog"
            onClick={(e) => {
              setVariant(v);
              setAnchor(e.currentTarget);
            }}
          >
            {v}
          </Button>
        ))}
      </Stack>
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} variant={variant} color="primary" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Box sx={{ p: 2 }}>A {variant} popover</Box>
      </Popover>
    </>
  );
}
