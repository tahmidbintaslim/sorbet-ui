'use client';
// @example {"title":"Variants","description":"From a loud filled banner to a quiet inline note."}
import { Stack } from '@mui/material';
import { Alert } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 480 }}>
      {VARIANTS.map((variant) => (
        <Alert key={variant} variant={variant} color="primary">
          This is a {variant} alert.
        </Alert>
      ))}
    </Stack>
  );
}
