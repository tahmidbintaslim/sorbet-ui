'use client';
// @example {"title":"Loading","description":"loading covers the card with a spinner and sets aria-busy."}
import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { Button, Card } from '@sorbet-ui/react';

export default function Loading() {
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const refresh = () => {
    setLoading(true);
    timer.current = window.setTimeout(() => setLoading(false), 1500);
  };
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 320, alignItems: 'flex-start' }}>
      <Card loading={loading} sx={{ p: 2.5, width: '100%' }}>
        <Typography sx={{ fontWeight: 700 }}>Usage this month</Typography>
        <Typography variant="body2" color="text.secondary">
          Sample data: 1,204 of 5,000 builds.
        </Typography>
      </Card>
      <Button size="sm" variant="soft" onClick={refresh} disabled={loading}>
        Refresh
      </Button>
    </Stack>
  );
}
