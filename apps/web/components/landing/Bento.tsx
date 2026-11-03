'use client';
// Bento grid of small, working demos. Each tile is interactive on its own.
import * as React from 'react';
import { Box, InputBase, List, ListItemButton, ListItemText, Stack, ThemeProvider, Typography } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Search from '@mui/icons-material/Search';
import KeyboardCommandKey from '@mui/icons-material/KeyboardCommandKey';
import CheckCircle from '@mui/icons-material/CheckCircle';
import StarRounded from '@mui/icons-material/StarRounded';
import { Alert, Button, Chip, Slider, Switch } from '@sorbet-ui/react';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';
import { colorPalette } from '@sorbet-ui/tokens';
import { formatStars, useGitHubStars } from '../GitHubStars';
import { SITE } from '@/lib/site';
import { CATALOG } from '@/lib/catalog';
import { EASE, Stagger } from '../motion';

// Each tile is a stagger child of the grid.
const tileIn = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };

function Tile({ title, body, children, span, testId }: { title: string; body: string; children: React.ReactNode; span: { md: number }; testId?: string }) {
  return (
    <Box
      component={motion.div}
      variants={tileIn}
      data-testid={testId}
      sx={{
        gridColumn: { xs: 'span 6', md: `span ${span.md}` },
        position: 'relative',
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        p: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 300,
        transition: 'border-color .25s, box-shadow .25s',
        // Gradient border glow on hover
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          background: `linear-gradient(135deg, ${colorPalette.primary[400]}, ${colorPalette.secondary[400]}, ${colorPalette.danger[300]})`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity .3s',
          pointerEvents: 'none',
        },
        '&:hover::before, &:focus-within::before': { opacity: 1 },
        '&:hover': { boxShadow: '0 20px 50px -30px rgba(14,165,233,.5)' },
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 170 }}>{children}</Box>
      <Typography component="h3" sx={{ fontWeight: 700, fontSize: 17, mt: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {body}
      </Typography>
    </Box>
  );
}

/** ⌘K-style command palette filtering the real component catalog. */
function CommandMenu() {
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const items = CATALOG.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
  React.useEffect(() => setActive(0), [q]);
  return (
    <Box sx={{ width: '100%', maxWidth: 360, borderRadius: 3, border: 1, borderColor: 'divider', bgcolor: 'background.default', boxShadow: '0 16px 40px -20px rgba(15,23,42,.35)', overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Search fontSize="small" sx={{ color: 'text.secondary' }} />
        <InputBase
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, items.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Enter' && items[active]) {
              window.location.href = `/docs/components/${items[active].slug}`;
            }
          }}
          placeholder="Search components…"
          inputProps={{ 'aria-label': 'Search components', role: 'combobox', 'aria-expanded': true, 'aria-controls': 'cmdk-list' }}
          sx={{ flex: 1, fontSize: 14 }}
        />
        <Chip size="xs" variant="soft" color="neutral" label={<Stack direction="row" alignItems="center"><KeyboardCommandKey sx={{ fontSize: 12 }} />K</Stack>} />
      </Stack>
      <List id="cmdk-list" role="listbox" dense disablePadding sx={{ p: 0.5, minHeight: 180 }}>
        <AnimatePresence initial={false}>
          {items.map((c, i) => (
            <motion.div key={c.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <ListItemButton
                role="option"
                aria-selected={i === active}
                selected={i === active}
                href={`/docs/components/${c.slug}`}
                component="a"
                onMouseEnter={() => setActive(i)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemText primary={c.name} primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
              </ListItemButton>
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            No components match “{q}”.
          </Typography>
        )}
      </List>
    </Box>
  );
}

/** Stack of toasts that spring in and out. */
function ToastStack() {
  const [toasts, setToasts] = React.useState<{ id: number; text: string; color: 'success' | 'info' | 'warning' }[]>([
    { id: 1, text: 'Theme applied', color: 'success' },
  ]);
  const MSG = [
    { text: 'Invite sent to sam@acme.dev', color: 'success' as const },
    { text: 'New comment on Billing', color: 'info' as const },
    { text: 'Storage 90% full', color: 'warning' as const },
  ];
  const push = () =>
    setToasts((t) => {
      const m = MSG[t.length % MSG.length];
      return [{ id: Date.now(), ...m }, ...t].slice(0, 3);
    });
  return (
    <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 320, height: 150 }} aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -24, scale: 0.95 }}
              animate={{ opacity: 1 - i * 0.2, y: i * 14, scale: 1 - i * 0.05 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 10 - i }}
            >
              <Alert color={t.color} icon={<CheckCircle fontSize="small" />} onClose={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>
                {t.text}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
      <Button variant="soft" size="sm" onClick={push}>
        Show a toast
      </Button>
    </Stack>
  );
}

