'use client';
// @example {"title":"Custom separator","description":"separator takes any node: a slash, a dot or an icon."}
import { Stack } from '@mui/material';
import { Breadcrumbs } from '@sorbet-ui/react';

const items = [
  { id: 'store', label: 'Store', href: '/' },
  { id: 'sorbet', label: 'Sorbet', href: '/docs' },
  { id: 'mango', label: 'Mango' },
];

export default function Separator() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Breadcrumbs aria-label="Path with slashes" separator="/" items={items} />
      <Breadcrumbs aria-label="Path with dots" separator="·" items={items} />
      <Breadcrumbs aria-label="Path with arrows" separator="→" items={items} />
    </Stack>
  );
}
