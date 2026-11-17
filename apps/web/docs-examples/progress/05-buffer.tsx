'use client';
// @example {"title":"Buffer","description":"bufferValue shows how much is loaded ahead of what has played."}
import { Box } from '@mui/material';
import { Progress } from '@sorbet-ui/react';

export default function Buffer() {
  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      <Progress value={35} bufferValue={70} color="info" aria-label="Playback, 35 percent played and 70 percent buffered" />
    </Box>
  );
}
