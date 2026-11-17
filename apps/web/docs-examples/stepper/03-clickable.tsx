'use client';
// @example {"title":"Clickable steps","description":"onStepClick makes each step a button, so people can jump back and forth."}
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Stepper } from '@sorbet-ui/react';

const LABELS = ['Details', 'Review', 'Publish'];

export default function Clickable() {
  const [active, setActive] = React.useState(1);
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 520 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Stepper aria-label="Publishing steps" nonLinear activeStep={active} onStepClick={setActive} color="secondary" steps={LABELS.map((label) => ({ label }))} />
      </Box>
      <Typography variant="body2" color="text.secondary" role="status" sx={{ textAlign: 'center' }}>
        Current step: {LABELS[active]}
      </Typography>
    </Stack>
  );
}
