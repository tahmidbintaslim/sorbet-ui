'use client';
// @example {"title":"Variants and sizes","description":"Variants restyle the track; sizes run from xs to xl."}
import { Stack } from '@mui/material';
import { Switch } from '@sorbet-ui/react';

const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function VariantsAndSizes() {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', columnGap: 2 }}>
        {VARIANTS.map((variant) => (
          <Switch key={variant} variant={variant} label={variant} defaultChecked />
        ))}
      </Stack>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: 2 }}>
        {SIZES.map((size) => (
          <Switch key={size} size={size} label={size} defaultChecked />
        ))}
      </Stack>
    </Stack>
  );
}
