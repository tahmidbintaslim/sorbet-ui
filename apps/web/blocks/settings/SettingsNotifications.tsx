'use client';
// @block {"name":"Notification settings","description":"Grouped notification switches with descriptions and a digest frequency select."}
import * as React from 'react';
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { Button, Card, MenuItem, Select, Switch } from '@sorbet-ui/react';

const groups = [
  {
    title: 'Activity',
    items: [
      { id: 'mentions', label: 'Mentions', description: 'When someone @mentions you in a comment or doc.', on: true },
      { id: 'assign', label: 'Assignments', description: 'When a task or review is assigned to you.', on: true },
      { id: 'comments', label: 'Comments on your work', description: 'Replies to threads you started.', on: false },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'security', label: 'Security alerts', description: 'New sign-ins and password changes. Recommended.', on: true },
      { id: 'billing', label: 'Billing', description: 'Invoices, receipts and failed payments.', on: true },
      { id: 'product', label: 'Product updates', description: 'New Acme features, about once a month.', on: false },
    ],
  },
];

export default function SettingsNotifications() {
  const [state, setState] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.flatMap((g) => g.items.map((i) => [i.id, i.on]))),
  );
  const [digest, setDigest] = React.useState('daily');

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Card variant="outlined" sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
            Notifications
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Choose what Acme emails you about.
          </Typography>
          {groups.map((g) => (
            <Box key={g.title} sx={{ mt: 4 }}>
              <Typography component="h3" variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                {g.title}
              </Typography>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mt: 1 }}>
                {g.items.map((item, i) => (
                  <Box key={item.id}>
                    {i > 0 && <Divider />}
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography id={`notif-${item.id}`} sx={{ fontWeight: 600 }}>
                          {item.label}
                        </Typography>
                        <Typography id={`notif-${item.id}-desc`} variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                      <Switch
                        checked={state[item.id]}
                        onChange={(e) => setState((s) => ({ ...s, [item.id]: e.target.checked }))}
                        slotProps={{
                          input: {
                            'aria-labelledby': `notif-${item.id}`,
                            'aria-describedby': `notif-${item.id}-desc`,
                          } as React.InputHTMLAttributes<HTMLInputElement>,
                        }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
          <Box sx={{ mt: 4 }}>
            <Typography component="h3" variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              Email digest
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                A summary of everything you missed, bundled into one email.
              </Typography>
              <Box sx={{ width: { xs: '100%', sm: 220 } }}>
                <Select
                  label="Digest frequency"
                  value={digest}
                  onChange={(e) => setDigest(String(e.target.value))}
                  SelectDisplayProps={{ 'aria-label': 'Digest frequency' }}
                >
                  <MenuItem value="realtime">As it happens</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="never">Never</MenuItem>
                </Select>
              </Box>
            </Stack>
          </Box>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button>Save preferences</Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
