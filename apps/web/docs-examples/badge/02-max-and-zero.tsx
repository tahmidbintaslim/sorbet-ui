'use client';
// @example {"title":"Maximum and zero","description":"MUI's max caps the number; a zero count hides the badge unless showZero is set."}
import { Stack } from '@mui/material';
import { Badge, Button } from '@sorbet-ui/react';

export default function MaxAndZero() {
  return (
    <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
      <Badge badgeContent={128} max={99}>
        <Button variant="soft" size="sm">
          Capped at 99
        </Button>
      </Badge>
      <Badge badgeContent={0}>
        <Button variant="soft" size="sm">
          Zero is hidden
        </Button>
      </Badge>
      <Badge badgeContent={0} showZero color="neutral">
        <Button variant="soft" size="sm">
          showZero
        </Button>
      </Badge>
    </Stack>
  );
}
