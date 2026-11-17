'use client';
// @example {"title":"With an action","description":"action adds buttons such as Undo. Ignore clickaway so a stray click does not dismiss it."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Button, Snackbar } from '@sorbet-ui/react';

export default function WithAction() {
  const [archived, setArchived] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const archive = () => {
    setArchived(true);
    setOpen(true);
  };
  const undo = () => {
    setArchived(false);
    setOpen(false);
  };
  return (
    <>
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <Button variant="outlined" color="neutral" onClick={archive} disabled={archived}>
          Archive conversation
        </Button>
        <Typography variant="body2" color="text.secondary" role="status">
          {archived ? 'Archived.' : 'In your inbox.'}
        </Typography>
      </Stack>
      <Snackbar
        open={open}
        onClose={(_e, reason) => reason !== 'clickaway' && setOpen(false)}
        autoHideDuration={6000}
        message="Conversation archived"
        action={
          <Button size="sm" variant="plain" color="neutral" onClick={undo} sx={{ color: 'inherit' }}>
            Undo
          </Button>
        }
      />
    </>
  );
}
