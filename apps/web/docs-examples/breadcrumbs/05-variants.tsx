'use client';
// @example {"title":"Variants","description":"Five variants, from plain links to a filled bar."}
import { Stack, Typography } from '@mui/material';
import { Breadcrumbs } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

const items = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'docs', label: 'Docs', href: '/docs' },
  { id: 'page', label: 'Theming' },
];

export default function Variants() {
  return (
    <Stack spacing={1.5}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 64 }}>
            {variant}
          </Typography>
          <Breadcrumbs variant={variant} aria-label={`Breadcrumb (${variant})`} items={items} />
        </Stack>
      ))}
    </Stack>
  );
}
