'use client';
// @example {"title":"In a row","description":"RadioGroup's row prop lays the options out side by side."}
import { FormControl, FormLabel, RadioGroup } from '@mui/material';
import { Radio } from '@sorbet-ui/react';

export default function Horizontal() {
  return (
    <FormControl>
      <FormLabel id="billing-label">Billing period</FormLabel>
      <RadioGroup row aria-labelledby="billing-label" defaultValue="monthly" name="billing">
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" />
      </RadioGroup>
    </FormControl>
  );
}
