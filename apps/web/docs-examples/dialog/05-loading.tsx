'use client';
// @example {"title":"Loading","description":"loading covers the dialog with a spinner while a request is in flight."}
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@sorbet-ui/react';

export default function Loading() {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const save = () => {
    setSaving(true);
    timer.current = window.setTimeout(() => {
      setSaving(false);
      setOpen(false);
    }, 1500);
  };
  return (
    <>
      <Button variant="soft" onClick={() => setOpen(true)}>
        Publish changes
      </Button>
      <Dialog open={open} onClose={() => !saving && setOpen(false)} loading={saving} size="sm" aria-labelledby="loading-title" aria-busy={saving}>
        <DialogTitle id="loading-title">Publish to production?</DialogTitle>
        <DialogContent>Visitors will see the new version right away.</DialogContent>
        <DialogActions>
          <Button variant="ghost" color="neutral" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
