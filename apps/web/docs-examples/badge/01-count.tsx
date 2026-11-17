'use client';
// @example {"title":"Count","description":"badgeContent sits on the corner of its child."}
import { Stack } from '@mui/material';
import Mail from '@mui/icons-material/MailOutlined';
import Notifications from '@mui/icons-material/NotificationsNoneOutlined';
import { Badge, Button } from '@sorbet-ui/react';

export default function Count() {
  return (
    <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
      <Badge badgeContent={4}>
        <Button variant="outlined" color="neutral" size="sm">
          Inbox
        </Button>
      </Badge>
      <Badge badgeContent={2} color="danger">
        <Mail aria-label="Mail" />
      </Badge>
      <Badge badgeContent={12} color="success">
        <Notifications aria-label="Notifications" />
      </Badge>
    </Stack>
  );
}
