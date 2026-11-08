'use client';
// @block {"name":"404 page","description":"Not-found message with a site search field and a way back home."}
import * as React from 'react';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import { Alert, Button, TextField } from '@sorbet-ui/react';

export default function NotFound() {
  const [query, setQuery] = React.useState('');
  const [searched, setSearched] = React.useState('');
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography
          aria-hidden
          sx={{ fontWeight: 900, fontSize: { xs: 96, md: 140 }, lineHeight: 1, letterSpacing: '-0.06em', color: 'primary.main' }}
        >
          404
        </Typography>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.03em', mt: 2 }}>
          Page not found
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          The page you are looking for moved or never existed. Try searching the Acme help center instead.
        </Typography>
        <Box
          component="form"
          role="search"
          aria-label="Search Acme"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            setSearched(query.trim());
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
            <TextField
              label="Search the site"
              type="search"
              variant="soft"
              startIcon={<SearchIcon fontSize="small" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button type="submit" variant="outlined" color="neutral" size="lg">
              Search
            </Button>
          </Stack>
        </Box>
        {searched && (
          <Alert color="info" sx={{ mt: 2, textAlign: 'left' }}>
            Showing help articles for “{searched}”.
          </Alert>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <Button href="#" size="lg" startIcon={<HomeIcon />}>
            Back to home
          </Button>
          <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>
            Contact support
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
