'use client';
// @example {"title":"Live count","description":"Change the count and the badge follows; invisible hides it."}
import * as React from 'react';
import { Stack } from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCartOutlined';
import { Badge, Button, Switch } from '@sorbet-ui/react';

export default function Interactive() {
  const [count, setCount] = React.useState(1);
  const [hidden, setHidden] = React.useState(false);
  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Badge badgeContent={count} color="secondary" invisible={hidden}>
        <ShoppingCart aria-label={`Cart, ${count} items`} />
      </Badge>
      <Stack direction="row" spacing={1}>
        <Button size="sm" variant="outlined" color="neutral" onClick={() => setCount((n) => Math.max(0, n - 1))}>
          Remove one
        </Button>
        <Button size="sm" onClick={() => setCount((n) => n + 1)}>
          Add one
        </Button>
      </Stack>
      <Switch size="sm" label="Hide badge" checked={hidden} onChange={(_e, checked) => setHidden(checked)} />
    </Stack>
  );
}
