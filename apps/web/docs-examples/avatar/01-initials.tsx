'use client';
// @example {"title":"Initials","description":"Text children render as initials on a colored circle."}
import { Stack } from '@mui/material';
import { Avatar } from '@sorbet-ui/react';

export default function Initials() {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar>AL</Avatar>
      <Avatar color="secondary">GH</Avatar>
      <Avatar color="success">KJ</Avatar>
    </Stack>
  );
}
