'use client';
// Small decorative pieces for the sorbet look: drifting blurred blobs, scalloped
// section edges, sticker badges and springy wrappers. All decoration is aria-hidden,
// animates transform/opacity only and stops for reduced motion.
import * as React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { motion } from 'motion/react';
import { NO_MOTION, scoop, type Scoop } from '@/lib/scoops';
import { SPRING, useOnScreen } from '../motion';

const drift = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  33% { transform: translate3d(6%, -8%, 0) scale(1.08); }
  66% { transform: translate3d(-5%, 6%, 0) scale(.94); }
`;

export type Blob = { c: Scoop; size: number | string; top?: string; left?: string; right?: string; bottom?: string; delay?: number };

/** Blurred scoop-colored blobs drifting behind a section. Clipped by the parent. */
export function ScoopBlobs({ blobs, opacity = { light: 0.7, dark: 0.28 } }: { blobs: Blob[]; opacity?: { light: number; dark: number } }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  return (
    <Box ref={ref} aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {blobs.map((b, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            width: b.size,
            aspectRatio: '1',
            borderRadius: '50%',
            bgcolor: scoop(b.c, 'glow'),
            filter: 'blur(48px)',
            opacity: opacity.light,
            '[data-mode="dark"] &': { opacity: opacity.dark },
            willChange: 'transform',
            animation: `${drift} ${16 + i * 3}s ease-in-out ${-(b.delay ?? i * 2.5)}s infinite`,
            animationPlayState: onScreen ? 'running' : 'paused',
            ...NO_MOTION,
          }}
        />
      ))}
    </Box>
  );
}

// Scalloped edges as a CSS mask, so any background (gradients included) gets a
// scoop-rim top and a drippy bottom. `r` is the scallop radius in px.
export function scallopMask({ top = true, bottom = true, r = 18 }: { top?: boolean; bottom?: boolean; r?: number } = {}) {
  const d = r * 2;
  const layers: string[] = [];
  const sizes: string[] = [];
  const pos: string[] = [];
  const rep: string[] = [];
  if (top) {
    layers.push(`radial-gradient(circle at 50% 100%, #000 ${r - 0.5}px, transparent ${r}px)`);
    sizes.push(`${d}px ${r}px`);
    pos.push('0 0');
    rep.push('repeat-x');
  }
  if (bottom) {
    layers.push(`radial-gradient(circle at 50% 0, #000 ${r - 0.5}px, transparent ${r}px)`);
    sizes.push(`${d}px ${r}px`);
    pos.push('0 100%');
    rep.push('repeat-x');
  }
  layers.push('linear-gradient(#000, #000)');
  sizes.push(`100% calc(100% - ${(top ? r : 0) + (bottom ? r : 0) - 2}px)`);
  pos.push(`0 ${top ? r - 1 : 0}px`);
  rep.push('no-repeat');
  const mask = {
    maskImage: layers.join(', '),
    maskSize: sizes.join(', '),
    maskPosition: pos.join(', '),
    maskRepeat: rep.join(', '),
  };
  return {
    ...mask,
    WebkitMaskImage: mask.maskImage,
    WebkitMaskSize: mask.maskSize,
    WebkitMaskPosition: mask.maskPosition,
    WebkitMaskRepeat: mask.maskRepeat,
  };
}

/** Points of a scalloped badge (a "sticker"), as an SVG path in a 100x100 box. */
function stickerPath(bumps = 12, r = 44, depth = 4.5) {
  const pts: string[] = [];
  const n = bumps * 8;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r + depth * Math.cos(a * bumps);
    pts.push(`${(50 + rr * Math.cos(a)).toFixed(2)},${(50 + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}
const STICKER = stickerPath();

/** Scalloped sticker shape behind content (decorative). */
export function Sticker({ c, rotate = 0, sx }: { c: Scoop; rotate?: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="svg"
      aria-hidden
      viewBox="0 0 100 100"
      className="sticker"
      sx={[{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', transform: `rotate(${rotate}deg)`, zIndex: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <path d={STICKER} fill={scoop(c, 'pastel')} />
      <path d={STICKER} fill="none" stroke={scoop(c, 'fill')} strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" transform="translate(50 50) scale(.86) translate(-50 -50)" />
    </Box>
  );
}

/** Springy wrapper for buttons: a small bounce on hover, a squish on press. */
export function Springy({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div
      style={{ display: 'inline-flex', ...style }}
      whileHover={{ y: -3, scale: 1.04, rotate: -1 }}
      whileTap={{ scale: 0.96, y: 0, rotate: 0 }}
      transition={{ ...SPRING, stiffness: 420, damping: 14 }}
    >
      {children}
    </motion.div>
  );
}

/** A little row of scoops: decorative divider for the footer and bands. */
export function ScoopRow({ size = 22, sx }: { size?: number; sx?: SxProps<Theme> }) {
  const flavors: Scoop[] = ['danger', 'warning', 'success', 'primary', 'secondary', 'info'];
  return (
    <Box aria-hidden sx={[{ display: 'flex', gap: `${size * 0.25}px`, alignItems: 'flex-end' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {flavors.map((f, i) => (
        <Box
          key={f}
          component="svg"
          viewBox="0 0 24 30"
          sx={{
            width: size,
            height: size * 1.25,
            transformOrigin: '50% 100%',
            transition: 'transform .35s cubic-bezier(.3,1.8,.5,1)',
            '&:hover': { transform: `translateY(-4px) rotate(${i % 2 ? 8 : -8}deg)` },
            ...NO_MOTION,
          }}
        >
          <circle cx="12" cy="11" r="10" fill={scoop(f, 'fill')} />
          <path d="M4 15 a4 4 0 0 0 8 0 a4 4 0 0 0 8 0 L 20 16 L12 29 L4 16Z" fill={scoop(f, 'fill')} />
          <path d="M5 17 L19 17 L12 29Z" fill={scoop('warning', 'fill')} opacity=".95" />
          <ellipse cx="8" cy="7" rx="3" ry="1.8" fill="#fff" opacity=".5" transform="rotate(-30 8 7)" />
        </Box>
      ))}
    </Box>
  );
}

const spin = keyframes`
  to { transform: translate(-50%, -50%) rotate(1turn); }
`;
const RAINBOW: Scoop[] = ['danger', 'warning', 'success', 'info', 'primary', 'secondary', 'danger'];

/** Animated rainbow ring around a pill button: a rotating conic gradient, clipped. */
export function RainbowBorder({ children, width = 3 }: { children: React.ReactNode; width?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        p: `${width}px`,
        borderRadius: 999,
        overflow: 'hidden',
        isolation: 'isolate',
        boxShadow: `0 12px 28px -14px ${scoop('secondary', 'fill')}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300%',
          aspectRatio: '1',
          zIndex: -1,
          transform: 'translate(-50%, -50%)',
          background: `conic-gradient(${RAINBOW.map((s) => scoop(s, 'fill')).join(', ')})`,
          animation: `${spin} 4s linear infinite`,
          animationPlayState: onScreen ? 'running' : 'paused',
          ...NO_MOTION,
        },
      }}
    >
      {children}
    </Box>
  );
}

