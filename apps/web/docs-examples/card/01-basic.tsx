'use client';
// @example {"title":"Basic","description":"A surface for grouped content. Add padding with sx or MUI's CardContent."}
import { Typography } from '@mui/material';
import { Card } from '@sorbet-ui/react';

export default function Basic() {
  return (
    <Card sx={{ p: 2.5, width: '100%', maxWidth: 320 }}>
      <Typography component="h4" variant="subtitle1" sx={{ fontWeight: 700 }}>
        Mango sorbet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Alphonso mango, lime and a pinch of salt. Dairy free.
      </Typography>
    </Card>
  );
}
