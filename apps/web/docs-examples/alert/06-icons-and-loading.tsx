'use client';
// @example {"title":"Custom icon, no icon, loading","description":"startIcon replaces the icon, icon={false} hides it, and loading shows a spinner."}
import { Stack } from '@mui/material';
import Rocket from '@mui/icons-material/RocketLaunchOutlined';
import { Alert } from '@sorbet-ui/react';

export default function IconsAndLoading() {
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 480 }}>
      <Alert color="secondary" startIcon={<Rocket fontSize="inherit" />}>
        Version 2 is rolling out this week.
      </Alert>
      <Alert color="neutral" icon={false}>
        A plain note without an icon.
      </Alert>
      <Alert color="info" loading>
        Checking your domain settings.
      </Alert>
    </Stack>
  );
}
