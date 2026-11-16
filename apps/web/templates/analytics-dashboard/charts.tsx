'use client';
// Hand-written SVG charts: no chart library. The area chart sizes itself to its
// container, shows a crosshair and tooltip on hover or touch, and can be read with
// the arrow keys. Text uses the theme's text colors; only the marks carry the accent.
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, useReducedMotion } from 'motion/react';
import { colorPalette } from '@sorbet-ui/tokens';
import type { Accent } from './data';

/** Mark color for an accent: darker on light surfaces, lighter on dark ones. */
export function useMarkColor(accent: Accent) {
  const dark = useTheme().palette.mode === 'dark';
  return { line: colorPalette[accent][dark ? 400 : 600], soft: colorPalette[accent][dark ? 400 : 500], dark };
}

// False for the server render and the first client render, so charts are fully drawn in
// the static HTML; later data changes animate in.
function useAnimateChanges() {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => setOn(true), []);
  return on;
}

const SR_ONLY = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const;

// 1, 2, 2.5 or 5 times a power of ten: axis maximums people can read.
function niceMax(value: number) {
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * pow >= value) ?? 10;
  return step * pow;
}

export type AreaChartProps = {
  /** Accessible name, e.g. "Revenue per day, last 30 days". */
  label: string;
  values: number[];
  /** The period before, drawn as a dashed line. */
  compare: number[];
  /** One label per point (dates). */
  labels: string[];
  accent: Accent;
  format: (n: number) => string;
  height?: number;
};

export function AreaChart({ label, values, compare, labels, accent, format, height = 264 }: AreaChartProps) {
  const reduce = useReducedMotion();
  const theme = useTheme();
  const { line, dark } = useMarkColor(accent);
  const wrap = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(720);
  const [active, setActive] = React.useState<number | null>(null);
  const gradient = React.useId();
  const animateIn = useAnimateChanges();

  React.useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pad = { top: 12, right: 12, bottom: 28, left: 48 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const n = values.length;
  const max = niceMax(Math.max(...values, ...compare));
  const x = (i: number) => pad.left + (n === 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v: number) => pad.top + h - (v / max) * h;
  const path = (list: number[]) => list.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const area = `${path(values)}L${x(n - 1).toFixed(1)},${pad.top + h}L${x(0).toFixed(1)},${pad.top + h}Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1].map((t) => max * t);
  // About one date label per 110px, always including the first and last point.
  const tickCount = Math.max(2, Math.min(n, Math.floor(w / 110) + 1));
  const ticks = Array.from({ length: tickCount }, (_, i) => Math.round((i / (tickCount - 1)) * (n - 1)));
  const muted = theme.palette.text.secondary;
  const rule = dark ? 'rgba(148,163,184,.18)' : 'rgba(15,23,42,.08)';

  const fromPointer = (e: React.PointerEvent) => {
    const box = wrap.current!.getBoundingClientRect();
    const t = (e.clientX - box.left - pad.left) / w;
    setActive(Math.max(0, Math.min(n - 1, Math.round(t * (n - 1)))));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const at = active ?? n - 1;
    const next = { ArrowLeft: at - 1, ArrowRight: at + 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) {
      if (e.key === 'Escape') setActive(null);
      return;
    }
    e.preventDefault();
    setActive(Math.max(0, Math.min(n - 1, next)));
  };

  const tipLeft = active === null ? 0 : x(active);
  const flip = tipLeft > width * 0.6;

  return (
    <Box>
      <Box
        ref={wrap}
        role="group"
        aria-roledescription="chart"
        aria-label={`${label}. Use the left and right arrow keys to read each point.`}
        tabIndex={0}
        data-testid="area-chart"
        data-points={n}
        onPointerMove={fromPointer}
        onPointerDown={fromPointer}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive((a) => a ?? n - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
        sx={{ position: 'relative', height, touchAction: 'pan-y', cursor: 'crosshair', borderRadius: '10px', outlineOffset: 4, '&:focus-visible': { outline: `2px solid ${line}` } }}
      >
        <svg width={width} height={height} aria-hidden style={{ display: 'block', maxWidth: '100%' }}>
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line} stopOpacity={dark ? 0.32 : 0.22} />
              <stop offset="100%" stopColor={line} stopOpacity={0} />
            </linearGradient>
          </defs>
          {grid.map((g) => (
            <g key={g}>
              <line x1={pad.left} x2={width - pad.right} y1={y(g)} y2={y(g)} stroke={rule} />
              <text x={pad.left - 10} y={y(g) + 4} textAnchor="end" fontSize="11" fill={muted} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {format(g)}
              </text>
            </g>
          ))}
          {ticks.map((i, k) => (
            <text key={i} x={x(i)} y={height - 8} fontSize="11" fill={muted} textAnchor={k === 0 ? 'start' : k === ticks.length - 1 ? 'end' : 'middle'}>
              {labels[i]}
            </text>
          ))}
          <path d={path(compare)} fill="none" stroke={muted} strokeOpacity={0.55} strokeWidth={1.5} strokeDasharray="4 5" strokeLinecap="round" />
          <motion.path key={`a-${n}`} d={area} fill={`url(#${gradient})`} initial={animateIn ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.25 }} />
          <motion.path
            key={`l-${n}`}
            d={path(values)}
            fill="none"
            stroke={line}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={animateIn ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          {active !== null && (
            <g>
              <line x1={x(active)} x2={x(active)} y1={pad.top} y2={pad.top + h} stroke={muted} strokeOpacity={0.5} />
              <circle cx={x(active)} cy={y(compare[active])} r={3.5} fill={theme.palette.background.paper} stroke={muted} strokeWidth={1.5} />
              <circle cx={x(active)} cy={y(values[active])} r={5} fill={line} stroke={theme.palette.background.paper} strokeWidth={2} />
            </g>
          )}
        </svg>
        {active !== null && (
          <Box
            data-testid="chart-tooltip"
            sx={{
              position: 'absolute',
              top: 8,
              left: tipLeft,
              transform: flip ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
              pointerEvents: 'none',
              minWidth: 148,
              px: 1.5,
              py: 1,
              borderRadius: '10px',
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: dark ? '0 8px 24px rgba(0,0,0,.5)' : '0 8px 24px rgba(15,23,42,.12)',
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{labels[active]}</Typography>
            <TipRow swatch={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: line }} />} name="This period" value={format(values[active])} />
            <TipRow swatch={<Box sx={{ width: 10, borderTop: '2px dashed', borderColor: 'text.secondary' }} />} name="Previous" value={format(compare[active])} />
          </Box>
        )}
        <Box component="span" aria-live="polite" sx={SR_ONLY}>
          {active !== null ? `${labels[active]}: ${format(values[active])}, previous period ${format(compare[active])}` : ''}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2.5, mt: 1.5, pl: `${pad.left}px` }}>
        <Legend swatch={<Box sx={{ width: 14, height: 3, borderRadius: '10px', bgcolor: line }} />} name="This period" />
        <Legend swatch={<Box sx={{ width: 14, borderTop: '2px dashed', borderColor: 'text.secondary' }} />} name="Previous period" />
      </Box>
    </Box>
  );
}

