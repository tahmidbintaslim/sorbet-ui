'use client';
// @example {"title":"Variants and sizes","description":"Variants change how the ring is drawn; sizes run from xs to xl."}
import { RadioGroup, Stack } from '@mui/material';
import { Radio } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function VariantsAndSizes() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <RadioGroup row aria-label="Variant" defaultValue="solid" name="radio-variants" sx={{ justifyContent: 'center' }}>
        {VARIANTS.map((variant) => (
          <Radio key={variant} value={variant} variant={variant} label={variant} />
        ))}
      </RadioGroup>
      <RadioGroup row aria-label="Size" defaultValue="md" name="radio-sizes" sx={{ justifyContent: 'center', alignItems: 'center' }}>
        {SIZES.map((size) => (
          <Radio key={size} value={size} size={size} label={size} />
        ))}
      </RadioGroup>
    </Stack>
  );
}
