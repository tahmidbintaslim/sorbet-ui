'use client';
// @example {"title":"Sizes and delay","description":"size changes the type and padding; enterDelay (from MUI) waits before showing."}
import { Stack } from '@mui/material';
import { Button, Tooltip } from '@sorbet-ui/react';

export default function SizesAndDelay() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      <Tooltip title="Small hint" size="xs" describeChild>
        <Button variant="soft" size="sm">
          xs
        </Button>
      </Tooltip>
      <Tooltip title="A larger hint with more room to read" size="lg" describeChild>
        <Button variant="soft" size="sm">
          lg
        </Button>
      </Tooltip>
      <Tooltip title="Shown after half a second" enterDelay={500} describeChild>
        <Button variant="soft" size="sm" color="secondary">
          Delayed
        </Button>
      </Tooltip>
    </Stack>
  );
}
