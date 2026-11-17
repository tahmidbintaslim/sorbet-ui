'use client';
// @example {"title":"Header, content and actions","description":"Compose with MUI's CardHeader, CardContent and CardActions."}
import { CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { Avatar, Button, Card } from '@sorbet-ui/react';

export default function Composed() {
  return (
    <Card sx={{ width: '100%', maxWidth: 360 }}>
      <CardHeader
        avatar={<Avatar variant="soft">AL</Avatar>}
        title="Ada Lovelace"
        subheader="Engineer, Platform"
        slotProps={{ title: { component: 'h4', sx: { fontWeight: 700, fontSize: 16 } } }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary">
          Working on the build pipeline this sprint. Ask about caching and preview deploys.
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button size="sm">Message</Button>
        <Button size="sm" variant="ghost" color="neutral">
          View profile
        </Button>
      </CardActions>
    </Card>
  );
}
