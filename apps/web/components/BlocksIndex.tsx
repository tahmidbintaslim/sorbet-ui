'use client';
// Category grid with a search box that filters blocks by name, description or category.
// The grid reads like an ice-cream shop menu board: name, dotted leader, count sticker.
import NextLink from 'next/link';
import { Box, Grid, InputAdornment, Stack, TextField as MuiTextField, Typography } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { BLOCKS, CATEGORIES, blocksIn } from '@/lib/blocks';
import { useUrlParam } from '@/lib/use-url-param';
import { scoop, scoopAt } from '@/lib/scoops';
import { SECTION_FLAVOR } from '@/lib/sections';
import { ScoopDot, StickerBadge } from './fun/Decor';
import Doodle from './fun/Doodles';
import Ink from './fun/Ink';

const SPRINGY = 'cubic-bezier(.3,1.6,.5,1)';

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
        sx={{ mt: 4, maxWidth: 560, '& .MuiOutlinedInput-root': { borderRadius: 999, pl: 2.5, bgcolor: 'background.paper' } }}
      />
      {query ? (
        <Stack spacing={1} sx={{ mt: 3 }} data-testid="block-search-results">
          {hits.length === 0 && (
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', py: 2 }} data-testid="block-search-empty">
              <Doodle name="emptyCone" flavor={SECTION_FLAVOR.blocks} sx={{ width: 88 }} />
              <Typography color="text.secondary">No blocks match “{q}”.</Typography>
            </Stack>
          )}
          {hits.map((b) => {
            const s = scoopAt(Math.max(0, CATEGORIES.findIndex((c) => c.id === b.category)));
            return (
              <Box
                key={b.id}
                component={NextLink}
                href={`/blocks/${b.category}#${b.id}`}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  p: 2,
                  borderRadius: 3,
                  border: 1,
                  borderColor: 'divider',
                  color: 'text.primary',
                  textDecoration: 'none',
                  transition: 'border-color .2s, background-color .2s',
                  '&:hover': { borderColor: scoop(s, 'fill'), bgcolor: 'action.hover' },
                }}
              >
                <ScoopDot c={s} size={14} sx={{ mt: 0.6 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }}>{b.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {CATEGORIES.find((c) => c.id === b.category)?.title} · {b.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      ) : (
        (['Marketing', 'Application'] as const).map((group, g) => (
          <Box key={group} component="section" sx={{ mt: 6 }}>
            <Box sx={{ width: 'fit-content', mb: 2.5 }}>
              <Typography component="h2" sx={{ fontWeight: 800, fontSize: 24 }}>
                {group}
              </Typography>
              <Ink c={g ? 'primary' : 'danger'} viewBox="0 0 120 12" strokes={['M2 6 Q 12 0 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 118 6']} duration={0.8} sx={{ width: '100%', height: 10, mt: 0.25 }} />
            </Box>
            <Grid container spacing={2}>
              {CATEGORIES.filter((c) => c.group === group && blocksIn(c.id).length > 0).map((c, i) => {
                const s = scoopAt(i + (group === 'Application' ? 3 : 0));
                return (
                  <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      component={NextLink}
                      href={`/blocks/${c.id}`}
                      sx={{
                        display: 'block',
                        height: '100%',
                        p: 2.5,
                        pt: 2,
                        borderRadius: 3,
                        border: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        textDecoration: 'none',
                        transition: `border-color .2s, box-shadow .25s, transform .35s ${SPRINGY}`,
                        '& .sticker-badge': { transition: `rotate .4s ${SPRINGY}, scale .4s ${SPRINGY}` },
                        '&:hover': { borderColor: scoop(s, 'fill'), transform: `translateY(-4px) rotate(${i % 2 ? 0.7 : -0.7}deg)`, boxShadow: `0 18px 36px -20px ${scoop(s, 'fill')}` },
                        '&:hover .sticker-badge': { rotate: '-10deg', scale: '1.12' },
                        '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' }, '&:hover .sticker-badge': { rotate: '8deg', scale: 'none' } },
                      }}
                    >
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                        <Typography component="h3" sx={{ fontWeight: 700 }}>
                          {c.title}
                        </Typography>
                        {/* dotted leader, as on a menu board */}
                        <Box aria-hidden sx={{ flex: 1, minWidth: 12, height: 0, borderBottom: '3px dotted', borderColor: scoop(s, 'fill'), translate: '0 3px' }} />
                        <StickerBadge c={s} size={46}>
                          {blocksIn(c.id).length}
                        </StickerBadge>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {c.description}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))
      )}
    </>
  );
}
