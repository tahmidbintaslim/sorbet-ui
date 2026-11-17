'use client';
// @example {"title":"Full width","description":"shape=\"block\" fills the container; shape=\"wide\" stops at 256px."}
import { Stack } from '@mui/material';
import { Button } from '@sorbet-ui/react';

export default function FullWidth() {
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 360, alignItems: 'center' }}>
      <Button shape="block">Create account</Button>
      <Button shape="block" variant="outlined" color="neutral">
        Sign in instead
      </Button>
      <Button shape="wide" variant="soft">
        Wide
      </Button>
    </Stack>
  );
}
