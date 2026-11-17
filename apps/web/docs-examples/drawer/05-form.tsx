'use client';
// @example {"title":"Edit form","description":"Drawers suit side tasks such as editing a record without leaving the page."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Button, Drawer, Switch, TextField } from '@sorbet-ui/react';

export default function Form() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('Mango');
  const [draft, setDraft] = React.useState(name);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setName(draft);
    setOpen(false);
  };
  return (
    <>
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <Typography>
          Project: <strong>{name}</strong>
        </Typography>
        <Button
          size="sm"
          variant="soft"
          onClick={() => {
            setDraft(name);
            setOpen(true);
          }}
        >
          Edit project
        </Button>
      </Stack>
      <Drawer anchor="right" size="sm" open={open} onClose={() => setOpen(false)} aria-labelledby="edit-project-title">
        <Stack component="form" onSubmit={save} spacing={2.5} sx={{ p: 3 }}>
          <Typography id="edit-project-title" component="h4" variant="h6" sx={{ fontWeight: 700 }}>
            Edit project
          </Typography>
          <TextField label="Name" required fullWidth value={draft} onChange={(e) => setDraft(e.target.value)} />
          <Switch label="Preview deploys" defaultChecked />
          <Stack direction="row" spacing={1}>
            <Button type="submit">Save</Button>
            <Button variant="ghost" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
