'use client';
// Stats tile: the number counts to its new value and the sparkline morphs when the
// range changes.
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'motion/react';
import { Chip, Tabs } from '@sorbet-ui/react';
import { CountUp } from '../../motion';

const RANGES = {
  '7d': { label: 'last 7 days', value: 1284, delta: 12, points: [20, 34, 28, 46, 40, 58, 52, 70, 64, 82, 76, 90] },
  '30d': { label: 'last 30 days', value: 5310, delta: 8, points: [40, 36, 50, 44, 60, 48, 66, 72, 58, 80, 74, 86] },
  '90d': { label: 'last 90 days', value: 14870, delta: -3, points: [70, 78, 66, 82, 74, 60, 68, 52, 62, 48, 58, 54] },
} as const;
type Range = keyof typeof RANGES;

const path = (pts: readonly number[]) => pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * 100} ${100 - v}`).join(' ');

export default function Stats() {
  const [range, setRange] = React.useState<Range>('7d');
  const id = React.useId();
  const r = RANGES[range];
  const up = r.delta >= 0;
  const line = path(r.points);
  return (
    <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
      <Box sx={(t) => ({ width: '100%', maxWidth: 320, p: 2.5, borderRadius: '20px', bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}`, boxShadow: '0 1px 2px rgb(15 23 42 / 0.05), 0 18px 36px -18px rgb(15 23 42 / 0.25)' })}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography id={`${id}-t`} sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>
            Scoops sold
          </Typography>
          <Box sx={{ width: 150 }}>
            <Tabs
              aria-label="Range"
              size="xs"
              variant="solid"
              color="primary"
              fullWidth
              renderPanels={false}
              value={range}
              onChange={(v) => setRange(v as Range)}
              tabs={(Object.keys(RANGES) as Range[]).map((k) => ({ id: k, label: k }))}
              sx={{ '& .MuiTab-root': { minWidth: 0, px: 0.5 } }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1.5 }}>
          <Typography data-testid="stats-value" sx={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            <CountUp value={r.value} />
          </Typography>
          <Chip
            size="xs"
            variant="soft"
            color={up ? 'success' : 'danger'}
            label={`${up ? '+' : ''}${r.delta}%`}
            disableAnimation
          />
        </Box>
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: 0.5 }}>{r.label}</Typography>
        <Box component="svg" role="img" aria-label={`Trend, ${r.label}: ${up ? 'up' : 'down'} ${Math.abs(r.delta)} percent`} viewBox="0 0 100 100" preserveAspectRatio="none" sx={{ display: 'block', width: '100%', height: 84, mt: 2, overflow: 'visible', color: up ? 'success.main' : 'error.main' }}>
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".25" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path initial={false} animate={{ d: `${line} L100 100 L0 100Z` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} fill={`url(#${id}-g)`} />
          <motion.path initial={false} animate={{ d: line }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </Box>
      </Box>
    </Box>
  );
}
