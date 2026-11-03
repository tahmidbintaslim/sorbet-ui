'use client';
// @block {"name": "Tabbed", "description": "Tabs switching between three working panels."}
import { Box, Container, Stack, Typography } from '@mui/material';
import { Button, Card, Checkbox, Switch, Tabs } from '@sorbet-ui/react';

function Panel({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ p: 4, mt: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 20 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        {body}
      </Typography>
      {children}
    </Card>
  );
}

export default function FeatureTabs() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 42 }, letterSpacing: '-0.03em', textAlign: 'center', mb: 4 }}>
          One app, three jobs
        </Typography>
        <Tabs
          variant="soft"
          centered
          defaultValue="notify"
          tabs={[
            {
              id: 'notify',
              label: 'Notify',
              content: (
                <Panel title="Notifications that respect focus" body="Pick what reaches you and when.">
                  <Stack spacing={1}>
                    <Switch label="Mentions" defaultChecked />
                    <Switch label="Weekly digest" defaultChecked />
                    <Switch label="Marketing emails" />
                  </Stack>
                </Panel>
              ),
            },
            {
              id: 'track',
              label: 'Track',
              content: (
                <Panel title="Checklists for every launch" body="Reusable templates your team can trust.">
                  <Stack spacing={0.5}>
                    <Checkbox label="Write release notes" defaultChecked />
                    <Checkbox label="Update docs" defaultChecked />
                    <Checkbox label="Announce on social" />
                  </Stack>
                </Panel>
              ),
            },
            {
              id: 'share',
              label: 'Share',
              content: (
                <Panel title="Share a read-only link" body="Anyone with the link can view, no account needed.">
                  <Button variant="soft">Copy link</Button>
                </Panel>
              ),
            },
          ]}
        />
      </Container>
    </Box>
  );
}
