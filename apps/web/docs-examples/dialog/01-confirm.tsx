'use client';
// @example {"title":"Confirm","description":"A short question with two answers. Focus moves into the dialog and returns to the trigger on close."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@sorbet-ui/react';

export default function Confirm() {
  const [open, setOpen] = React.useState(false);
  const [answer, setAnswer] = React.useState('');
  const close = (result: string) => {
    setAnswer(result);
    setOpen(false);
  };
  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      <Button color="danger" variant="soft" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Typography variant="body2" color="text.secondary" role="status">
        {answer}
      </Typography>
      <Dialog open={open} onClose={() => close('Dismissed.')} size="sm" color="danger" aria-labelledby="confirm-title" aria-describedby="confirm-text">
        <DialogTitle id="confirm-title">Delete this project?</DialogTitle>
        <DialogContent id="confirm-text">This removes the project and its deploys. You cannot undo it.</DialogContent>
        <DialogActions>
          <Button variant="ghost" color="neutral" onClick={() => close('Kept the project.')}>
            Cancel
          </Button>
          <Button color="danger" onClick={() => close('Project deleted (not really).')}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
