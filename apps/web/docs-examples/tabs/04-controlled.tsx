'use client';
// @example {"title":"Controlled","description":"Hold the selected id in state with value and onChange, and render the panel yourself."}
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Tabs } from '@sorbet-ui/react';

const STEPS = ['draft', 'review', 'published'];

export default function Controlled() {
  const [tab, setTab] = React.useState('draft');
  const next = STEPS[(STEPS.indexOf(tab) + 1) % STEPS.length];
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 460 }}>
      <Tabs
        aria-label="Article status"
        value={tab}
        onChange={setTab}
        renderPanels={false}
        tabs={[
          { id: 'draft', label: 'Draft' },
          { id: 'review', label: 'In review' },
          { id: 'published', label: 'Published' },
        ]}
      />
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Selected tab: {tab}
        </Typography>
        <Button size="sm" variant="soft" onClick={() => setTab(next)}>
          Go to {next}
        </Button>
      </Box>
    </Stack>
  );
}
