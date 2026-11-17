'use client';
// @example {"title":"Sizes and colors","description":"size changes the input height; color tints the focus ring and the selected day."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { DatePicker, dayjs, type Dayjs } from '@sorbet-ui/react';

export default function SizesAndColors() {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs('2026-11-03'));
  return (
    <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
      <DatePicker size="sm" color="success" label="Small, success" value={date} onChange={setDate} />
      <DatePicker size="md" color="secondary" label="Medium, secondary" value={date} onChange={setDate} />
      <DatePicker size="lg" color="danger" label="Large, danger" value={date} onChange={setDate} />
    </Stack>
  );
}
