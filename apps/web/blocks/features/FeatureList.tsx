'use client';
// @block {"name":"Checklist","description":"A checklist of benefits beside a summary card."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { Avatar, Button, Card, Chip } from '@sorbet-ui/react';

const ITEMS = [
  { title: 'Import in minutes', body: 'Bring issues over from spreadsheets or other trackers in one step.' },
  { title: 'Automate the busywork', body: 'Rules move tasks, assign owners and post updates for you.' },
  { title: 'Reports that write themselves', body: 'Weekly summaries land in your inbox every Monday.' },
  { title: 'Works where you work', body: 'Keyboard shortcuts, a command palette and offline drafts.' },
];

const TEAM = [
  { initials: 'SR', name: 'Sam Rivera', role: 'Product lead', color: 'primary' },
  { initials: 'PK', name: 'Priya Kapoor', role: 'Engineer', color: 'secondary' },
  { initials: 'JL', name: 'Jordan Lee', role: 'Designer', color: 'success' },
] as const;

export default function FeatureList() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip label="Why Acme" variant="soft" color="success" />
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em', mt: 2 }}>
              Less admin, more shipping
            </Typography>
            <Stack component="ul" spacing={2.5} sx={{ listStyle: 'none', p: 0, m: 0, mt: 4 }}>
              {ITEMS.map((item) => (
                <Stack component="li" key={item.title} direction="row" spacing={1.5}>
                  <CheckCircle color="success" sx={{ mt: 0.25 }} aria-hidden />
                  <Box>
                    <Typography component="h3" sx={{ fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary">{item.body}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography sx={{ fontWeight: 700 }}>Launch checklist</Typography>
                <Chip size="sm" variant="soft" color="primary" label="3 of 4 done" />
              </Stack>
              <Stack spacing={2} sx={{ mt: 3 }}>
                {TEAM.map((m) => (
                  <Stack key={m.name} direction="row" spacing={1.5} alignItems="center">
                    <Avatar variant="soft" color={m.color}>
                      {m.initials}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }}>{m.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {m.role}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
              <Button variant="soft" shape="block" sx={{ mt: 3 }}>
                Invite teammates
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
