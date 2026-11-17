'use client';
// @example {"title":"Swap for content","description":"Render the skeleton while loading, then the real content in the same space."}
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Avatar, Button, Skeleton } from '@sorbet-ui/react';

export default function LoadingSwap() {
  const [loading, setLoading] = React.useState(true);
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 300 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minHeight: 48 }} aria-busy={loading}>
        {loading ? <Skeleton shape="circular" /> : <Avatar>AL</Avatar>}
        <Box sx={{ flex: 1 }}>
          {loading ? (
            <>
              <Skeleton width="70%" />
              <Skeleton width="45%" size="sm" />
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: 600 }}>Ada Lovelace</Typography>
              <Typography variant="body2" color="text.secondary">
                Engineer, Platform
              </Typography>
            </>
          )}
        </Box>
      </Stack>
      <Button size="sm" variant="soft" onClick={() => setLoading((v) => !v)}>
        {loading ? 'Finish loading' : 'Show skeleton'}
      </Button>
    </Stack>
  );
}
