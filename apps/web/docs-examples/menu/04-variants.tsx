'use client';
// @example {"title":"Variants","description":"Five looks for the menu surface and its items."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Button, Menu, MenuItem } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
type Variant = (typeof VARIANTS)[number];

export default function Variants() {
  const [state, setState] = React.useState<{ anchor: HTMLElement; variant: Variant } | null>(null);
  const [variant, setVariant] = React.useState<Variant>('plain');
  const close = () => setState(null);
  return (
    <>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {VARIANTS.map((v) => (
          <Button
            key={v}
            size="sm"
            variant="outlined"
            color="neutral"
            aria-haspopup="true"
            onClick={(e) => {
              setVariant(v);
              setState({ anchor: e.currentTarget, variant: v });
            }}
          >
            {v}
          </Button>
        ))}
      </Stack>
      <Menu aria-label={`Actions (${variant})`} variant={variant} anchorEl={state?.anchor ?? null} open={Boolean(state)} onClose={close}>
        <MenuItem onClick={close}>Rename</MenuItem>
        <MenuItem onClick={close} selected>
          Duplicate
        </MenuItem>
        <MenuItem onClick={close}>Archive</MenuItem>
      </Menu>
    </>
  );
}
