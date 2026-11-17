'use client';
// @example {"title":"Selected item","description":"Mark the current choice with selected. It receives focus when the menu opens."}
import * as React from 'react';
import { Button, Menu, MenuItem } from '@sorbet-ui/react';

const SORTS = ['Newest first', 'Oldest first', 'Name A to Z'];

export default function Selection() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [sort, setSort] = React.useState(SORTS[0]);
  const id = React.useId();
  const open = Boolean(anchor);
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
        Sort: {sort}
      </Button>
      <Menu id={`${id}-menu`} aria-labelledby={`${id}-button`} anchorEl={anchor} open={open} onClose={() => setAnchor(null)} variant="soft">
        {SORTS.map((option) => (
          <MenuItem
            key={option}
            selected={option === sort}
            onClick={() => {
              setSort(option);
              setAnchor(null);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
