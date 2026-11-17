'use client';
// @example {"title":"Basic","description":"Pass tabs as data: an id, a label and the panel content. Arrow keys move between tabs."}
import { Box } from '@mui/material';
import { Tabs } from '@sorbet-ui/react';

const panel = (text: string) => <Box sx={{ p: 2 }}>{text}</Box>;

export default function Basic() {
  return (
    <Box sx={{ width: '100%', maxWidth: 460 }}>
      <Tabs
        aria-label="Account settings"
        tabs={[
          { id: 'profile', label: 'Profile', content: panel('Your name, photo and bio.') },
          { id: 'billing', label: 'Billing', content: panel('Plan, invoices and payment method.') },
          { id: 'team', label: 'Team', content: panel('Members and their roles.') },
        ]}
      />
    </Box>
  );
}
