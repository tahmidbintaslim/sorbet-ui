'use client';
// @block {"name":"Grid","description":"Six team members with initials avatars, roles, short bios and social links."}
import { Box, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import GitHub from '@mui/icons-material/GitHub';
import LinkedIn from '@mui/icons-material/LinkedIn';
import MailOutline from '@mui/icons-material/MailOutline';
import { Avatar, Card } from '@sorbet-ui/react';

const PEOPLE = [
  { name: 'Maya Lindqvist', role: 'Co-founder & CEO', bio: 'Keeps the roadmap honest and the coffee strong.', color: 'primary' },
  { name: 'Theo Okafor', role: 'Co-founder & CTO', bio: 'Builds the sync engine and reviews every migration.', color: 'secondary' },
  { name: 'Priya Raman', role: 'Head of Design', bio: 'Turns rough ideas into calm, usable screens.', color: 'success' },
  { name: 'Jonas Weber', role: 'Staff Engineer', bio: 'Obsessed with fast load times and clear error messages.', color: 'info' },
  { name: 'Lucía Ferrer', role: 'Customer Success', bio: 'Helps new teams get set up in their first week.', color: 'warning' },
  { name: 'Sam Kowalski', role: 'Product Marketing', bio: 'Writes the changelog and talks to customers daily.', color: 'danger' },
] as const;

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
}

export default function TeamGrid() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 620, mx: 'auto', mb: { xs: 5, md: 7 } }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em' }}>
            Meet the team
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 17 }}>
            A small, remote group of builders who care about making work feel lighter.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {PEOPLE.map((p) => (
            <Grid key={p.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Avatar size="xl" variant="soft" color={p.color} sx={{ mx: 'auto' }}>
                  {initials(p.name)}
                </Avatar>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18, mt: 2 }}>
                  {p.name}
                </Typography>
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, mt: 0.5, opacity: 0.85 }}>
                  {p.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  {p.bio}
                </Typography>
                <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 2 }}>
                  <IconButton size="small" href="#" aria-label={`${p.name} on LinkedIn`}>
                    <LinkedIn fontSize="small" />
                  </IconButton>
                  <IconButton size="small" href="#" aria-label={`${p.name} on GitHub`}>
                    <GitHub fontSize="small" />
                  </IconButton>
                  <IconButton size="small" href="#" aria-label={`Email ${p.name}`}>
                    <MailOutline fontSize="small" />
                  </IconButton>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
