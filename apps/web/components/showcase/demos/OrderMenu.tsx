'use client';
// Order actions on the Menu: open the ⋯ button, pick an action, and the order card
// shows what happened. Arrow keys move through the items; Escape closes.
import * as React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { Avatar, Chip, Menu, MenuItem } from '@sorbet-ui/react';

type Status = { label: string; color: 'warning' | 'success' | 'info' | 'danger' };
const ACTIONS: { id: string; label: string; status: Status }[] = [
  { id: 'ready', label: 'Mark ready', status: { label: 'Ready', color: 'success' } },
  { id: 'print', label: 'Print ticket', status: { label: 'Ticket printed', color: 'info' } },
  { id: 'refund', label: 'Refund', status: { label: 'Refunded', color: 'danger' } },
];

export default function OrderMenu() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [status, setStatus] = React.useState<Status>({ label: 'Making', color: 'warning' });
  const id = React.useId();
  const open = Boolean(anchor);
  const close = () => setAnchor(null);

  return (
    <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
      <Box sx={(t) => ({ width: '100%', maxWidth: 320, p: 2, borderRadius: '20px', bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}`, boxShadow: '0 1px 2px rgb(15 23 42 / 0.05), 0 18px 36px -18px rgb(15 23 42 / 0.25)' })}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar size="md" color="secondary" variant="soft">
            NH
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Noor Haddad</Typography>
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>#1052 · 2× Ube Swirl</Typography>
          </Box>
          <IconButton
            id={`${id}-button`}
            aria-label="Order actions"
            aria-haspopup="true"
            aria-controls={open ? `${id}-menu` : undefined}
            aria-expanded={open ? 'true' : undefined}
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{ width: 40, height: 40 }}
          >
            <MoreHoriz />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Status</Typography>
          <Box role="status" data-testid="order-status">
            <Chip size="sm" variant="soft" color={status.color} label={status.label} disableAnimation />
          </Box>
        </Box>
        <Menu id={`${id}-menu`} aria-labelledby={`${id}-button`} anchorEl={anchor} open={open} onClose={close} size="sm" color="secondary">
          {ACTIONS.map((a) => (
            <MenuItem
              key={a.id}
              onClick={() => {
                setStatus(a.status);
                close();
              }}
            >
              {a.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
}
