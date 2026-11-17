'use client';
// Docs search: a "Search docs" button (Ctrl/Cmd+K) that opens a command palette
// over components, their examples and the guide sections. The index is generated
// at build time (scripts/gen-docs.mjs) and loaded the first time the palette opens.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, ButtonBase, Dialog, InputBase, Typography } from '@mui/material';
import Search from '@mui/icons-material/Search';
import type { SearchEntry } from '@/lib/docs-search-index';
import { scoop } from '@/lib/scoops';
import { SECTION_FLAVOR } from '@/lib/sections';
import { TOUCH } from '@/lib/touch';

const FLAVOR = SECTION_FLAVOR.components;
const GROUP_ORDER = ['Components', 'Guides', 'Examples'] as const;
const MAX = 24;

function score(entry: SearchEntry, q: string) {
  const title = entry.title.toLowerCase();
  let s = 0;
  if (title === q) s = 100;
  else if (title.startsWith(q)) s = 80;
  else if (title.split(/[\s-]+/).some((w) => w.startsWith(q))) s = 60;
  else if (title.includes(q)) s = 40;
  else if (`${entry.hint} ${entry.keywords ?? ''}`.toLowerCase().includes(q)) s = 15;
  if (s === 0) return 0;
  return s + (entry.group === 'Components' ? 6 : entry.group === 'Guides' ? 3 : 0);
}

