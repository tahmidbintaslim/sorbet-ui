'use client';
// @block {"name":"Featured post","description":"One large featured post next to a list of three recent posts."}
import { alpha, Box, Container, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import { Avatar, Card, Chip } from '@sorbet-ui/react';

const RECENT = [
  { category: 'Engineering', title: 'Shipping offline mode without breaking sync', date: 'Oct 21, 2026', iso: '2026-10-21', read: '7 min read' },
  { category: 'Design', title: 'Designing empty states that actually help', date: 'Oct 09, 2026', iso: '2026-10-09', read: '5 min read' },
  { category: 'Company', title: 'What we learned from a year of four-day weeks', date: 'Sep 24, 2026', iso: '2026-09-24', read: '6 min read' },
];

export default function BlogFeatured() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em', mb: { xs: 4, md: 6 } }}>
          Latest stories
        </Typography>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card component="article" variant="outlined" sx={{ height: '100%', p: 0, overflow: 'hidden' }}>
              <Box
                aria-hidden
                sx={{
                  height: { xs: 180, md: 260 },
                  background: (t) =>
                    `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.25)}, ${alpha(t.palette.secondary.main, 0.25)})`,
                }}
              />
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip size="sm" variant="soft" color="primary" label="Featured" />
                  <Typography variant="body2" color="text.secondary">
                    Product · 8 min read
                  </Typography>
                </Stack>
                <Typography component="h3" sx={{ fontWeight: 800, fontSize: { xs: 24, md: 30 }, lineHeight: 1.2, letterSpacing: '-0.02em', mt: 2 }}>
                  <Link href="#" color="text.primary" underline="hover">
                    Acme 2.0: one workspace for the whole release cycle
                  </Link>
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 17 }}>
                  Roadmaps, tasks and reviews now live side by side. Here is what changed, why we rebuilt the core, and how to try the new
                  workspace today.
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: 3 }}>
                  <Avatar size="sm" variant="soft" color="secondary">
                    TO
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Theo Okafor
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="time" dateTime="2026-11-01">
                      Nov 01, 2026
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack divider={<Divider flexItem />} spacing={3}>
              {RECENT.map((p) => (
                <Box component="article" key={p.title}>
                  <Chip size="xs" variant="plain" label={p.category} />
                  <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.35, mt: 1.25 }}>
                    <Link href="#" color="text.primary" underline="hover">
                      {p.title}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <time dateTime={p.iso}>{p.date}</time> · {p.read}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
