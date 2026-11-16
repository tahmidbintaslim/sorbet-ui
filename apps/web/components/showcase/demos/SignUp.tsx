'use client';
// Sign-up form: inline errors on submit (and as you fix them), then a success state.
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Alert, Button, Checkbox, TextField } from '@sorbet-ui/react';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [news, setNews] = React.useState(true);
  const [tried, setTried] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const doneRef = React.useRef<HTMLDivElement>(null);

  const errors = {
    name: name.trim() ? '' : 'Tell us your name.',
    email: !email.trim() ? 'Add your email.' : EMAIL.test(email.trim()) ? '' : 'That email looks off. Try name@example.com.',
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (errors.name) nameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else setDone(true);
  };
  React.useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  if (done)
    return (
      <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2.5 }}>
        <Box ref={doneRef} tabIndex={-1} sx={{ width: '100%', maxWidth: 320, display: 'grid', gap: 2, outline: 'none' }}>
          <Alert color="success" variant="soft">
            You&apos;re on the list, {name.trim().split(' ')[0]}. {news ? 'First flavor drops Friday.' : 'No emails, as promised.'}
          </Alert>
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            onClick={() => {
              setDone(false);
              setTried(false);
              setName('');
              setEmail('');
            }}
            sx={{ justifySelf: 'start', '@media (pointer: coarse)': { minHeight: 44 } }}
          >
            Start over
          </Button>
        </Box>
      </Box>
    );

  return (
    <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
      <Box
        component="form"
        noValidate
        onSubmit={submit}
        aria-label="Join the flavor club"
        sx={(t) => ({ width: '100%', maxWidth: 320, display: 'grid', gap: 1.5, p: 2, borderRadius: 4, bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}`, boxShadow: '0 1px 2px rgb(15 23 42 / 0.05), 0 18px 36px -18px rgb(15 23 42 / 0.25)' })}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Join the flavor club</Typography>
        <TextField
          label="Name"
          size="sm"
          fullWidth
          required
          autoComplete="off"
          inputRef={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={tried && !!errors.name}
          helperText={tried && errors.name ? errors.name : undefined}
        />
        <TextField
          label="Email"
          type="email"
          size="sm"
          fullWidth
          required
          autoComplete="off"
          inputRef={emailRef}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={tried && !!errors.email}
          helperText={tried && errors.email ? errors.email : undefined}
        />
        <Checkbox size="sm" label="Send me the flavor of the week" checked={news} onChange={(e) => setNews(e.target.checked)} />
        <Button type="submit" variant="solid" color="primary" size="md" shape="block">
          Sign up
        </Button>
      </Box>
    </Box>
  );
}
