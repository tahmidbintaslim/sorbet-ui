'use client';
// @example {"title":"Loading","description":"loading covers the panel with a spinner while its content loads."}
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Button, Popover } from '@sorbet-ui/react';

export default function Loading() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const open = (e: React.MouseEvent<HTMLElement>) => {
    setAnchor(e.currentTarget);
    setLoading(true);
    timer.current = window.setTimeout(() => setLoading(false), 1200);
  };
  return (
    <>
      <Button variant="soft" color="info" aria-haspopup="dialog" onClick={open}>
        Show build status
      </Button>
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} loading={loading} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ p: 2, width: 220 }} aria-busy={loading}>
          <Typography sx={{ fontWeight: 700 }}>Build #240</Typography>
          <Typography variant="body2">{loading ? 'Loading status' : 'Ready in 1m 42s (sample).'}</Typography>
        </Box>
      </Popover>
    </>
  );
}
