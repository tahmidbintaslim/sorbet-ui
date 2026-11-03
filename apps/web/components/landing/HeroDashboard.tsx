'use client';
// Interactive dashboard in the hero, built only from Sorbet components.
// Visitors can switch tabs, toggle live data and watch a button morph through
// every variant. Data is clearly labeled as sample data.
import * as React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Avatar, Button, Card, Chip, Progress, Switch, Tabs } from '@sorbet-ui/react';
import { CountUp, EASE } from '../motion';
import { colorPalette } from '@sorbet-ui/tokens';

type TabId = 'revenue' | 'users' | 'orders';
const DATA: Record<TabId, { label: string; total: number; delta: string; bars: number[]; prefix: string }> = {
  revenue: { label: 'Revenue', total: 48210, delta: '+12.4%', prefix: '$', bars: [32, 48, 40, 66, 58, 80, 72, 94] },
  users: { label: 'Active users', total: 3184, delta: '+6.1%', prefix: '', bars: [50, 44, 62, 58, 70, 64, 82, 76] },
  orders: { label: 'Orders', total: 912, delta: '+3.8%', prefix: '', bars: [20, 36, 30, 52, 46, 60, 74, 68] },
};
const VARIANTS = ['solid', 'soft', 'outlined', 'dash', 'ghost', 'plain'] as const;
const BAR = [colorPalette.primary[400], colorPalette.secondary[400]];

export default function HeroDashboard() {
  const reduce = useReducedMotion();
  const [tab, setTab] = React.useState<TabId>('revenue');
  const [live, setLive] = React.useState(true);
  const [jitter, setJitter] = React.useState<number[]>(() => DATA.revenue.bars.map(() => 0));
  const [v, setV] = React.useState(0);
  const [hover, setHover] = React.useState(false);

  // "Live" data: nudge bars every 1.6s while the switch is on.
  React.useEffect(() => {
    if (!live || reduce) {
      setJitter((j) => j.map(() => 0));
      return;
    }
    const id = window.setInterval(() => setJitter((j) => j.map(() => Math.round(Math.random() * 16 - 8))), 1600);
    return () => window.clearInterval(id);
  }, [live, reduce]);

  // Morph a button through the variants; pauses while hovered.
  React.useEffect(() => {
    if (reduce || hover) return;
    const id = window.setInterval(() => setV((n) => (n + 1) % VARIANTS.length), 1800);
    return () => window.clearInterval(id);
  }, [reduce, hover]);

  const d = DATA[tab];
  return (
    <Card
      variant="outlined"
     
      data-testid="hero-dashboard"
      sx={{
        width: '100%',
        maxWidth: 520,
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        boxShadow: '0 30px 80px -30px rgba(15,23,42,.35)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar size="sm" status="online">AC</Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Acme dashboard</Typography>
            <Typography variant="caption" color="text.secondary">
              Sample data
            </Typography>
          </Box>
        </Stack>
        <Switch size="sm" label="Live" checked={live} onChange={(_, c) => setLive(c)} />
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Tabs
          size="sm"
          variant="soft"
          value={tab}
          onChange={(id) => setTab(id as TabId)}
          renderPanels={false}
          tabs={(Object.keys(DATA) as TabId[]).map((id) => ({ id, label: DATA[id].label }))}
        />
      </Box>

      <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mt: 2.5 }}>
        <Typography component="p" sx={{ fontWeight: 800, fontSize: 34, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          {d.prefix}
          <CountUp value={d.total} />
        </Typography>
        <Chip size="sm" variant="soft" color="success" label={d.delta} />
      </Stack>

      {/* Bars re-grow on tab change and wobble while live is on. */}
      <Box role="img" aria-label={`${d.label} over the last 8 weeks, sample data`} sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 120, mt: 2 }}>
        {d.bars.map((b, i) => (
          <motion.div
            key={`${tab}-${i}`}
            initial={reduce ? false : { height: 0 }}
            animate={{ height: `${Math.max(8, Math.min(100, b + jitter[i]))}%` }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : i * 0.03 }}
            style={{
              flex: 1,
              borderRadius: 8,
              background: `linear-gradient(180deg, ${BAR[0]}, ${BAR[1]})`,
              opacity: i === d.bars.length - 1 ? 1 : 0.55 + i * 0.05,
            }}
          />
        ))}
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            Quarterly goal
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            72%
          </Typography>
        </Stack>
        <Box sx={{ mt: 0.75 }}>
          <Progress value={72} size="sm" aria-label="Quarterly goal, 72 percent" />
        </Box>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ mt: 2.5, pt: 2, borderTop: 1, borderColor: 'divider' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <LayoutGroup>
          <Box component="span" sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" component="span">
              variant=
            </Typography>
            <AnimatePresence mode="wait" initial={false}>
              <motion.code
                key={VARIANTS[v]}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}
              >
                &quot;{VARIANTS[v]}&quot;
              </motion.code>
            </AnimatePresence>
          </Box>
          <motion.div layout transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
            <Button variant={VARIANTS[v]} size="sm" onClick={() => setV((n) => (n + 1) % VARIANTS.length)}>
              Export report
            </Button>
          </motion.div>
        </LayoutGroup>
      </Stack>
    </Card>
  );
}
