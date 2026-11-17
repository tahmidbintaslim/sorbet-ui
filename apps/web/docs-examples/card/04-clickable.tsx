'use client';
// @example {"title":"Clickable","description":"clickable adds hover styles. Put MUI's CardActionArea inside so the card is a real, focusable button."}
import * as React from 'react';
import { Box, CardActionArea, Typography } from '@mui/material';
import { Card } from '@sorbet-ui/react';

const PLANS = [
  { id: 'solo', name: 'Solo', note: 'One seat' },
  { id: 'team', name: 'Team', note: 'Ten seats' },
];

export default function Clickable() {
  const [plan, setPlan] = React.useState('solo');
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%', maxWidth: 380 }}>
      {PLANS.map((p) => (
        <Card key={p.id} clickable variant={plan === p.id ? 'soft' : 'outlined'} color="primary">
          <CardActionArea onClick={() => setPlan(p.id)} aria-pressed={plan === p.id} sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>{p.name}</Typography>
            <Typography variant="body2">{p.note}</Typography>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
