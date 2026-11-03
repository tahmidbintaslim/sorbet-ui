'use client';
// @block {"name":"Changelog","description":"Vertical timeline of recent releases with version chips."}
import { Box, Container, Stack, Typography } from '@mui/material';
import { Button, Chip } from '@sorbet-ui/react';

type Tag = 'Feature' | 'Fix' | 'Improvement';
const tagColor: Record<Tag, 'primary' | 'danger' | 'success'> = { Feature: 'primary', Fix: 'danger', Improvement: 'success' };

const releases: { version: string; date: string; iso: string; title: string; latest?: boolean; notes: [Tag, string][] }[] = [
  {
    version: 'v3.2.0',
    date: 'October 28, 2026',
    iso: '2026-10-28',
    title: 'Shared dashboards',
    latest: true,
    notes: [
      ['Feature', 'Share any dashboard with a read-only link.'],
      ['Improvement', 'Charts load up to 40% faster on large workspaces.'],
    ],
  },
  {
    version: 'v3.1.2',
    date: 'October 9, 2026',
    iso: '2026-10-09',
    title: 'Export fixes',
    notes: [
      ['Fix', 'CSV exports now keep leading zeros in order IDs.'],
      ['Fix', 'Resolved a timezone offset in weekly reports.'],
    ],
  },
  {
    version: 'v3.1.0',
    date: 'September 18, 2026',
    iso: '2026-09-18',
    title: 'Saved filters',
    notes: [
      ['Feature', 'Save and name filter sets on any table.'],
      ['Improvement', 'Keyboard navigation across all menus.'],
    ],
  },
  {
    version: 'v3.0.0',
    date: 'August 26, 2026',
    iso: '2026-08-26',
    title: 'Acme 3.0',
    notes: [
      ['Feature', 'A redesigned navigation and a new dark theme.'],
      ['Feature', 'Workspaces can now hold unlimited projects.'],
    ],
  },
];

export default function Changelog() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em' }}>
          Changelog
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 5 }}>
          New features, improvements and fixes in Acme.
        </Typography>
        <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {releases.map((r, i) => (
            <Box component="li" key={r.version} sx={{ display: 'flex', gap: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.75 }} aria-hidden>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: r.latest ? 'primary.main' : 'background.paper',
                    border: 2,
                    borderColor: r.latest ? 'primary.main' : 'divider',
                  }}
                />
                {i < releases.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', my: 0.5 }} />}
              </Box>
              <Box sx={{ pb: i < releases.length - 1 ? 5 : 0, minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                  <Chip size="sm" variant={r.latest ? 'solid' : 'outlined'} color={r.latest ? 'primary' : 'neutral'} label={r.version} />
                  {r.latest && <Chip size="sm" variant="soft" color="success" label="Latest" />}
                  <Typography component="time" dateTime={r.iso} variant="body2" color="text.secondary">
                    {r.date}
                  </Typography>
                </Stack>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: 20, mt: 1.5 }}>
                  {r.title}
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1.5 }}>
                  {r.notes.map(([tag, text]) => (
                    <Stack component="li" key={text} direction="row" spacing={1.5} alignItems="baseline" sx={{ py: 0.5 }}>
                      <Box sx={{ flexShrink: 0, width: 96 }}>
                        <Chip size="xs" variant="soft" color={tagColor[tag]} label={tag} />
                      </Box>
                      <Typography color="text.secondary" sx={{ minWidth: 0 }}>
                        {text}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 5, pl: { xs: 4, sm: 5 } }}>
          <Button variant="outlined" color="neutral" href="#">
            View older releases
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
