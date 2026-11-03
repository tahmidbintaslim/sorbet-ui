'use client';
// @block {"name":"Password reset","description":"Request a reset link by email, then show a success state."}
import * as React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { Alert, Button, Card, TextField } from '@sorbet-ui/react';

export default function AuthReset() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ p: { xs: 3, md: 5 }, maxWidth: 420, mx: 'auto' }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em' }}>
            Reset your password
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Enter the email on your Acme account and we will send you a reset link.
          </Typography>
          {sent ? (
            <>
              <Alert color="success" sx={{ mt: 3 }}>
                If an account exists for {email}, a reset link is on its way. It expires in 30 minutes.
              </Alert>
              <Button variant="soft" color="neutral" fullWidth sx={{ mt: 2 }} onClick={() => setSent(false)}>
                Use a different email
              </Button>
            </>
          ) : (
            <Box
              component="form"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                required
                fullWidth
                variant="soft"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mt: 3 }}
              />
              <Button type="submit" size="lg" fullWidth sx={{ mt: 2.5 }}>
                Send reset link
              </Button>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Remembered it?{' '}
            <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>
              Back to sign in
            </Link>
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}
