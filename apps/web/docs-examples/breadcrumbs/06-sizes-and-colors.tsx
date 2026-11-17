'use client';
// @example {"title":"Sizes and colors","description":"Five sizes, xs to xl; color tints the links."}
import { Stack } from '@mui/material';
import { Breadcrumbs } from '@sorbet-ui/react';

const items = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'blocks', label: 'Blocks', href: '/blocks' },
  { id: 'page', label: 'Pricing' },
];

export default function SizesAndColors() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Breadcrumbs size="xs" color="neutral" aria-label="Extra small breadcrumb" items={items} />
      <Breadcrumbs size="md" color="secondary" aria-label="Medium breadcrumb" items={items} />
      <Breadcrumbs size="xl" color="success" aria-label="Extra large breadcrumb" items={items} />
    </Stack>
  );
}
