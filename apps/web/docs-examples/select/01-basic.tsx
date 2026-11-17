'use client';
// @example {"title":"Label and helper text","description":"Pass MenuItem children. The label is linked to the combobox for screen readers."}
import * as React from 'react';
import { Box } from '@mui/material';
import { MenuItem, Select } from '@sorbet-ui/react';

export default function Basic() {
  const [flavor, setFlavor] = React.useState('mango');
  return (
    <Box sx={{ width: '100%', maxWidth: 300 }}>
      <Select label="Flavor" value={flavor} onChange={(e) => setFlavor(String(e.target.value))} helperText="You can change it later.">
        <MenuItem value="mango">Mango</MenuItem>
        <MenuItem value="raspberry">Raspberry</MenuItem>
        <MenuItem value="mint">Mint</MenuItem>
        <MenuItem value="lemon">Lemon</MenuItem>
      </Select>
    </Box>
  );
}
