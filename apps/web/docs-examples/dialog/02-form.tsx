'use client';
// @example {"title":"Form dialog","description":"Wrap the content in a form so Enter submits. The first field takes focus."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@sorbet-ui/react';

export default function Form() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [saved, setSaved] = React.useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(name);
    setOpen(false);
  };
  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>New workspace</Button>
      <Typography variant="body2" color="text.secondary" role="status">
        {saved && `Created "${saved}".`}
      </Typography>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-title" fullWidth>
        <form onSubmit={submit}>
          <DialogTitle id="form-title">New workspace</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              fullWidth
              label="Workspace name"
              helperText="You can rename it later."
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="ghost" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Stack>
  );
}
