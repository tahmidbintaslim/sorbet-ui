'use client';
// @example {"title":"Basic","description":"A modal side sheet. Name it with aria-label; Escape or a click outside closes it."}
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Button, Drawer } from '@sorbet-ui/react';

export default function Basic() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} aria-label="Order details">
        <Box sx={{ p: 3 }}>
          <Typography component="h4" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Order A-1042
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Waffle cones, 24. Shipped on 9 November 2026.
          </Typography>
          <Button variant="outlined" color="neutral" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
