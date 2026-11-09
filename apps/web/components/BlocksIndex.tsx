'use client';
// Category grid with a search box that filters blocks by name, description or category.
import NextLink from 'next/link';
import { Box, Grid, InputAdornment, Stack, TextField as MuiTextField, Typography } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { Chip } from '@sorbet-ui/react';
import { BLOCKS, CATEGORIES, blocksIn } from '@/lib/blocks';
import { useUrlParam } from '@/lib/use-url-param';

export default function BlocksIndex() {
  // ?q= keeps a search shareable and restores it on back/reload.
  const [q, setQ] = useUrlParam<string>('q', '');
  const query = q.trim().toLowerCase();
  const hits = query
    ? BLOCKS.filter((b) => `${b.name} ${b.description} ${b.category}`.toLowerCase().includes(query))
    : [];
  return (
    <>
      <MuiTextField
        fullWidth
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Search ${BLOCKS.length} blocks…`}
        slotProps={{
          htmlInput: { 'aria-label': 'Search blocks' },
          input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> },
        }}
        sx={{ mt: 3, maxWidth: 560 }}
      />
      {query ? (
        <Stack spacing={1} sx={{ mt: 3 }} data-testid="block-search-results">
          {hits.length === 0 && <Typography color="text.secondary">No blocks match “{q}”.</Typography>}
          {hits.map((b) => (
            <Box
              key={b.id}
              component={NextLink}
              href={`/blocks/${b.category}#${b.id}`}
              sx={{ p: 2, borderRadius: 2, border: 1, borderColor: 'divider', color: 'text.primary', textDecoration: 'none', '&:hover': { bgcolor: 'action.hover' } }}
            >
              <Typography sx={{ fontWeight: 600 }}>{b.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {CATEGORIES.find((c) => c.id === b.category)?.title} · {b.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        (['Marketing', 'Application'] as const).map((group) => (
          <Box key={group} component="section" sx={{ mt: 6 }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: 24, mb: 2 }}>
              {group}
            </Typography>
            <Grid container spacing={2}>
              {CATEGORIES.filter((c) => c.group === group && blocksIn(c.id).length > 0).map((c) => (
                <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    component={NextLink}
                    href={`/blocks/${c.id}`}
                    sx={{ display: 'block', height: '100%', p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary', textDecoration: 'none', transition: 'border-color .2s, transform .2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}
                  >
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography component="h3" sx={{ fontWeight: 700 }}>
                        {c.title}
                      </Typography>
                      <Chip size="sm" variant="soft" color="neutral" label={blocksIn(c.id).length} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {c.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}
    </>
  );
}
