'use client';
// @example {"title":"Basic","description":"Drag the thumb or use the arrow keys."}
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Slider } from '@sorbet-ui/react';

export default function Basic() {
  const [volume, setVolume] = React.useState(40);
  return (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      <Typography id="volume-label" variant="body2" sx={{ fontWeight: 600 }}>
        Volume: {volume}
      </Typography>
      <Slider aria-labelledby="volume-label" value={volume} onChange={(_e, next) => setVolume(next as number)} />
    </Box>
  );
}
