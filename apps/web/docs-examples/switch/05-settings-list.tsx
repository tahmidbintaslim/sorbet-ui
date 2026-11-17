'use client';
// @example {"title":"Settings list","description":"For a label on the left, name the switch with aria-labelledby instead of label."}
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Switch } from '@sorbet-ui/react';

const SETTINGS = [
  { id: 'deploys', title: 'Deploy previews', hint: 'Build a preview for every pull request.' },
  { id: 'comments', title: 'Comments', hint: 'Let teammates comment on previews.' },
  { id: 'analytics', title: 'Analytics', hint: 'Collect anonymous page views.' },
];

export default function SettingsList() {
  const [on, setOn] = React.useState<Record<string, boolean>>({ deploys: true, comments: false, analytics: true });
  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 420 }}>
      {SETTINGS.map((s) => (
        <Stack key={s.id} direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography id={`setting-${s.id}`} sx={{ fontWeight: 600 }}>
              {s.title}
            </Typography>
            <Typography id={`setting-${s.id}-hint`} variant="body2" color="text.secondary">
              {s.hint}
            </Typography>
          </Box>
          <Switch
            aria-labelledby={`setting-${s.id}`}
            aria-describedby={`setting-${s.id}-hint`}
            checked={on[s.id]}
            onChange={(_e, checked) => setOn((state) => ({ ...state, [s.id]: checked }))}
          />
        </Stack>
      ))}
    </Stack>
  );
}
