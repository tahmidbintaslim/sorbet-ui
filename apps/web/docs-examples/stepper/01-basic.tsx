'use client';
// @example {"title":"Basic","description":"Pass steps as data and the index of the current one. Earlier steps show as completed."}
import { Box } from '@mui/material';
import { Stepper } from '@sorbet-ui/react';

export default function Basic() {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Stepper
        aria-label="Checkout progress"
        activeStep={1}
        alternativeLabel
        steps={[{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }, { label: 'Done' }]}
      />
    </Box>
  );
}
