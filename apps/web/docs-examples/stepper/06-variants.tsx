'use client';
// @example {"title":"Variants","description":"Five looks for the step indicators."}
import { Box, Stack, Typography } from '@mui/material';
import { Stepper } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
const steps = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }];

export default function Variants() {
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 520 }}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ width: 64, flexShrink: 0 }}>
            {variant}
          </Typography>
          <Box sx={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
            <Stepper variant={variant} aria-label={`Steps (${variant})`} activeStep={1} steps={steps} />
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