const sweep = keyframes`
  from { transform: translateX(-130%) skewX(-20deg); }
  to { transform: translateX(260%) skewX(-20deg); }
`;

/** Glossy shimmer that sweeps across a round parent when a `.shine-host` ancestor is hovered or focused. */
export function Shine() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: '8%',
        borderRadius: '50%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '40%',
          background: 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.55), transparent)',
          transform: 'translateX(-130%) skewX(-20deg)',
        },
        '.shine-host:hover &::after, .shine-host:focus-visible &::after': { animation: `${sweep} .9s ease-out` },
        '[data-mode="dark"] &::after': { background: 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.14), transparent)' },
        '@media (prefers-reduced-motion: reduce)': { display: 'none' },
      }}
    />
  );
}

const ALL_FILLS = (['danger', 'warning', 'success', 'info', 'primary', 'secondary'] as Scoop[]).map((s) => scoop(s, 'fill'));

/** Candy frame: a thick gradient border in every flavor around a display case. */
export function CandyFrame({ children, sx, innerSx }: { children: React.ReactNode; sx?: SxProps<Theme>; innerSx?: SxProps<Theme> }) {
  return (
    <Box sx={[{ p: '5px', borderRadius: '22px', background: `linear-gradient(135deg, ${ALL_FILLS.join(', ')})` }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={[{ height: '100%', borderRadius: '17px', bgcolor: 'background.default', overflow: 'hidden' }, ...(Array.isArray(innerSx) ? innerSx : [innerSx])]}>
        {children}
      </Box>
    </Box>
  );
}

// Melted edge: a flat top with drips of different lengths, tiled as a mask.
const DRIP =
  'M0 0H240V10C232 10 232 30 222 30C212 30 214 12 204 12C194 12 196 22 186 22C176 22 178 10 166 10C154 10 158 36 146 36C134 36 138 14 126 14C116 14 118 24 108 24C98 24 100 10 88 10C76 10 80 28 70 28C60 28 62 12 50 12C40 12 42 20 32 20C22 20 24 10 12 10C6 10 4 10 0 10Z';
const DRIP_MASK = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='40'><path d='${DRIP}'/></svg>`)}")`;

/** A strip of melting sorbet in every flavor, dripping down from its top edge. */
export function Drips({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Box
      aria-hidden
      data-testid="drips"
      sx={[
        {
          height: 40,
          background: `linear-gradient(90deg, ${[...ALL_FILLS, ALL_FILLS[0]].join(', ')})`,
          maskImage: DRIP_MASK,
          WebkitMaskImage: DRIP_MASK,
          maskRepeat: 'repeat-x',
          WebkitMaskRepeat: 'repeat-x',
          maskPosition: '50% 0',
          WebkitMaskPosition: '50% 0',
          pointerEvents: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

/** A small scoop-shaped dot: the flavor mark used in lists and pickers. */
export function ScoopDot({ c, size = 12, sx }: { c: Scoop | 'neutral'; size?: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      aria-hidden
      component="span"
      className="scoop-dot"
      sx={[
        {
          display: 'inline-block',
          flexShrink: 0,
          width: size,
          height: size,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          bgcolor: c === 'neutral' ? 'text.disabled' : scoop(c, 'fill'),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

/** A sticker with a short handwritten label on it (a count, "Free"). */
export function StickerBadge({ c, children, size = 46, rotate = 8, sx }: { c: Scoop; children: React.ReactNode; size?: number; rotate?: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      component="span"
      className="sticker-badge"
      sx={[{ position: 'relative', display: 'grid', placeItems: 'center', flexShrink: 0, width: size, height: size, rotate: `${rotate}deg` }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Sticker c={c} />
      <Box
        component="span"
        sx={{ position: 'relative', zIndex: 1, fontFamily: 'var(--font-hand), cursive', fontWeight: 700, fontSize: Math.round(size * 0.48), lineHeight: 1, color: scoop(c, 'ink') }}
      >
        {children}
      </Box>
    </Box>
  );
}
