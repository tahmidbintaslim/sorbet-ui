'use client';
// @example {"title":"Basic","description":"Anchor a floating panel to its trigger. Escape or a click outside closes it."}
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Button, Popover } from '@sorbet-ui/react';

export default function Basic() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  return (
    <>
      <Button variant="outlined" color="neutral" aria-haspopup="dialog" onClick={(e) => setAnchor(e.currentTarget)}>
        Usage details
      </Button>
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ p: 2, maxWidth: 260 }}>
          <Typography sx={{ fontWeight: 700 }}>Usage this month</Typography>
          <Typography variant="body2">Sample data: 1,204 of 5,000 builds used.</Typography>
        </Box>
      </Popover>
    </>
  );
}