function search(index: SearchEntry[], query: string) {
  const q = query.trim().toLowerCase();
  // With no query, offer the guides and the catalog as starting points.
  if (!q) return index.filter((e) => e.group === 'Guides' || e.href === '/docs/components').slice(0, 10);
  return index
    .map((entry) => ({ entry, s: score(entry, q) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, MAX)
    .map((r) => r.entry);
}

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <Box component="kbd" sx={{ fontFamily: 'inherit', fontSize: 11, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: '6px', border: 1, borderColor: 'divider', color: 'text.secondary', bgcolor: 'background.default', whiteSpace: 'nowrap' }}>
    {children}
  </Box>
);

export default function DocsSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const button = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [index, setIndex] = React.useState<SearchEntry[] | null>(null);
  const [cursor, setCursor] = React.useState(0);
  const [mac, setMac] = React.useState(false);
  const listId = React.useId();

  React.useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  // Ctrl/Cmd+K. The docs layout mounts one button for desktop and one for mobile:
  // only the visible one answers.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.key === 'k' || e.key === 'K') || !(e.metaKey || e.ctrlKey) || e.altKey) return;
      if (!button.current || button.current.offsetParent === null) return;
      e.preventDefault();
      setOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    if (!open || index) return;
    let alive = true;
    import('@/lib/docs-search-index').then((m) => alive && setIndex(m.SEARCH_INDEX));
    return () => {
      alive = false;
    };
  }, [open, index]);

  const results = React.useMemo(() => (index ? search(index, query) : []), [index, query]);
  // Grouped for display; `flat` is the keyboard order.
  const groups = GROUP_ORDER.map((group) => ({ group, items: results.filter((r) => r.group === group) })).filter((g) => g.items.length > 0);
  const flat = groups.flatMap((g) => g.items);
  const active = flat[Math.min(cursor, flat.length - 1)];
  const optionId = (entry: SearchEntry) => `${listId}-${flat.indexOf(entry)}`;

  const close = () => {
    setOpen(false);
    setQuery('');
    setCursor(0);
  };
  const go = (entry: SearchEntry) => {
    close();
    router.push(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (flat.length === 0) return;
      const next = (Math.min(cursor, flat.length - 1) + (e.key === 'ArrowDown' ? 1 : -1) + flat.length) % flat.length;
      setCursor(next);
      document.getElementById(`${listId}-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && active) {
      e.preventDefault();
      go(active);
    }
  };

  return (
    <>
      <ButtonBase
        ref={button}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={compact ? 'Search docs' : undefined}
        aria-keyshortcuts="Control+K Meta+K"
        data-testid="docs-search-button"
        sx={{
          gap: 1,
          justifyContent: 'flex-start',
          width: compact ? 44 : '100%',
          minHeight: compact ? 44 : 40,
          px: compact ? 0 : 1.5,
          borderRadius: 999,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.secondary',
          fontSize: 14,
          transition: 'border-color .15s, color .15s',
          '&:hover': { borderColor: scoop(FLAVOR, 'fill'), color: 'text.primary' },
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          ...(compact && { justifyContent: 'center', flexShrink: 0 }),
          [TOUCH]: { minHeight: 44 },
        }}
      >
        <Search sx={{ fontSize: 20 }} />
        {!compact && (
          <>
            <Box component="span" sx={{ flex: 1, textAlign: 'left' }}>
              Search docs
            </Box>
            <Kbd>{mac ? '⌘K' : 'Ctrl K'}</Kbd>
          </>
        )}
      </ButtonBase>

      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: { 'data-testid': 'docs-search', 'aria-label': 'Search docs', sx: { position: 'absolute', top: { xs: 16, sm: '12vh' }, m: { xs: 2, sm: 0 }, width: { xs: 'calc(100% - 32px)', sm: '100%' }, borderRadius: 4, overflow: 'hidden', backgroundImage: 'none' } } as object,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Search sx={{ color: 'text.secondary' }} />
          <InputBase
            autoFocus
            fullWidth
            placeholder="Search components, examples and guides"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onKeyDown}
            inputProps={{
              role: 'combobox',
              'aria-label': 'Search docs',
              'aria-expanded': true,
              'aria-controls': listId,
              'aria-autocomplete': 'list',
              'aria-activedescendant': active ? optionId(active) : undefined,
              autoComplete: 'off',
              spellCheck: false,
            }}
            sx={{ py: 1.5, fontSize: 16 }}
          />
          <ButtonBase onClick={close} aria-label="Close search" sx={{ borderRadius: 1, [TOUCH]: { minHeight: 44, minWidth: 44 }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
            <Kbd>Esc</Kbd>
          </ButtonBase>
        </Box>

        <Box id={listId} role="listbox" aria-label="Results" aria-busy={!index} sx={{ maxHeight: { xs: '60vh', sm: 420 }, overflowY: 'auto', p: 1 }}>
          {groups.map((g) => (
            <Box key={g.group} role="group" aria-label={g.group}>
              <Typography aria-hidden variant="overline" color="text.secondary" sx={{ display: 'block', px: 1.5, pt: 1, fontWeight: 700 }}>
                {query.trim() ? g.group : 'Start here'}
              </Typography>
              {g.items.map((entry) => {
                const selected = entry === active;
                return (
                  <Box
                    key={entry.href}
                    id={optionId(entry)}
                    role="option"
                    aria-selected={selected}
                    onClick={() => go(entry)}
                    onMouseMove={() => setCursor(flat.indexOf(entry))}
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 1.5,
                      px: 1.5,
                      py: 1,
                      minHeight: 44,
                      borderRadius: 2,
                      cursor: 'pointer',
                      ...(selected && { bgcolor: scoop(FLAVOR, 'pastel'), color: scoop(FLAVOR, 'pill') }),
                    }}
                  >
                    <Typography component="span" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {entry.title}
                    </Typography>
                    <Typography component="span" variant="body2" sx={{ color: selected ? 'inherit' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                      {entry.hint}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
        <Typography role="status" variant="body2" color="text.secondary" sx={{ px: 2.5, py: 1.25, borderTop: 1, borderColor: 'divider' }}>
          {!index ? 'Loading the index' : flat.length === 0 ? `No results for "${query.trim()}".` : `${flat.length} result${flat.length === 1 ? '' : 's'}. Use the arrow keys and Enter.`}
        </Typography>
      </Dialog>
    </>
  );
}
