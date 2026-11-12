'use client';
// Hand-drawn ink: SVG strokes that draw themselves, one after another, the first
// time they scroll into view (like a pen signing its name). Pure CSS: every path
// has pathLength=1 and animates stroke-dashoffset 1 -> 0, so there is no script
// cost per frame. Decorative only (aria-hidden). With reduced motion the drawing
// is simply shown finished.
import * as React from 'react';
import { Box } from '@mui/material';
import { keyframes, type SxProps, type Theme } from '@mui/material/styles';
import { useInView } from 'motion/react';
import { scoop, type Scoop } from '@/lib/scoops';

const draw = keyframes`
  0% { stroke-dashoffset: 1; opacity: 0; }
  2% { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 1; }
`;

export type Stroke = { d: string; c?: Scoop; w?: number; neutral?: boolean };

export default function Ink({
  strokes,
  viewBox,
  c = 'primary',
  width = 4,
  duration = 1.2,
  delay = 0,
  stretch = false,
  tone = 'fill',
  sx,
}: {
  /** One entry per pen stroke, in drawing order. */
  strokes: (string | Stroke)[];
  viewBox: string;
  /** Default ink color. */
  c?: Scoop;
  width?: number;
  /** Seconds for the whole drawing. */
  duration?: number;
  delay?: number;
  /** Stretch to fill its box (for circling a word of any width). */
  stretch?: boolean;
  /** `fill` is the soft marker color; `ink` is the darker pen for small drawings. */
  tone?: 'fill' | 'ink';
  sx?: SxProps<Theme>;
}) {
  const ref = React.useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const step = duration / strokes.length;
  return (
    <Box
      component="svg"
      ref={ref}
      aria-hidden
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio={stretch ? 'none' : undefined}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      sx={[{ display: 'block', overflow: 'visible', pointerEvents: 'none' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {strokes.map((s, i) => {
        const st = typeof s === 'string' ? { d: s } : s;
        return (
          <Box
            component="path"
            key={i}
            d={st.d}
            pathLength={1}
            stroke={st.neutral ? 'currentColor' : scoop(st.c ?? c, tone)}
            strokeWidth={st.w ?? width}
            sx={{
              strokeDasharray: 1,
              animation: `${draw} ${step}s ease-in-out ${delay + i * step}s both`,
              animationPlayState: seen ? 'running' : 'paused',
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          />
        );
      })}
    </Box>
  );
}

// A loose oval, the way you would circle a word with a marker (it overshoots).
export const CIRCLE = ['M 24 44 C 14 12, 150 0, 186 28 C 208 50, 150 80, 88 76 C 34 72, 0 58, 20 32 C 30 20, 62 10, 104 9'];
// A curly arrow from a note toward something on its right.
export const ARROW = ['M 6 40 C 30 4, 70 6, 68 34 C 66 54, 40 48, 48 30 C 58 8, 104 14, 124 44', 'M 108 40 L 125 46 L 126 27'];
