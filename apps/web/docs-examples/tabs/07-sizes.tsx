'use client';
// @example {"title":"Sizes and colors","description":"Five sizes, xs to xl, in any theme color."}
import { Stack } from '@mui/material';
import { Tabs } from '@sorbet-ui/react';

const tabs = [
  { id: 'one', label: 'Code' },
  { id: 'two', label: 'Issues' },
  { id: 'three', label: 'Releases' },
];

export default function Sizes() {
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 460 }}>
      <Tabs size="xs" color="info" aria-label="Extra small tabs" renderPanels={false} tabs={tabs} />
      <Tabs size="md" color="success" aria-label="Medium tabs" renderPanels={false} tabs={tabs} />
      <Tabs size="xl" color="danger" aria-label="Extra large tabs" renderPanels={false} tabs={tabs} />
    </Stack>
  );
}
