'use client';
// @example {"title":"Variants","description":"The same five variants as TextField, so forms stay consistent."}
import * as React from 'react';
import { Box } from '@mui/material';
import { MenuItem, Select } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  const [role, setRole] = React.useState('editor');
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, width: '100%', maxWidth: 560 }}>
      {VARIANTS.map((variant) => (
        <Select key={variant} variant={variant} label={variant} value={role} onChange={(e) => setRole(String(e.target.value))}>
          <MenuItem value="viewer">Viewer</MenuItem>
          <MenuItem value="editor">Editor</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      ))}
    </Box>
  );
}
