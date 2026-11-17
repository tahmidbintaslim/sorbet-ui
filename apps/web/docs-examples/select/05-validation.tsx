'use client';
// @example {"title":"Validation","description":"Set error with a helperText message until a value is chosen."}
import * as React from 'react';
import { Box } from '@mui/material';
import { MenuItem, Select } from '@sorbet-ui/react';

export default function Validation() {
  const [plan, setPlan] = React.useState('');
  return (
    <Box sx={{ width: '100%', maxWidth: 300 }}>
      <Select
        label="Plan"
        value={plan}
        onChange={(e) => setPlan(String(e.target.value))}
        error={plan === ''}
        helperText={plan === '' ? 'Choose a plan to continue.' : 'You can switch plans any time.'}
      >
        <MenuItem value="free">Free</MenuItem>
        <MenuItem value="team">Team</MenuItem>
        <MenuItem value="business">Business</MenuItem>
      </Select>
    </Box>
  );
}
