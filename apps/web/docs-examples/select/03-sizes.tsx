'use client';
// @example {"title":"Sizes","description":"Five sizes that match TextField heights."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { MenuItem, Select } from '@sorbet-ui/react';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function Sizes() {
  const [value, setValue] = React.useState('10');
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 260 }}>
      {SIZES.map((size) => (
        <Select key={size} size={size} value={value} onChange={(e) => setValue(String(e.target.value))} aria-label={`Rows per page (${size})`}>
          <MenuItem value="10">10 rows</MenuItem>
          <MenuItem value="25">25 rows</MenuItem>
          <MenuItem value="50">50 rows</MenuItem>
        </Select>
      ))}
    </Stack>
  );
}
