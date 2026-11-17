'use client';
// @example {"title":"Radio group","description":"Wrap radios in MUI's RadioGroup for one value, arrow keys and a group label."}
import * as React from 'react';
import { FormControl, FormLabel, RadioGroup, Typography } from '@mui/material';
import { Radio } from '@sorbet-ui/react';

export default function Group() {
  const [plan, setPlan] = React.useState('team');
  return (
    <FormControl>
      <FormLabel id="plan-label">Plan</FormLabel>
      <RadioGroup aria-labelledby="plan-label" value={plan} onChange={(e) => setPlan(e.target.value)}>
        <Radio value="solo" label="Solo" />
        <Radio value="team" label="Team" />
        <Radio value="business" label="Business" />
      </RadioGroup>
      <Typography variant="body2" color="text.secondary">
        Selected: {plan}
      </Typography>
    </FormControl>
  );
}
