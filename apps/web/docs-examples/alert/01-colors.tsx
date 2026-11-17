'use client';
// @example {"title":"Status colors","description":"Each color brings its own icon: success, info, warning and danger."}
import { Stack } from '@mui/material';
import { Alert } from '@sorbet-ui/react';

export default function Colors() {
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 480 }}>
      <Alert color="success">Your changes were saved.</Alert>
      <Alert color="info">A new version is available.</Alert>
      <Alert color="warning">Your trial ends in three days.</Alert>
      <Alert color="danger">We could not process the payment.</Alert>
    </Stack>
  );
}
