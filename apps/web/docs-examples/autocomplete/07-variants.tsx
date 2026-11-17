'use client';
// @example {"title":"Variants and sizes","description":"The field follows the shared variant and size props."}
import { Box } from '@mui/material';
import { Autocomplete } from '@sorbet-ui/react';

const options = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 },
];

export default function Variants() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, width: '100%', maxWidth: 560 }}>
      <Autocomplete options={options} variant="soft" label="Soft" fullWidth />
      <Autocomplete options={options} variant="solid" label="Solid" fullWidth />
      <Autocomplete options={options} size="sm" label="Small" fullWidth />
      <Autocomplete options={options} size="lg" label="Large" fullWidth />
    </Box>
  );
}
