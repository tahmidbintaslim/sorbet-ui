'use client';
// @block {"name": "Icon grid", "description": "Six features with colored soft chips."}
import { Box, Container, Grid, Typography } from '@mui/material';
import Bolt from '@mui/icons-material/Bolt';
import Lock from '@mui/icons-material/Lock';
import Sync from '@mui/icons-material/Sync';
import Insights from '@mui/icons-material/Insights';
import Groups from '@mui/icons-material/Groups';
import Language from '@mui/icons-material/Language';
import { Chip } from '@sorbet-ui/react';

const FEATURES = [
  { icon: Bolt, title: 'Fast by default', body: 'Pages load from the edge closest to your users.', color: 'warning' },
  { icon: Lock, title: 'Secure', body: 'SSO, audit logs and role-based access on every plan.', color: 'success' },
  { icon: Sync, title: 'Always in sync', body: 'Changes appear for everyone in real time.', color: 'primary' },
  { icon: Insights, title: 'Insights', body: 'See what is used and what is not, per feature.', color: 'secondary' },
  { icon: Groups, title: 'Built for teams', body: 'Comments, mentions and shared views.', color: 'info' },
  { icon: Language, title: 'Global', body: 'Translations and local currencies built in.', color: 'danger' },
] as const;

export default function FeatureGrid() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 620, mb: 6 }}>
          <Chip label="Features" variant="soft" color="primary" />
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em', mt: 2 }}>
            Everything you need, nothing you don&apos;t
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {FEATURES.map(({ icon: Icon, title, body, color }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Chip icon={<Icon />} label={title} variant="soft" color={color} sx={{ fontWeight: 700 }} />
              <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                {body}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
