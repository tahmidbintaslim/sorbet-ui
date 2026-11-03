'use client';
// @block {"name":"Bento","description":"Asymmetric grid of feature cards with small live previews."}
import type { ReactNode } from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Bolt from '@mui/icons-material/Bolt';
import Lock from '@mui/icons-material/Lock';
import Insights from '@mui/icons-material/Insights';
import Groups from '@mui/icons-material/Groups';
import { Avatar, Card, Chip, Progress } from '@sorbet-ui/react';

const TEAM = [
  { initials: 'SR', color: 'primary' },
  { initials: 'PK', color: 'secondary' },
  { initials: 'JL', color: 'success' },
  { initials: 'AM', color: 'warning' },
] as const;

const USAGE = [
  { label: 'Search', value: 82 },
  { label: 'Exports', value: 54 },
  { label: 'Automations', value: 31 },
];

function CardTitle({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <>
      <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
      <Typography component="h3" sx={{ fontWeight: 700, fontSize: 20, mt: 1.5 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.75 }}>
        {body}
      </Typography>
    </>
  );
}

export default function FeatureBento() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 620, mb: 6 }}>
          <Chip label="Platform" variant="soft" color="secondary" />
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em', mt: 2 }}>
            One workspace, every tool your team needs
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
              <CardTitle
                icon={<Insights />}
                title="Usage insights"
                body="See which features your customers rely on, and which ones nobody opens."
              />
              <Stack spacing={1.5} sx={{ mt: 3, maxWidth: 460 }}>
                {USAGE.map((u) => (
                  <Box key={u.label}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {u.label}
                    </Typography>
                    <Progress value={u.value} showLabel aria-label={`${u.label} adoption`} />
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="soft" color="warning" sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
              <CardTitle icon={<Bolt />} title="Instant search" body="Results appear as you type, across every project and doc." />
              <Typography sx={{ fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em', mt: 3 }}>40 ms</Typography>
              <Typography variant="body2" color="text.secondary">
                Typical sample query time
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
              <CardTitle icon={<Lock />} title="Secure by default" body="SSO, audit logs and fine-grained roles on every plan." />
              <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} sx={{ mt: 3 }}>
                <Chip size="sm" variant="soft" color="success" label="SSO" />
                <Chip size="sm" variant="soft" color="success" label="Audit log" />
                <Chip size="sm" variant="soft" color="success" label="Roles" />
              </Stack>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-between">
                <Box sx={{ maxWidth: 380 }}>
                  <CardTitle
                    icon={<Groups />}
                    title="Built for teams"
                    body="Comments, mentions and shared views keep everyone on the same page."
                  />
                </Box>
                <Stack direction="row" spacing={-1} alignItems="center">
                  {TEAM.map((a) => (
                    <Avatar key={a.initials} color={a.color} variant="solid" sx={{ border: 2, borderColor: 'background.paper' }}>
                      {a.initials}
                    </Avatar>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
