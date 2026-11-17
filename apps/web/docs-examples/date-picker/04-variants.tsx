'use client';
// @example {"title":"Variants","description":"The input follows the shared variants."}
import * as React from 'react';
import { Box } from '@mui/material';
import { DatePicker, dayjs, type Dayjs } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost'] as const;

export default function Variants() {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs('2026-11-03'));
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
      {VARIANTS.map((variant) => (
        <DatePicker key={variant} variant={variant} label={variant} value={date} onChange={setDate} />
      ))}
    </Box>
  );
}
