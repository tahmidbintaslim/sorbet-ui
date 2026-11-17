'use client';
// @example {"title":"Indeterminate","description":"A parent box shows the mixed state while only some children are checked."}
import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { Checkbox } from '@sorbet-ui/react';

const CHANNELS = ['Email', 'Push', 'SMS'];

export default function Indeterminate() {
  const [on, setOn] = React.useState<string[]>(['Email']);
  const all = on.length === CHANNELS.length;
  return (
    <Stack>
      <Checkbox
        label="All notifications"
        checked={all}
        indeterminate={on.length > 0 && !all}
        onChange={() => setOn(all ? [] : CHANNELS)}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', pl: 3 }}>
        {CHANNELS.map((channel) => (
          <Checkbox
            key={channel}
            label={channel}
            checked={on.includes(channel)}
            onChange={(_e, checked) => setOn((list) => (checked ? [...list, channel] : list.filter((c) => c !== channel)))}
          />
        ))}
      </Box>
    </Stack>
  );
}
