'use client';
// @example {"title":"Icons","description":"startIcon and endIcon sit inside the field."}
import { Stack } from '@mui/material';
import Search from '@mui/icons-material/Search';
import Mail from '@mui/icons-material/MailOutlined';
import Check from '@mui/icons-material/CheckCircleOutlined';
import { TextField } from '@sorbet-ui/react';

export default function Adornments() {
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 340 }}>
      <TextField aria-label="Search projects" placeholder="Search projects" startIcon={<Search fontSize="small" />} fullWidth />
      <TextField label="Email" defaultValue="ada@example.com" startIcon={<Mail fontSize="small" />} endIcon={<Check fontSize="small" color="success" />} fullWidth />
    </Stack>
  );
}
