'use client';
import { Box, Stack } from '@mui/material';
import { Alert, Avatar, Button, Card, Checkbox, Chip, Progress, Switch, TextField } from '@sorbet-ui/react';

// Hero showcase: a handful of real components in one card.
export default function Showcase() {
  return (
    <Card variant="outlined" data-known-contrast sx={{ p: 3, width: '100%', maxWidth: 440 }}>
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button variant="solid">Solid</Button>
          <Button variant="soft" color="success">
            Soft
          </Button>
          <Button variant="outlined" color="warning">
            Outlined
          </Button>
          <Button variant="ghost" color="danger">
            Ghost
          </Button>
        </Stack>
        <TextField label="Email" placeholder="you@example.com" variant="soft" />
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <Checkbox label="Remember me" defaultChecked />
          <Switch label="Dark mode" />
        </Stack>
        <Progress value={72} aria-label="Upload progress" />
        <Alert color="info">Soft, ghost and plain variants on every component.</Alert>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Avatar status="online">AL</Avatar>
          <Chip label="React" variant="soft" color="primary" />
          <Chip label="TypeScript" variant="soft" color="secondary" />
          <Chip label="MUI v7" variant="outlined" color="neutral" />
        </Box>
      </Stack>
    </Card>
  );
}
