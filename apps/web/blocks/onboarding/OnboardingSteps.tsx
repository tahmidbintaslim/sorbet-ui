'use client';
// @block {"name":"Setup steps","description":"Three-step onboarding flow with progress, per-step content and back/next buttons."}
import * as React from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Alert, Button, Card, Checkbox, Progress, Radio, TextField } from '@sorbet-ui/react';

const steps = [
  { title: 'Workspace', description: 'Name your space' },
  { title: 'Team', description: 'Invite people' },
  { title: 'Preferences', description: 'Tune the defaults' },
];

export default function OnboardingSteps() {
  const [step, setStep] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const [workspace, setWorkspace] = React.useState('Acme Studio');
  const [size, setSize] = React.useState('small');
  const last = step === steps.length - 1;
  const percent = finished ? 100 : Math.round((step / steps.length) * 100);

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Card variant="outlined" sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.03em' }}>
            Set up your workspace
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Three quick steps and you are ready to go.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Progress value={percent} aria-label={`Setup progress, ${percent} percent`} />
          </Box>
          <Grid container spacing={1.5} component="ol" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2.5 }}>
              {steps.map((s, i) => {
                const done = finished || i < step;
                const current = !finished && i === step;
                return (
                  <Grid key={s.title} size={{ xs: 12, sm: 4 }} component="li" aria-current={current ? 'step' : undefined}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: 14,
                          bgcolor: done || current ? 'primary.main' : 'transparent',
                          color: done || current ? 'primary.contrastText' : 'text.secondary',
                          border: 1,
                          borderColor: done || current ? 'primary.main' : 'divider',
                        }}
                      >
                        {done ? <CheckIcon fontSize="small" titleAccess="Completed" /> : i + 1}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: current ? 'text.primary' : 'text.secondary' }}>{s.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {s.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                );
              })}
          </Grid>
          <Box sx={{ mt: 4, minHeight: 180 }}>
            {finished ? (
              <Alert color="success">
                {workspace || 'Your workspace'} is ready. We sent invites and saved your preferences.
              </Alert>
            ) : (
              <>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18, mb: 2 }}>
                  Step {step + 1}: {steps[step].title}
                </Typography>
                {step === 0 && (
                  <Stack spacing={2}>
                    <TextField label="Workspace name" value={workspace} onChange={(e) => setWorkspace(e.target.value)} fullWidth />
                    <Box role="radiogroup" aria-label="Team size">
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Team size
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }}>
                        {[
                          ['solo', 'Just me'],
                          ['small', '2 to 10'],
                          ['large', '11 or more'],
                        ].map(([v, l]) => (
                          <Radio key={v} name="team-size" value={v} label={l} checked={size === v} onChange={() => setSize(v)} />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                )}
                {step === 1 && (
                  <Stack spacing={2}>
                    <TextField label="Teammate emails" placeholder="priya@acme.example, jonas@acme.example" fullWidth multiline minRows={2} />
                    <Typography variant="body2" color="text.secondary">
                      Separate addresses with commas. You can always invite more people later.
                    </Typography>
                  </Stack>
                )}
                {step === 2 && (
                  <Stack>
                    <Checkbox label="Send me a weekly summary" defaultChecked />
                    <Checkbox label="Enable dark mode by default" />
                    <Checkbox label="Show keyboard shortcut hints" defaultChecked />
                  </Stack>
                )}
              </>
            )}
          </Box>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              color="neutral"
              disabled={step === 0 && !finished}
              onClick={() => (finished ? (setFinished(false), setStep(0)) : setStep((s) => s - 1))}
            >
              {finished ? 'Start over' : 'Back'}
            </Button>
            {!finished && (
              <Button onClick={() => (last ? setFinished(true) : setStep((s) => s + 1))}>{last ? 'Finish setup' : 'Next'}</Button>
            )}
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
