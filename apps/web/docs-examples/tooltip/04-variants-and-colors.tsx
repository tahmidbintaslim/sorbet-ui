'use client';
// @example {"title":"Variants and colors","description":"The bubble follows the shared variants and colors."}
import { Stack } from '@mui/material';
import { Button, Tooltip } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;

export default function VariantsAndColors() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      {VARIANTS.map((variant) => (
        <Tooltip key={variant} title={`A ${variant} tooltip`} variant={variant} color="primary" arrow describeChild>
          <Button variant="outlined" color="neutral" size="sm">
            {variant}
          </Button>
        </Tooltip>
      ))}
    </Stack>
  );
}
