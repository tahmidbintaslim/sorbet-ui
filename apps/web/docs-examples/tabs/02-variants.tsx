'use client';
// @example {"title":"Variants","description":"Five looks for the tab list. Pick one to preview it."}
import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { Tabs, ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function Variants() {
  const [variant, setVariant] = React.useState<(typeof VARIANTS)[number]>('soft');
  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 460, alignItems: 'center' }}>
      <ToggleButtonGroup exclusive size="sm" value={variant} onChange={(_e, next) => next && setVariant(next)} aria-label="Tabs variant">
        {VARIANTS.map((v) => (
          <ToggleButton key={v} value={v}>
            {v}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Box sx={{ width: '100%' }}>
        <Tabs
          variant={variant}
          aria-label={`Project sections (${variant})`}
          renderPanels={false}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'deploys', label: 'Deploys' },
            { id: 'logs', label: 'Logs' },
          ]}
        />
      </Box>
    </Stack>
  );
}
