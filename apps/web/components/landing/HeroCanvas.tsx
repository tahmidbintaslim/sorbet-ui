'use client';
// Hero backdrop: a fine grid that fades out at the edges, two soft color fields,
// and a glow that follows the pointer (spring-smoothed). Purely decorative.
import * as React from 'react';
import { Box } from '@mui/material';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

export default function HeroCanvas({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(70), { stiffness: 120, damping: 20 });
  const y = useSpring(useMotionValue(20), { stiffness: 120, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${x}% ${y}%, var(--hero-glow), transparent 70%)`;

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 100);
    y.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <Box
      ref={ref}
      component="section"
      onPointerMove={onMove}
      sx={(t) => ({
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        '--hero-glow': t.palette.mode === 'dark' ? 'rgba(56,189,248,.18)' : 'rgba(14,165,233,.16)',
        '--hero-line': t.palette.mode === 'dark' ? 'rgba(148,163,184,.10)' : 'rgba(15,23,42,.06)',
      })}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage:
            'linear-gradient(var(--hero-line) 1px, transparent 1px), linear-gradient(90deg, var(--hero-line) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, #000 40%, transparent 100%)',
        }}
      />
      <Box
        aria-hidden
        sx={(t) => ({
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(90px)',
            opacity: t.palette.mode === 'dark' ? 0.28 : 0.4,
          },
          '&::before': { width: 520, height: 520, top: -180, right: -60, bgcolor: '#7dd3fc' },
          '&::after': { width: 460, height: 460, top: 160, left: -160, bgcolor: '#f0abfc' },
        })}
      />
      {!reduce && (
        <motion.div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, background: glow }} />
      )}
      {children}
    </Box>
  );
}
