'use client';
// @example {"title":"With a form","description":"Popovers can hold controls. Focus moves inside and returns to the trigger on close."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Button, Popover, TextField } from '@sorbet-ui/react';

export default function WithActions() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [label, setLabel] = React.useState('Untitled');
  const [draft, setDraft] = React.useState(label);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setLabel(draft || 'Untitled');
    setAnchor(null);
  };
  return (
    <>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
        <Button
          size="sm"
          variant="soft"
          aria-haspopup="dialog"
          onClick={(e) => {
            setDraft(label);
            setAnchor(e.currentTarget);
          }}
        >
          Rename
        </Button>
      </Stack>
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Stack component="form" onSubmit={save} spacing={1.5} sx={{ p: 2, width: 260 }}>
          <TextField autoFocus size="sm" label="Name" fullWidth value={draft} onChange={(e) => setDraft(e.target.value)} />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <Button size="sm" variant="ghost" color="neutral" onClick={() => setAnchor(null)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}
