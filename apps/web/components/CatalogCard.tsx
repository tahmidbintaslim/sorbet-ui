'use client';
import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';

export default function CatalogCard({ href, name, description }: { href: string; name: string; description: string }) {
  return (
    <Box
      component={NextLink}
      href={href}
      sx={{
        display: 'block',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        color: 'inherit',
        textDecoration: 'none',
        height: '100%',
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
