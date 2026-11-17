'use client';
// @example {"title":"Sizes and colors","description":"size changes the item height and type; color tints hover and selection."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Button, Menu, MenuItem } from '@sorbet-ui/react';

const OPTIONS = [
  { size: 'xs', color: 'neutral' },
  { size: 'md', color: 'secondary' },
  { size: 'xl', color: 'success' },
] as const;

export default function SizesAndColors() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [option, setOption] = React.useState<(typeof OPTIONS)[number]>(OPTIONS[1]);
  const close = () => setAnchor(null);
  return (
    <>
      <Stack direction="row" spacing={1}>
        {OPTIONS.map((o) => (
          <Button
            key={o.size}
            size="sm"
            variant="soft"
            color={o.color}
            aria-haspopup="true"
            onClick={(e) => {
              setOption(o);
              setAnchor(e.currentTarget);
            }}
          >
            {o.size}, {o.color}
          </Button>
        ))}
      </Stack>
      <Menu aria-label={`Menu, size ${option.size}`} variant="soft" size={option.size} color={option.color} anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        <MenuItem onClick={close}>Profile</MenuItem>
        <MenuItem onClick={close} selected>
          Settings
        </MenuItem>
        <MenuItem onClick={close}>Sign out</MenuItem>
      </Menu>
    </>
  );
}
