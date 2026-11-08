'use client';
// @block {"name":"Contact form","description":"Name, email, topic and message fields with inline validation and a success state."}
import * as React from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Alert, Button, Card, MenuItem, Select, TextField } from '@sorbet-ui/react';

const TOPICS = [
  { value: 'sales', label: 'Sales and pricing' },
  { value: 'support', label: 'Technical support' },
  { value: 'billing', label: 'Billing' },
  { value: 'other', label: 'Something else' },
];

type Values = { name: string; email: string; topic: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: '', email: '', topic: '', message: '' };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address.';
  if (!v.topic) e.topic = 'Choose a topic.';
  if (v.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).';
  return e;
}

export default function ContactForm() {
  const [values, setValues] = React.useState<Values>(EMPTY);
  const [errors, setErrors] = React.useState<Errors>({});
  const [sent, setSent] = React.useState(false);

  const set = (key: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      setValues(EMPTY);
    }
  };

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em' }}>
              Get in touch
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 17 }}>
              Questions about plans, a tricky bug or just want to say hi? Send us a note and someone from the Acme team will reply within one business day.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
              {sent ? (
                <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Alert color="success" sx={{ width: '100%' }}>
                    Thanks for reaching out! We will get back to you shortly.
                  </Alert>
                  <Button variant="ghost" onClick={() => setSent(false)}>
                    Send another message
                  </Button>
                </Stack>
              ) : (
                <Box component="form" noValidate onSubmit={onSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Name"
                        required
                        fullWidth
                        variant="soft"
                        autoComplete="name"
                        value={values.name}
                        onChange={(e) => set('name')(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Email"
                        type="email"
                        required
                        fullWidth
                        variant="soft"
                        autoComplete="email"
                        value={values.email}
                        onChange={(e) => set('email')(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Select
                        label="Topic"
                        variant="soft"
                        value={values.topic}
                        onChange={(e) => set('topic')(e.target.value)}
                        error={!!errors.topic}
                        helperText={errors.topic}
                        inputProps={{ 'aria-label': 'Topic' }}
                      >
                        {TOPICS.map((t) => (
                          <MenuItem key={t.value} value={t.value}>
                            {t.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Message"
                        required
                        fullWidth
                        multiline
                        minRows={4}
                        variant="soft"
                        value={values.message}
                        onChange={(e) => set('message')(e.target.value)}
                        error={!!errors.message}
                        helperText={errors.message}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button type="submit" size="lg" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        Send message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
