'use client';
// @block {"name":"App shell","description":"Sidebar navigation, top bar with search and avatar, and a content area that stacks on mobile."}
import * as React from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ReceiptIcon from '@mui/icons-material/ReceiptLongOutlined';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import InsightsIcon from '@mui/icons-material/InsightsOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Button, Card, Progress, TextField } from '@sorbet-ui/react';

const nav = [
  { id: 'overview', label: 'Overview', icon: <DashboardIcon fontSize="small" /> },
  { id: 'orders', label: 'Orders', icon: <ReceiptIcon fontSize="small" /> },
  { id: 'customers', label: 'Customers', icon: <PeopleIcon fontSize="small" /> },
  { id: 'reports', label: 'Reports', icon: <InsightsIcon fontSize="small" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
];

const goals = [
  { label: 'Monthly revenue', value: 72 },
  { label: 'Support tickets resolved', value: 91 },
  { label: 'Onboarding completed', value: 48 },
];

export default function DashboardShell() {
  const [active, setActive] = React.useState('overview');
  const current = nav.find((n) => n.id === active)!;
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Card variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: { md: 520 } }}>
            <Box
              sx={{
                width: { xs: '100%', md: 220 },
                flexShrink: 0,
                borderRight: { md: 1 },
                borderBottom: { xs: 1, md: 0 },
                borderColor: 'divider',
                p: 2,
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: 18, px: 1, mb: 2 }}>Acme</Typography>
              <Box component="nav" aria-label="Dashboard shell navigation">
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    m: 0,
                    p: 0,
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'column' },
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    gap: 0.5,
                  }}
                >
                  {nav.map((n) => (
                    <li key={n.id}>
                      <Button
                        href="#"
                        variant={active === n.id ? 'soft' : 'plain'}
                        color={active === n.id ? 'primary' : 'neutral'}
                        size="sm"
                        startIcon={n.icon}
                        aria-current={active === n.id ? 'page' : undefined}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          setActive(n.id);
                        }}
                        sx={{ justifyContent: 'flex-start', width: { md: '100%' } }}
                      >
                        {n.label}
                      </Button>
                    </li>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ px: { xs: 2, md: 3 }, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
              >
                <TextField
                  label="Search"
                  size="sm"
                  variant="soft"
                  startIcon={<SearchIcon fontSize="small" />}
                  sx={{ flex: 1, maxWidth: 360 }}
                />
                <Box sx={{ flex: { xs: 0, sm: 1 } }} />
                <Avatar size="sm" status="online" role="img" aria-label="Signed in as Maya Chen">
                  MC
                </Avatar>
              </Stack>
              <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
                <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, letterSpacing: '-0.03em' }}>
                  {current.label}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Good morning, Maya. Here is where Acme stands today.
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {[
                    ['Open orders', '38'],
                    ['Revenue today', '$3,920'],
                    ['Active users', '1,128'],
                  ].map(([label, value]) => (
                    <Grid key={label} size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                        <Typography component="h3" variant="body2" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: 24, mt: 0.5 }}>{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2, mt: 2 }}>
                  <Typography component="h3" sx={{ fontWeight: 700 }}>
                    Q4 goals
                  </Typography>
                  {goals.map((g) => (
                    <Box key={g.label} sx={{ mt: 2 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">{g.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {g.value}%
                        </Typography>
                      </Stack>
                      <Box sx={{ mt: 0.75 }}>
                        <Progress value={g.value} aria-label={`${g.label}, ${g.value} percent`} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
