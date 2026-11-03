'use client';
// @block {"name":"Post grid","description":"Three post cards with a category chip, title, excerpt, author and date."}
import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { Avatar, Button, Card, Chip } from '@sorbet-ui/react';

const POSTS = [
  {
    category: 'Product',
    color: 'primary',
    title: 'Introducing shared timelines',
    excerpt: 'Plan launches across teams on one view, with dependencies that update as work moves.',
    author: 'Maya Lindqvist',
    initials: 'ML',
    date: 'Oct 28, 2026',
    iso: '2026-10-28',
  },
  {
    category: 'Engineering',
    color: 'secondary',
    title: 'How we made search ten times faster',
    excerpt: 'A look at the indexing changes behind instant results, and the trade-offs we made along the way.',
    author: 'Jonas Weber',
    initials: 'JW',
    date: 'Oct 14, 2026',
    iso: '2026-10-14',
  },
  {
    category: 'Guides',
    color: 'success',
    title: 'Running a calmer weekly planning meeting',
    excerpt: 'A simple agenda template that keeps the meeting short and leaves everyone with clear next steps.',
    author: 'Priya Raman',
    initials: 'PR',
    date: 'Sep 30, 2026',
    iso: '2026-09-30',
  },
] as const;

export default function BlogGrid() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          <Box>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em' }}>
              From the blog
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Product news, engineering notes and practical guides.
            </Typography>
          </Box>
          <Button variant="ghost" href="#">
            View all posts
          </Button>
        </Stack>
        <Grid container spacing={3}>
          {POSTS.map((p) => (
            <Grid key={p.title} size={{ xs: 12, md: 4 }}>
              <Card
                component="article"
                variant="outlined"
                sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <Box>
                  <Chip size="sm" variant="soft" color={p.color} label={p.category} />
                </Box>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: 20, lineHeight: 1.3, mt: 2 }}>
                  <Link href="#" color="text.primary" underline="hover">
                    {p.title}
                  </Link>
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5, flex: 1 }}>
                  {p.excerpt}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
                  <Avatar size="sm" variant="soft" color={p.color}>
                    {p.initials}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {p.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="time" dateTime={p.iso}>
                      {p.date}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
