'use client';
// @example {"title":"Full width, centered, disabled","description":"fullWidth shares the row equally, centered centers the list, and a tab can be disabled."}
import { Stack } from '@mui/material';
import { Tabs } from '@sorbet-ui/react';

export default function FullWidthAndDisabled() {
  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 460 }}>
      <Tabs
        fullWidth
        variant="solid"
        aria-label="Billing period"
        renderPanels={false}
        tabs={[
          { id: 'monthly', label: 'Monthly' },
          { id: 'yearly', label: 'Yearly' },
        ]}
      />
      <Tabs
        centered
        aria-label="Plan features"
        renderPanels={false}
        tabs={[
          { id: 'usage', label: 'Usage' },
          { id: 'limits', label: 'Limits' },
          { id: 'audit', label: 'Audit log', disabled: true },
        ]}
      />
    </Stack>
  );
}
