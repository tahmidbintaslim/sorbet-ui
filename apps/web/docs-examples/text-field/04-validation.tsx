'use client';
// @example {"title":"Validation","description":"Set error and put the message in helperText. This one checks the address as you type."}
import * as React from 'react';
import { Box } from '@mui/material';
import { TextField } from '@sorbet-ui/react';

export default function Validation() {
  const [email, setEmail] = React.useState('ada@example');
  const invalid = email !== '' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <Box sx={{ width: '100%', maxWidth: 340 }}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={invalid}
        helperText={invalid ? 'Enter an address like name@example.com.' : 'Looks good.'}
        fullWidth
      />
    </Box>
  );
}
