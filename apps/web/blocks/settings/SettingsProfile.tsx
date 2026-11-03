'use client';
// @block {"name":"Profile settings","description":"Avatar, name, email and bio fields with save and cancel."}
import * as React from 'react';
import { Box, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { Alert, Avatar, Button, Card, TextField } from '@sorbet-ui/react';

const saved = {
  first: 'Maya',
  last: 'Chen',
  email: 'maya.chen@acme.example',
  bio: 'Product designer at Acme. I care about calm interfaces and good coffee.',
};

export default function SettingsProfile() {
  const [values, setValues] = React.useState(saved);
  const [base, setBase] = React.useState(saved);
  const [status, setStatus] = React.useState<'idle' | 'saved'>('idle');
  const dirty = JSON.stringify(values) !== JSON.stringify(base);

  const bind = (key: keyof typeof saved) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setStatus('idle');
    },
  });

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Card variant="outlined" sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
            Profile
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            This information is visible to everyone in your Acme workspace.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Box
            component="form"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              setBase(values);
              setStatus('saved');
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Avatar size="xl" color="primary" variant="soft">
                {(values.first[0] ?? '') + (values.last[0] ?? '')}
              </Avatar>
              <Box>
                <Typography component="h3" sx={{ fontWeight: 700 }}>
                  Profile photo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PNG or JPG, at least 256 × 256 px.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="sm" variant="outlined" color="neutral">
                    Upload
                  </Button>
                  <Button size="sm" variant="plain" color="danger">
                    Remove
                  </Button>
                </Stack>
              </Box>
            </Stack>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="First name" autoComplete="given-name" fullWidth required {...bind('first')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Last name" autoComplete="family-name" fullWidth required {...bind('last')} />
              </Grid>
              <Grid size={12}>
                <TextField label="Email" type="email" autoComplete="email" fullWidth required {...bind('email')} />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Bio"
                  fullWidth
                  multiline
                  minRows={3}
                  helperText={`${values.bio.length}/200 characters`}
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                  {...bind('bio')}
                />
              </Grid>
            </Grid>
            {status === 'saved' && (
              <Alert color="success" sx={{ mt: 3 }}>
                Profile updated.
              </Alert>
            )}
            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="neutral"
                disabled={!dirty}
                onClick={() => {
                  setValues(base);
                  setStatus('idle');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!dirty}>
                Save changes
              </Button>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
