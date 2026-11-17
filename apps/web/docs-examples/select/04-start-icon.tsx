'use client';
// @example {"title":"With an icon","description":"startIcon puts an icon before the selected value."}
import * as React from 'react';
import { Box } from '@mui/material';
import Public from '@mui/icons-material/Public';
import { MenuItem, Select } from '@sorbet-ui/react';

export default function StartIcon() {
  const [region, setRegion] = React.useState('eu');
  return (
    <Box sx={{ width: '100%', maxWidth: 300 }}>
      <Select label="Region" startIcon={<Public fontSize="small" />} value={region} onChange={(e) => setRegion(String(e.target.value))}>
        <MenuItem value="us">United States</MenuItem>
        <MenuItem value="eu">Europe</MenuItem>
        <MenuItem value="ap">Asia Pacific</MenuItem>
      </Select>
    </Box>
  );
}
