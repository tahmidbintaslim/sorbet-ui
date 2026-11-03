'use client';
import * as React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Alert, Button, Card, Checkbox, TextField } from '@sorbet-ui/react';

export default function CtaNewsletter() {
  const [sent, setSent] = React.useState(false);
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em' }}>
            Get the monthly changelog
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            One email a month. Unsubscribe any time.
          </Typography>
          {sent ? (
            <Alert color="success" sx={{ mt: 3, textAlign: 'left' }}>
              Thanks! Check your inbox to confirm.
            </Alert>
          ) : (
            <Box
              component="form"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                <TextField label="Email" type="email" required variant="soft" sx={{ flex: 1 }} />
                <Button type="submit" size="lg">
                  Subscribe
                </Button>
              </Stack>
              <Checkbox label="Also send product launch emails" sx={{ mt: 1 }} />
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
}
