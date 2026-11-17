'use client';
// @example {"title":"Variants","description":"Seven looks, from a filled call to action down to a text link."}
import { Stack } from '@mui/material';
import { Button } from '@sorbet-ui/react';

export default function Variants() {
  return (
    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
      <Button variant="solid">Solid</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="dash">Dash</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="plain">Plain</Button>
      <Button variant="link">Link</Button>
    </Stack>
  );
}
