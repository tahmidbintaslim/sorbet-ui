'use client';
// @block {"name":"Sign up","description":"Account creation card with inline validation and a terms checkbox that gates submit."}
import * as React from 'react';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { Alert, Button, Card, Checkbox, TextField } from '@sorbet-ui/react';

type Field = 'name' | 'email' | 'password';

function validate(field: Field, value: string): string {
  if (field === 'name') return value.trim().length < 2 ? 'Enter your full name.' : '';
  if (field === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.';
  return value.length < 8 ? 'Use at least 8 characters.' : '';
}

export default function AuthSignUp() {
  const [values, setValues] = React.useState<Record<Field, string>>({ name: '', email: '', password: '' });
  const [touched, setTouched] = React.useState<Record<Field, boolean>>({ name: false, email: false, password: false });
  const [agreed, setAgreed] = React.useState(false);
  const [done, setDone] = React.useState(false);
  // Demo-only links: say what they would do instead of pointing at '#'.
  const [note, setNote] = React.useState('');

  const errors = {
    name: validate('name', values.name),
    email: validate('email', values.email),
    password: validate('password', values.password),
  };
  const valid = !errors.name && !errors.email && !errors.password;

  const field = (key: Field) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [key]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [key]: true })),
    error: touched[key] && !!errors[key],
    helperText: touched[key] && errors[key] ? errors[key] : ' ',
  });

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ p: { xs: 3, md: 5 }, maxWidth: 420, mx: 'auto' }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em' }}>
            Create your account
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Start a free 14-day Acme trial. No card needed.
          </Typography>
          {done ? (
            <Alert color="success" sx={{ mt: 3 }}>
              Demo only: nothing was sent. In your app, {values.email} would get a confirmation link.
            </Alert>
          ) : (
            <Box
              component="form"
              noValidate
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                setTouched({ name: true, email: true, password: true });
                if (valid && agreed) setDone(true);
              }}
            >
              <Stack spacing={1} sx={{ mt: 3 }}>
                <TextField label="Full name" autoComplete="name" required fullWidth variant="soft" {...field('name')} />
                <TextField label="Work email" type="email" autoComplete="email" required fullWidth variant="soft" {...field('email')} />
                <TextField
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  required
                  fullWidth
                  variant="soft"
                  {...field('password')}
                />
              </Stack>
              <Checkbox
                size="sm"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                label={
                  <span>
                    I agree to the{' '}
                    <Link
                      component="button"
                      type="button"
                      underline="hover"
                      sx={{ verticalAlign: 'baseline' }}
                      onClick={() => setNote('Demo only: link this to your own Terms page.')}
                    >
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link
                      component="button"
                      type="button"
                      underline="hover"
                      sx={{ verticalAlign: 'baseline' }}
                      onClick={() => setNote('Demo only: link this to your own Privacy Policy page.')}
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
              />
              <Button type="submit" size="lg" fullWidth disabled={!agreed} sx={{ mt: 2 }}>
                Create account
              </Button>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link
              component="button"
              type="button"
              underline="hover"
              sx={{ fontWeight: 600, verticalAlign: 'baseline' }}
              onClick={() => setNote('Demo only: in your app, link this to your sign-in page.')}
            >
              Sign in
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" role="status" sx={{ mt: 2, textAlign: 'center', minHeight: '1.5em' }}>
            {note}
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}
