'use client';
// @example {"title":"Icons, dividers and disabled items","description":"Use MUI's ListItemIcon and Divider inside the menu."}
import * as React from 'react';
import { Divider, ListItemIcon } from '@mui/material';
import Edit from '@mui/icons-material/EditOutlined';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Archive from '@mui/icons-material/ArchiveOutlined';
import Delete from '@mui/icons-material/DeleteOutlined';
import { Button, Menu, MenuItem } from '@sorbet-ui/react';

export default function WithIcons() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const id = React.useId();
  const open = Boolean(anchor);
  const close = () => setAnchor(null);
  return (
    <>
      <Button
        id={`${id}-button`}
        variant="soft"
        aria-haspopup="true"
        aria-controls={open ? `${id}-menu` : undefined}
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        File actions
      </Button>
      <Menu id={`${id}-menu`} aria-labelledby={`${id}-button`} anchorEl={anchor} open={open} onClose={close}>
        <MenuItem onClick={close}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={close}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          Copy link
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon>
            <Archive fontSize="small" />
          </ListItemIcon>
          Archive (owner only)
        </MenuItem>
        <Divider />
        <MenuItem onClick={close}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
