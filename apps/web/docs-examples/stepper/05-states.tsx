'use client';
// @example {"title":"Optional, error and disabled","description":"Steps can be optional, report an error or be disabled."}
import { Box } from '@mui/material';
import { Stepper } from '@sorbet-ui/react';

export default function States() {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Stepper
        aria-label="Import progress"
        activeStep={1}
        alternativeLabel
        steps={[
          { label: 'Upload file' },
          { label: 'Map columns', error: true, description: 'Two columns need a match' },
          { label: 'Add tags', optional: true },
          { label: 'Import', disabled: true },
        ]}
      />
    </Box>
  );
}
