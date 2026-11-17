'use client';
// @example {"title":"Card placeholder","description":"Compose shapes into the outline of the content. Mark the wrapper aria-busy and name what is loading."}
import { Box, Stack } from '@mui/material';
import { Card, Skeleton } from '@sorbet-ui/react';

const srOnly = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const;

export default function CardPlaceholder() {
  return (
    <Card sx={{ p: 2, width: '100%', maxWidth: 320 }} aria-busy="true">
      <Box component="span" sx={srOnly}>
        Loading profile
      </Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
        <Skeleton shape="circular" size="lg" />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%" />
          <Skeleton width="35%" size="sm" />
        </Box>
      </Stack>
      <Skeleton shape="rounded" height={96} />
      <Skeleton sx={{ mt: 1.5 }} />
      <Skeleton width="80%" />
    </Card>
  );
}
