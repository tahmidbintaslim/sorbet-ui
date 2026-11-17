'use client';
// The component catalog: a quick filter (kept in the URL as ?q=) over cards grouped
// by kind. The static HTML lists every component; filtering happens after hydration.
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import Search from '@mui/icons-material/Search';
import CatalogCard from '@/components/CatalogCard';
import { catalogByGroup } from '@/lib/catalog';
import { useUrlParam } from '@/lib/use-url-param';
import { TOUCH } from '@/lib/touch';
import { ScoopDot } from '@/components/fun/Decor';
import { scoopAt } from '@/lib/scoops';

const ALL = catalogByGroup();
const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

export default function CatalogGrid() {
  const [q, setQ] = useUrlParam<string>('q', '');
  const needle = q.trim().toLowerCase();
  const groups = ALL.map(({ group, entries }) => ({
    group,
    entries: entries.filter((e) => !needle || `${e.name} ${e.description} ${e.imports.join(' ')} ${group}`.toLowerCase().includes(needle)),
  })).filter((g) => g.entries.length > 0);
  const count = groups.reduce((n, g) => n + g.entries.length, 0);

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 1 }}>
        <TextField
          type="search"
          size="small"
          label="Filter components"
          placeholder="Try table, input or overlay"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true },
            htmlInput: { 'data-testid': 'catalog-filter' },
          }}
          sx={{ width: { xs: '100%', sm: 320 }, [TOUCH]: { '& .MuiInputBase-root': { minHeight: 44 } } }}
        />
        <Typography role="status" variant="body2" color="text.secondary" data-testid="catalog-count">
          {count} {count === 1 ? 'component' : 'components'}
        </Typography>
      </Box>

      {groups.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
          Nothing matches &quot;{q.trim()}&quot;. Try a shorter word.
        </Typography>
      )}

      {groups.map(({ group, entries }, gi) => (
        <Box component="section" key={group} aria-labelledby={`group-${slugify(group)}`} sx={{ mt: 4 }}>
          <Typography component="h2" id={`group-${slugify(group)}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', mb: 2, scrollMarginTop: 88 }}>
            <ScoopDot c={scoopAt(gi)} size={13} />
            {group}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
              {entries.length}
            </Typography>
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
            {entries.map((d) => (
              <CatalogCard key={d.slug} slug={d.slug} name={d.name} description={d.description} />
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
}
