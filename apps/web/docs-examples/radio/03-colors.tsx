'use client';
// @example {"title":"Colors","description":"Seven colors for the selected dot."}
import { RadioGroup } from '@mui/material';
import { Radio } from '@sorbet-ui/react';

const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

export default function Colors() {
  return (
    <RadioGroup row aria-label="Color" defaultValue="primary" name="radio-colors" sx={{ justifyContent: 'center' }}>
      {COLORS.map((color) => (
        <Radio key={color} value={color} color={color} label={color} />
      ))}
    </RadioGroup>
  );
}