function TipRow({ swatch, name, value }: { swatch: React.ReactNode; name: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, fontSize: 12 }}>
      {swatch}
      <Box component="span" sx={{ color: 'text.secondary', flex: 1 }}>
        {name}
      </Box>
      <Box component="span" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Box>
    </Box>
  );
}

function Legend({ swatch, name }: { swatch: React.ReactNode; name: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 12, color: 'text.secondary' }}>
      {swatch}
      {name}
    </Box>
  );
}

/** Horizontal bars with the value and share written next to each one. */
export function BarList({ items, accent, format }: { items: { name: string; value: number }[]; accent: Accent; format: (n: number) => string }) {
  const { soft, dark } = useMarkColor(accent);
  const reduce = useReducedMotion();
  const animateIn = useAnimateChanges();
  const total = items.reduce((a, b) => a + b.value, 0);
  const max = Math.max(...items.map((i) => i.value));
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1.75 }}>
      {items.map((item, i) => (
        <Box component="li" key={item.name}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, fontSize: 13 }}>
            <Box component="span" sx={{ flex: 1, minWidth: 0, fontWeight: 600 }}>
              {item.name}
            </Box>
            <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
              {format(item.value)}
            </Box>
            <Box component="span" sx={{ width: 36, textAlign: 'right', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
              {Math.round((item.value / total) * 100)}%
            </Box>
          </Box>
          <Box aria-hidden sx={{ mt: 0.75, height: 8, borderRadius: '4px', bgcolor: dark ? 'rgba(148,163,184,.14)' : 'rgba(15,23,42,.06)', overflow: 'hidden' }}>
            <motion.div
              key={item.value}
              initial={animateIn ? { width: 0 } : false}
              animate={{ width: `${(item.value / max) * 100}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', borderRadius: 4, background: soft, opacity: 1 - i * 0.14 }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/** Tiny trend line for a KPI card. Decorative: the number beside it carries the value. */
export function Sparkline({ values, accent, width = 96, height = 32 }: { values: number[]; accent: Accent; width?: number; height?: number }) {
  const { line } = useMarkColor(accent);
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const points = values.map((v, i) => `${((i / (values.length - 1)) * width).toFixed(1)},${(height - 3 - ((v - min) / span) * (height - 6)).toFixed(1)}`).join(' ');
  return (
    <svg aria-hidden width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={line} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
