'use client';
// @example {"title":"Pulse and loading","description":"pulse draws attention (it stays still for reduced motion); loading swaps the content for a spinner."}
import { Stack } from '@mui/material';
import { Avatar, Badge } from '@sorbet-ui/react';

export default function PulseAndLoading() {
  return (
    <Stack direction="row" spacing={5} sx={{ alignItems: 'center' }}>
      <Badge badgeContent={3} color="danger" pulse>
        <Avatar variant="soft">AL</Avatar>
      </Badge>
      <Badge badgeContent={3} color="info" loading>
        <Avatar variant="soft" color="info">
          GH
        </Avatar>
      </Badge>
    </Stack>
  );
}
