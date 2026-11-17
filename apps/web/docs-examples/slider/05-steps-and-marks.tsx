'use client';
// @example {"title":"Steps and marks","description":"step snaps the value; marks (from MUI) draws the stops."}
import { Box } from '@mui/material';
import { Slider } from '@sorbet-ui/react';

const marks = [
  { value: 0, label: '0' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 75, label: '75' },
  { value: 100, label: '100' },
];

export default function StepsAndMarks() {
  return (
    <Box sx={{ width: '100%', maxWidth: 320, pb: 1 }}>
      <Slider aria-label="Quality" defaultValue={50} step={25} marks={marks} color="warning" />
    </Box>
  );
}
