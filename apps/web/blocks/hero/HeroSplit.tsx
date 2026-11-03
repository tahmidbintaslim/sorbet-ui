'use client';
// @block {"name": "Split with signup", "description": "Copy and email capture beside a report card."}
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Avatar, Button, Card, Chip, Progress, TextField } from '@sorbet-ui/react';

export default function HeroSplit() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
              For growing teams
            </Typography>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 38, md: 54 }, letterSpacing: '-0.04em', lineHeight: 1.05, mt: 1 }}>
              Your weekly report, written for you
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 18, mt: 2.5 }}>
              Connect your tools and get a clear summary every Monday. No dashboards to dig through.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
              <TextField label="Work email" variant="soft" size="md" sx={{ flex: 1 }} />
              <Button size="lg">Get early access</Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar status="online">JD</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>Week 32 summary</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sample report
                  </Typography>
                </Box>
                <Chip size="sm" label="On track" variant="soft" color="success" />
              </Stack>
              {[
                ['Sprint goals', 80],
                ['Bugs closed', 64],
                ['Docs updated', 45],
              ].map(([label, v]) => (
                <Box key={label} sx={{ mt: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {v}%
                    </Typography>
                  </Stack>
                  <Box sx={{ mt: 0.75 }}>
                    <Progress value={v as number} aria-label={`${label}, ${v} percent`} />
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