/** One card, both themes: drag across to reveal dark mode. */
function ThemeSplit() {
  const [pos, setPos] = React.useState(50);
  const card = (
    <Stack spacing={1.5} sx={{ p: 2.5, bgcolor: 'background.paper', color: 'text.primary', height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 700 }}>Notifications</Typography>
        <Chip size="xs" label="3 new" variant="soft" color="secondary" />
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Switch label="Email" defaultChecked size="sm" />
        <Switch label="Push" size="sm" />
      </Stack>
      <Slider aria-label="Volume" defaultValue={60} size="sm" />
      <Stack direction="row" spacing={1}>
        <Button size="sm" sx={{ flex: 1 }}>
          Save
        </Button>
        <Button size="sm" variant="ghost" sx={{ flex: 1 }}>
          Reset
        </Button>
      </Stack>
    </Stack>
  );
  return (
    <Box data-known-contrast sx={{ position: 'relative', width: '100%', maxWidth: 340, height: 190, borderRadius: 3, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
      <ThemeProvider theme={lightTheme}>
        <Box sx={{ position: 'absolute', inset: 0 }}>{card}</Box>
      </ThemeProvider>
      <ThemeProvider theme={darkTheme}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${pos}%)` }} inert>
          {card}
        </Box>
      </ThemeProvider>
      <Box aria-hidden sx={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 2, bgcolor: 'primary.main', pointerEvents: 'none' }} />
      <Box
        component="input"
        type="range"
        aria-label="Reveal dark theme"
        value={pos}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPos(Number(e.target.value))}
        sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 24, m: 0, opacity: 0, cursor: 'ew-resize' }}
      />
    </Box>
  );
}

/** Live star count from the GitHub API, with a link to star the repo. */
function StarsCard() {
  const stars = useGitHubStars();
  return (
    <Stack spacing={1.5} alignItems="center" textAlign="center">
      <motion.div whileHover={{ rotate: 18, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
        <StarRounded sx={{ fontSize: 56, color: colorPalette.warning[400] }} />
      </motion.div>
      {!!stars && (
        <Typography component="p" sx={{ fontWeight: 800, fontSize: 40, lineHeight: 1 }}>
          {formatStars(stars)}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary">
        {!stars ? 'Be one of the first to star it' : stars === 1 ? 'star on GitHub' : 'stars on GitHub'}
      </Typography>
      <Button component="a" href={SITE.github} rel="noopener" size="sm" variant="outlined" color="neutral">
        Star the repo
      </Button>
    </Stack>
  );
}

/** Token chips that lift on hover; the source of truth for every component. */
function Tokens() {
  const reduce = useReducedMotion();
  const keys = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;
  return (
    <Stack direction="row" spacing={-1.5} sx={{ '&:hover > *': { mx: 0.5 } }}>
      {keys.map((k, i) => (
        <motion.div
          key={k}
          whileHover={reduce ? undefined : { y: -10 }}
          style={{
            width: 56,
            height: 84,
            borderRadius: 14,
            background: `linear-gradient(180deg, ${colorPalette[k][300]}, ${colorPalette[k][600]})`,
            boxShadow: '0 10px 20px -10px rgba(15,23,42,.4)',
            border: '2px solid rgba(255,255,255,.7)',
            transition: 'margin .25s',
            zIndex: 6 - i,
          }}
        />
      ))}
    </Stack>
  );
}

export default function Bento() {
  return (
    <Stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 20 }}>
        <Tile title="Command menu" body="Type to filter the real catalog. Arrow keys and Enter work." span={{ md: 4 }} testId="bento-cmdk">
          <CommandMenu />
        </Tile>
        <Tile title="Open source" body="MIT licensed. Live count from the GitHub API." span={{ md: 2 }}>
          <StarsCard />
        </Tile>
        <Tile title="Notifications" body="Alerts with soft colors, stacked with spring motion." span={{ md: 2 }} testId="bento-toasts">
          <ToastStack />
        </Tile>
        <Tile title="Both themes, one card" body="Drag along the bottom edge to reveal darkTheme." span={{ md: 2 }}>
          <ThemeSplit />
        </Tile>
        <Tile title="Tokens first" body="Colors, radius, type and motion come from @sorbet-ui/tokens." span={{ md: 2 }}>
          <Tokens />
        </Tile>
    </Stagger>
  );
}
