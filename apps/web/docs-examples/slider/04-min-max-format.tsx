'use client';
// @example {"title":"Min, max and format","description":"showMinMax prints the bounds; formatValue formats every label."}
import { Box } from '@mui/material';
import { Slider } from '@sorbet-ui/react';

export default function MinMaxFormat() {
  return (
    <Box sx={{ width: '100%', maxWidth: 320, pt: 3 }}>
      <Slider
        aria-label="Monthly budget"
        min={100}
        max={1000}
        step={50}
        defaultValue={400}
        showValue
        showMinMax
        formatValue={(value) => `$${value}`}
        color="info"
      />
    </Box>
  );
}
