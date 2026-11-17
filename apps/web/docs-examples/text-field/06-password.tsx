'use client';
// @example {"title":"Password toggle","description":"An icon button in endIcon switches the input type."}
import * as React from 'react';
import { Box, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import { TextField } from '@sorbet-ui/react';

export default function Password() {
  const [show, setShow] = React.useState(false);
  return (
    <Box sx={{ width: '100%', maxWidth: 340 }}>
      <TextField
        label="Password"
        type={show ? 'text' : 'password'}
        defaultValue="mango-sorbet"
        helperText="At least 8 characters."
        fullWidth
        endIcon={
          <IconButton edge="end" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
            {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
          </IconButton>
        }
      />
    </Box>
  );
}
