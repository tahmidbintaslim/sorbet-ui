'use client';
// @example {"title":"Basic","description":"Anchor the menu to its trigger. Arrow keys move between items and Escape closes it."}
import * as React from 'react';
import { Button, Menu, MenuItem } from '@sorbet-ui/react';

export default function Basic() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const id = React.useId();
  const open = Boolean(anchor);
  const close = () => setAnchor(null);
  return (
    <>
      <Button
        id={`${id}-button`}
        variant="outlined"
        color="neutral"
        aria-haspopup="true"
        aria-controls={open ? `${id}-menu` : undefined}
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        Options
      </Button>
      <Menu id={`${id}-menu`} aria-labelledby={`${id}-button`} anchorEl={anchor} open={open} onClose={close}>
        <MenuItem onClick={close}>Rename</MenuItem>
        <MenuItem onClick={close}>Duplicate</MenuItem>
        <MenuItem onClick={close}>Move to folder</MenuItem>
      </Menu>
    </>
  );
}
