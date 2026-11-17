'use client';
// @example {"title":"Disabled and read only","description":"disabled blocks the field; readOnly (from MUI X) keeps it focusable."}
import { Stack } from '@mui/material';
import { DatePicker, dayjs } from '@sorbet-ui/react';

export default function Disabled() {
  return (
    <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
      <DatePicker label="Invoice date" value={dayjs('2026-10-01')} disabled />
      <DatePicker label="Created" value={dayjs('2026-09-14')} readOnly />
    </Stack>
  );
}
