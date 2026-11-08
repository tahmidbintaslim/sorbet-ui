'use client';
// @block {"name":"Activity feed","description":"Recent team activity with avatars, actions and relative timestamps."}
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import { Avatar, Card, Chip } from '@sorbet-ui/react';

type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'info';

const events: { who: string; initials: string; color: Color; action: string; target: string; time: string; iso: string; tag?: string }[] = [
  { who: 'Maya Chen', initials: 'MC', color: 'primary', action: 'merged', target: 'Checkout redesign', time: '4 min ago', iso: '2026-11-03T09:56', tag: 'Release' },
  { who: 'Liam Ortiz', initials: 'LO', color: 'success', action: 'closed', target: 'Invoice PDF misaligned', time: '32 min ago', iso: '2026-11-03T09:28' },
  { who: 'Priya Nair', initials: 'PN', color: 'secondary', action: 'commented on', target: 'Q4 roadmap', time: '1 hour ago', iso: '2026-11-03T09:00' },
  { who: 'Jonas Berg', initials: 'JB', color: 'warning', action: 'invited', target: 'Amara Okafor to Acme Billing', time: '3 hours ago', iso: '2026-11-03T07:00', tag: 'Team' },
  { who: 'Sofia Rossi', initials: 'SR', color: 'info', action: 'published', target: 'Holiday pricing page', time: 'Yesterday', iso: '2026-11-02T16:10' },
];

export default function DashboardActivity() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
              Activity
            </Typography>
            <Link href="#" variant="body2" underline="hover" sx={{ fontWeight: 600 }}>
              View all
            </Link>
          </Stack>
          <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2 }}>
            {events.map((e, i) => (
              <Box component="li" key={e.iso}>
                {i > 0 && <Divider />}
                <Stack direction="row" spacing={1.5} sx={{ py: 1.75 }}>
                  <Avatar size="sm" color={e.color} variant="soft">
                    {e.initials}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        {e.who}
                      </Box>{' '}
                      <Box component="span" sx={{ color: 'text.secondary' }}>
                        {e.action}
                      </Box>{' '}
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {e.target}
                      </Box>
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                      <Typography component="time" dateTime={e.iso} variant="caption" color="text.secondary">
                        {e.time}
                      </Typography>
                      {e.tag && <Chip size="xs" variant="outlined" color="neutral" label={e.tag} />}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
