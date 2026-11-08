'use client';
// @block {"name":"Compact list","description":"Horizontal rows of people with avatars, roles and department chips."}
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { Avatar, Button, Chip } from '@sorbet-ui/react';

const PEOPLE = [
  { name: 'Ada Nwosu', role: 'Engineering Manager', dept: 'Engineering', color: 'primary', initials: 'AN' },
  { name: 'Felix Brandt', role: 'Senior Designer', dept: 'Design', color: 'secondary', initials: 'FB' },
  { name: 'Hana Sato', role: 'Support Lead', dept: 'Support', color: 'success', initials: 'HS' },
  { name: 'Omar Haddad', role: 'Account Executive', dept: 'Sales', color: 'warning', initials: 'OH' },
  { name: 'Clara Novak', role: 'Data Analyst', dept: 'Operations', color: 'info', initials: 'CN' },
] as const;

export default function TeamCompact() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, mb: 4 }}
        >
          <Box>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.03em' }}>
              The people behind Acme
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Say hello to the folks you will meet during onboarding.
            </Typography>
          </Box>
          <Button variant="ghost" href="#">
            View open roles
          </Button>
        </Stack>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, borderTop: 1, borderColor: 'divider' }}>
          {PEOPLE.map((p, i) => (
            <Box component="li" key={p.name}>
              {i > 0 && <Divider />}
              <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', py: 2 }}>
                <Avatar variant="soft" color={p.color}>
                  {p.initials}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <Typography component="h3" sx={{ fontWeight: 700 }}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.role}
                  </Typography>
                </Box>
                <Chip size="sm" variant="soft" color={p.color} label={p.dept} />
              </Stack>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
