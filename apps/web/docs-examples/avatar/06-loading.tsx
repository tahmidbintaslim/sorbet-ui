'use client';
// @example {"title":"Loading","description":"loading covers the avatar with a spinner, for example while a photo uploads."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Avatar, Button } from '@sorbet-ui/react';

export default function Loading() {
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const upload = () => {
    setLoading(true);
    timer.current = window.setTimeout(() => setLoading(false), 1500);
  };
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Avatar size="lg" loading={loading}>
        AL
      </Avatar>
      <Button variant="soft" size="sm" onClick={upload} disabled={loading}>
        Upload photo
      </Button>
    </Stack>
  );
}
