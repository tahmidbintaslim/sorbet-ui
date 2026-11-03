'use client';
// @block {"name":"Link columns","description":"Brand and tagline, four columns of links and a bottom row with legal links."}
import { Box, Container, Divider, Grid, Link, Stack, Typography } from '@mui/material';

const COLUMNS = [
  { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
  { title: 'Resources', links: ['Docs', 'Guides', 'Templates', 'Community'] },
  { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
  { title: 'Support', links: ['Help center', 'Contact', 'Status', 'Security'] },
];

const LEGAL = ['Privacy', 'Terms', 'Cookies'];

export default function FooterColumns() {
  return (
    <Box component="footer" sx={{ py: { xs: 8, md: 12 }, borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em' }}>Acme</Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 300 }}>
              The calm workspace for planning, building and shipping together.
            </Typography>
          </Grid>
          {COLUMNS.map((col) => (
            <Grid key={col.title} size={{ xs: 6, sm: 3, md: 2 }}>
              <Box component="nav" aria-label={`Footer ${col.title.toLowerCase()} links`}>
                <Typography component="h2" sx={{ fontWeight: 700, fontSize: 14, mb: 2 }}>
                  {col.title}
                </Typography>
                <Stack component="ul" spacing={1.25} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: 14 }}>
                        {l}
                      </Link>
                    </li>
                  ))}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: { xs: 4, md: 6 } }} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2026 Acme, Inc. All rights reserved.
          </Typography>
          <Stack component="nav" aria-label="Footer legal links" direction="row" spacing={3} useFlexGap flexWrap="wrap">
            {LEGAL.map((l) => (
              <Link key={l} href="#" color="text.secondary" underline="hover" variant="body2">
                {l}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
