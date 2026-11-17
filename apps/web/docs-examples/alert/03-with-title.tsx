'use client';
// @example {"title":"With a title","description":"Use MUI's AlertTitle for a heading above the message."}
import { AlertTitle, Box } from '@mui/material';
import { Alert } from '@sorbet-ui/react';

export default function WithTitle() {
  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Alert color="warning">
        <AlertTitle>Scheduled maintenance</AlertTitle>
        The dashboard will be read-only on Sunday from 02:00 to 03:00 UTC.
      </Alert>
    </Box>
  );
}
