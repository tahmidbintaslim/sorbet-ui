'use client';
// Sprinkle burst: candy confetti (dots, sprinkles and tiny scoops) pops out of its
// center, arcs and falls. transform/opacity only. Callers skip it for reduced motion.
// Bits are clipped to the burst's box, so a burst can never cause page scroll.
import * as React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { motion } from 'motion/react';
import { SCOOPS, scoop, type Scoop } from '@/lib/scoops';

type Bit = { x: number; y: number[]; rotate: number; shape: number; c: Scoop; delay: number };

function roll(count: number, min: number, max: number): Bit[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const r = min + Math.random() * (max - min);
    const y = Math.sin(a) * r * 0.75;
    return {
      x: Math.cos(a) * r,
      y: [0, y - max * 0.19, y + max * 0.25 + Math.random() * max * 0.19],
      rotate: (Math.random() - 0.5) * 720,
      shape: i % 3,
      c: SCOOPS[i % SCOOPS.length],
      delay: Math.random() * 0.06,
    };
  });
}

export default function Burst({
  count = 26,
  reach = [70, 160],
  scale = 1,
  testId,
  sx,
}: {
  count?: number;
  /** Min and max distance the bits fly, in px. */
  reach?: [number, number];
  scale?: number;
  testId?: string;
  sx?: SxProps<Theme>;
}) {
  // Rolled once per mounted burst: give each new burst its own `key`.
  const [bits] = React.useState(() => roll(count, reach[0], reach[1]));
  return (
    <Box
      aria-hidden
      data-testid={testId}
      sx={[
        { position: 'absolute', inset: 0, pointerEvents: 'none', display: 'grid', placeItems: 'center', overflow: 'hidden' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {bits.map((d, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
          animate={{ x: d.x, y: d.y, scale: [0.4, 1.15, 0.6], opacity: [1, 1, 0], rotate: d.rotate }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.4, 1], times: [0, 0.4, 1], delay: d.delay }}
          style={{
            position: 'absolute',
            width: (d.shape === 1 ? 14 : 10) * scale,
            height: (d.shape === 1 ? 5 : 10) * scale,
            borderRadius: d.shape === 2 ? '50% 50% 20% 20%' : 999,
            background: scoop(d.c, 'fill'),
          }}
        />
      ))}
    </Box>
  );
}
