'use client';
// @example {"title":"As a link","description":"Pass href and the button renders an anchor, so it works as real navigation."}
import { Stack } from '@mui/material';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { Button } from '@sorbet-ui/react';

export default function AsLink() {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
      <Button href="/docs">Read the docs</Button>
      <Button variant="outlined" href="/docs/theming" endIcon={<OpenInNew />}>
        Theming guide
      </Button>
      <Button variant="link" href="/docs/components">
        All components
      </Button>
    </Stack>
  );
}
