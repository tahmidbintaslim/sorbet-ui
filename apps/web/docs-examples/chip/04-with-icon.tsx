'use client';
// @example {"title":"With an icon","description":"icon puts an icon before the label."}
import { Stack } from '@mui/material';
import Check from '@mui/icons-material/CheckCircleOutlined';
import Schedule from '@mui/icons-material/ScheduleOutlined';
import Bolt from '@mui/icons-material/BoltOutlined';
import { Chip } from '@sorbet-ui/react';

export default function WithIcon() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      <Chip variant="soft" color="success" icon={<Check />} label="Deployed" />
      <Chip variant="soft" color="warning" icon={<Schedule />} label="Queued" />
      <Chip variant="outlined" color="secondary" icon={<Bolt />} label="Fast build" />
    </Stack>
  );
}
