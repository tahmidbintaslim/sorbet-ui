'use client';
// @example {"title":"Colors","description":"Seven colors, useful for status."}
import { Stack } from '@mui/material';
import { Chip } from '@sorbet-ui/react';

const STATUS = [
  { color: 'success', label: 'Paid' },
  { color: 'warning', label: 'Pending' },
  { color: 'danger', label: 'Failed' },
  { color: 'info', label: 'Refunded' },
  { color: 'neutral', label: 'Draft' },
  { color: 'primary', label: 'New' },
  { color: 'secondary', label: 'Beta' },
] as const;

export default function Colors() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      {STATUS.map((s) => (
        <Chip key={s.label} variant="soft" color={s.color} label={s.label} />
      ))}
    </Stack>
  );
}
