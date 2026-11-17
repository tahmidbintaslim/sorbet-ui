'use client';
// @example {"title":"Basic","description":"Open it from an action. It closes itself after autoHideDuration."}
import * as React from 'react';
import { Button, Snackbar } from '@sorbet-ui/react';

export default function Basic() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Save settings</Button>
      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={4000} message="Settings saved" />
    </>
  );
}
