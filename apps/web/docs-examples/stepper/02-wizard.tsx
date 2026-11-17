'use client';
// @example {"title":"Wizard","description":"Drive activeStep from state to walk through a flow."}
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Button, Stepper } from '@sorbet-ui/react';

const STEPS = [
  { label: 'Account', body: 'Choose a name and password.' },
  { label: 'Workspace', body: 'Name your workspace.' },
  { label: 'Invite', body: 'Invite teammates, or skip for now.', optional: true },
];

export default function Wizard() {
  const [active, setActive] = React.useState(0);
  const done = active === STEPS.length;
  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 520 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Stepper aria-label="Setup wizard" activeStep={active} alternativeLabel steps={STEPS.map(({ label, optional }) => ({ label, optional }))} />
      </Box>
      <Typography role="status" sx={{ textAlign: 'center' }}>
        {done ? 'All set. Your workspace is ready.' : STEPS[active].body}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
        <Button variant="outlined" color="neutral" size="sm" disabled={active === 0} onClick={() => setActive((n) => n - 1)}>
          Back
        </Button>
        {done ? (
          <Button size="sm" variant="soft" onClick={() => setActive(0)}>
            Start over
          </Button>
        ) : (
          <Button size="sm" onClick={() => setActive((n) => n + 1)}>
            {active === STEPS.length - 1 ? 'Finish' : 'Next'}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
