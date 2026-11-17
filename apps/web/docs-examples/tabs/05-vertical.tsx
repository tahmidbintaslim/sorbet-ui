'use client';
// @example {"title":"Vertical","description":"orientation=\"vertical\" puts the list beside the panel; Up and Down move between tabs."}
import { Box } from '@mui/material';
import { Tabs } from '@sorbet-ui/react';

const panel = (text: string) => <Box sx={{ px: 2, py: 1 }}>{text}</Box>;

export default function Vertical() {
  return (
    <Box sx={{ width: '100%', maxWidth: 460 }}>
      <Tabs
        orientation="vertical"
        variant="ghost"
        aria-label="Workspace settings"
        tabs={[
          { id: 'general', label: 'General', content: panel('Workspace name and URL.') },
          { id: 'members', label: 'Members', content: panel('Invite people and set roles.') },
          { id: 'security', label: 'Security', content: panel('Two-factor and sessions.') },
        ]}
      />
    </Box>
  );
}
