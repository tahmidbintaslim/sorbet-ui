'use client';
// @block {"name":"Sign in","description":"Email and password sign-in card with remember me and a GitHub option."}
import * as React from 'react';
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Alert, Button, Card, Checkbox, TextField } from '@sorbet-ui/react';

export default function AuthSignIn() {
  const [signedIn, setSignedIn] = React.useState(false);
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ p: { xs: 3, md: 5 }, maxWidth: 420, mx: 'auto' }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em' }}>
            Sign in to Acme
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Welcome back. Enter your details to continue.
          </Typography>
          {signedIn && (
            <Alert color="success" sx={{ mt: 3 }}>
              Signed in. Redirecting to your workspace.
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              setSignedIn(true);
            }}
          >
            <Stack spacing={2} sx={{ mt: 3 }}>
              <TextField label="Email" type="email" autoComplete="email" required fullWidth variant="soft" />
              <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="soft"
              />
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Checkbox label="Remember me" size="sm" />
              <Link href="#" variant="body2" underline="hover" sx={{ fontWeight: 600 }}>
                Forgot password?
              </Link>
            </Stack>
            <Button type="submit" size="lg" fullWidth sx={{ mt: 2.5 }}>
              Sign in
            </Button>
          </Box>
          <Divider sx={{ my: 3, color: 'text.secondary', fontSize: 14 }}>or</Divider>
          <Button variant="outlined" color="neutral" size="lg" fullWidth startIcon={<GitHubIcon />}>
            Continue with GitHub
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            New to Acme?{' '}
            <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>
              Create an account
            </Link>
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}
