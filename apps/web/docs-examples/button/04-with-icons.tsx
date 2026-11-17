'use client';
// @example {"title":"With icons","description":"Put an icon before or after the label with startIcon and endIcon."}
import { Stack } from '@mui/material';
import Add from '@mui/icons-material/Add';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Download from '@mui/icons-material/DownloadOutlined';
import { Button } from '@sorbet-ui/react';

export default function WithIcons() {
  return (
    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button startIcon={<Add />}>New project</Button>
      <Button variant="soft" endIcon={<ArrowForward />}>
        Continue
      </Button>
      <Button variant="outlined" color="neutral" startIcon={<Download />}>
        Export
      </Button>
    </Stack>
  );
}
