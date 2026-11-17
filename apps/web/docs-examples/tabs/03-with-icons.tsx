'use client';
// @example {"title":"With icons","description":"Each tab can carry an icon before its label."}
import { Box } from '@mui/material';
import Person from '@mui/icons-material/PersonOutlined';
import CreditCard from '@mui/icons-material/CreditCardOutlined';
import Group from '@mui/icons-material/GroupOutlined';
import { Tabs } from '@sorbet-ui/react';

export default function WithIcons() {
  return (
    <Box sx={{ width: '100%', maxWidth: 460 }}>
      <Tabs
        variant="soft"
        color="secondary"
        aria-label="Account sections with icons"
        renderPanels={false}
        tabs={[
          { id: 'profile', label: 'Profile', icon: <Person fontSize="small" /> },
          { id: 'billing', label: 'Billing', icon: <CreditCard fontSize="small" /> },
          { id: 'team', label: 'Team', icon: <Group fontSize="small" /> },
        ]}
      />
    </Box>
  );
}
