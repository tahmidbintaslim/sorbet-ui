'use client';
// @block {"name":"Minimal","description":"Announcement alert, a single headline and an email capture form."}
import * as React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Alert, Button, TextField } from '@sorbet-ui/react';

export default function HeroMinimal() {
  const [joined, setJoined] = React.useState(false);
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 680, mx: 'auto', textAlign: 'center' }}>
          <Alert variant="soft" color="info" size="sm" sx={{ display: 'inline-flex', textAlign: 'left' }}>
            Acme 3.1 is out: faster search and offline drafts.
          </Alert>
          <Typography
            component="h2"
            sx={{ fontWeight: 800, fontSize: { xs: 36, md: 56 }, letterSpacing: '-0.04em', lineHeight: 1.05, mt: 4 }}
          >
            The calm way to run your team
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18, mt: 2 }}>
            Join the waitlist and we will email you when your workspace is ready.
          </Typography>
          {joined ? (
            <Alert color="success" sx={{ mt: 4, textAlign: 'left' }}>
              You are on the list. We will be in touch soon.
            </Alert>
          ) : (
            <Box
              component="form"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                setJoined(true);
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4, maxWidth: 520, mx: 'auto' }}>
                <TextField label="Work email" type="email" required variant="soft" sx={{ flex: 1 }} />
                <Button type="submit" size="lg">
                  Join waitlist
                </Button>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                No spam. Unsubscribe any time.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
