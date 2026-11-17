'use client';
// @example {"title":"Sizes","description":"Five sizes, xs to xl. The default is md."}
import { Stack } from '@mui/material';
import { Button } from '@sorbet-ui/react';

export default function Sizes() {
  return (
    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </Stack>
  );
}
