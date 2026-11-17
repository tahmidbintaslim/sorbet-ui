'use client';
// @example {"title":"Multiline","description":"multiline turns the field into a textarea; minRows and maxRows bound its height."}
import { Box } from '@mui/material';
import { TextField } from '@sorbet-ui/react';

export default function Multiline() {
  return (
    <Box sx={{ width: '100%', maxWidth: 420 }}>
      <TextField label="Release notes" placeholder="What changed in this release?" multiline minRows={3} maxRows={6} fullWidth />
    </Box>
  );
}
