'use client';
// @example {"title":"Disabled and loading","description":"Disable one option, or show a spinner while its value is being saved."}
import { RadioGroup } from '@mui/material';
import { Radio } from '@sorbet-ui/react';

export default function States() {
  return (
    <RadioGroup aria-label="Region" defaultValue="eu" name="radio-states">
      <Radio value="eu" label="Europe" />
      <Radio value="us" label="United States (unavailable)" disabled />
      <Radio value="ap" label="Asia Pacific (checking capacity)" loading />
    </RadioGroup>
  );
}
