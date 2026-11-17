'use client';
// @example {"title":"Basic","description":"Type to filter. Options are objects with a label and a value."}
import { Box } from '@mui/material';
import { Autocomplete } from '@sorbet-ui/react';

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Apricot', value: 'apricot' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Mango', value: 'mango' },
  { label: 'Raspberry', value: 'raspberry' },
];

export default function Basic() {
  return (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      <Autocomplete options={fruits} label="Fruit" placeholder="Search fruit" fullWidth />
    </Box>
  );
}
