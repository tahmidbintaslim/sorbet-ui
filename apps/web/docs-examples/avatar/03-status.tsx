'use client';
// @example {"title":"Status","description":"status adds a dot for online, away, busy or offline."}
import { Stack, Typography } from '@mui/material';
import { Avatar } from '@sorbet-ui/react';

const STATUSES = ['online', 'away', 'busy', 'offline'] as const;

export default function Status() {
  return (
    <Stack direction="row" spacing={3}>
      {STATUSES.map((status) => (
        <Stack key={status} spacing={0.5} sx={{ alignItems: 'center' }}>
          <Avatar status={status} variant="soft">
            {status[0].toUpperCase()}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {status}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
