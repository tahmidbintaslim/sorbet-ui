'use client';
// @example {"title":"Dismissible","description":"onClose adds a close button. Keep the open state yourself."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Alert, Button } from '@sorbet-ui/react';

export default function Dismissible() {
  const [open, setOpen] = React.useState(true);
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 480, minHeight: 56, alignItems: 'flex-start', justifyContent: 'center' }}>
      {open ? (
        <Alert color="success" onClose={() => setOpen(false)} sx={{ width: '100%' }}>
          Invite sent to the team.
        </Alert>
      ) : (
        <Button size="sm" variant="soft" onClick={() => setOpen(true)}>
          Show the alert again
        </Button>
      )}
    </Stack>
  );
}
