'use client';
// Ice-cream shop doodles, one per site section. Each is a handful of pen strokes in
// a 100x100 box, drawn with <Ink> so it sketches itself once and then stays put
// (finished from the start under reduced motion). Decorative only.
import { Box, type SxProps, type Theme } from '@mui/material';
import Ink, { type Stroke } from './Ink';
import { Sticker } from './Decor';
import type { Scoop } from '@/lib/scoops';

export type DoodleName = 'cone' | 'popsicle' | 'jar' | 'waffle' | 'sundae' | 'emptyCone';

// `f` is the section flavor; the other colors are fixed so a cone always reads as a cone.
const DOODLES: Record<DoodleName, (f: Scoop) => Stroke[]> = {
  cone: (f) => [
    { d: 'M26 46 C20 12 80 12 74 46', c: f },
    { d: 'M23 46 Q30 55 37 47 Q44 55 50 47 Q56 55 63 47 Q70 55 77 46', c: f },
    { d: 'M30 54 L50 93 L70 54', c: 'warning' },
    { d: 'M39 59 L57 79', c: 'warning', w: 3 },
    { d: 'M61 59 L43 79', c: 'warning', w: 3 },
    { d: 'M42 27 L48 23', c: 'danger' },
    { d: 'M58 28 L62 34', c: 'primary' },
  ],
  popsicle: (f) => [
    { d: 'M31 60 L31 32 C31 6 69 6 69 32 L69 60 Z', c: f },
    { d: 'M42 24 L42 46', c: f, w: 3 },
    { d: 'M45 61 L45 86 C45 93 55 93 55 86 L55 61', c: 'warning' },
    { d: 'M69 46 C76 47 77 56 72 60', c: 'danger', w: 3 },
    { d: 'M17 22 L23 18', c: 'secondary' },
    { d: 'M80 20 L84 26', c: 'success' },
  ],
  jar: (f) => [
    { d: 'M33 16 L67 16 L67 27 L33 27 Z', c: 'danger' },
    { d: 'M37 27 C24 34 25 42 25 50 L25 82 C25 89 30 91 37 91 L63 91 C70 91 75 89 75 82 L75 50 C75 42 76 34 63 27', c: f },
    { d: 'M35 62 L42 58', c: 'danger' },
    { d: 'M50 54 L56 59', c: 'primary' },
    { d: 'M60 70 L66 65', c: 'success' },
    { d: 'M38 77 L46 79', c: 'secondary' },
    { d: 'M53 80 L60 77', c: 'info' },
    { d: 'M40 44 L44 49', c: 'success' },
    { d: 'M59 44 L64 41', c: 'secondary' },
  ],
  waffle: (f) => [
    { d: 'M24 18 L76 18 C82 18 84 20 84 26 L84 76 C84 82 82 84 76 84 L24 84 C18 84 16 82 16 76 L16 26 C16 20 18 18 24 18', c: 'warning' },
    { d: 'M39 20 L39 82', c: 'warning', w: 3 },
    { d: 'M61 20 L61 82', c: 'warning', w: 3 },
    { d: 'M18 40 L82 40', c: 'warning', w: 3 },
    { d: 'M18 62 L82 62', c: 'warning', w: 3 },
    { d: 'M14 30 C26 20 34 36 46 28 S66 30 72 22 S86 26 88 34 C89 42 80 44 80 52', c: f, w: 5 },
  ],
  sundae: (f) => [
    { d: 'M38 34 C34 12 66 12 62 34', c: 'danger' },
    { d: 'M27 48 C24 30 46 28 50 44', c: f },
    { d: 'M50 44 C54 28 76 30 73 48', c: 'warning' },
    { d: 'M20 49 L80 49 C80 66 67 75 50 75 C33 75 20 66 20 49', c: 'info' },
    { d: 'M50 75 L50 87', c: 'info' },
    { d: 'M36 89 L64 89', c: 'info' },
    { d: 'M50 16 C52 8 58 5 62 7', c: 'success', w: 3 },
  ],
  emptyCone: (f) => [
    { d: 'M28 40 Q50 50 72 40', c: 'warning' },
    { d: 'M28 40 L50 92 L72 40', c: 'warning' },
    { d: 'M38 53 L58 74', c: 'warning', w: 3 },
    { d: 'M62 53 L42 74', c: 'warning', w: 3 },
    { d: 'M42 24 C42 12 58 12 58 21 C58 27 50 26 50 33', c: f },
    { d: 'M50 39 L50 40', c: f, w: 5 },
  ],
};

export default function Doodle({
  name,
  flavor,
  sticker = true,
  delay = 0.15,
  sx,
}: {
  name: DoodleName;
  flavor: Scoop;
  /** Pastel sticker badge behind the drawing. */
  sticker?: boolean;
  delay?: number;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      aria-hidden
      data-testid="doodle"
      data-doodle={name}
      sx={[{ position: 'relative', width: 120, aspectRatio: '1', flexShrink: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {sticker && <Sticker c={flavor} rotate={-8} />}
      <Ink
        viewBox="0 0 100 100"
        strokes={DOODLES[name](flavor)}
        c={flavor}
        tone="ink"
        width={4}
        duration={1.4}
        delay={delay}
        sx={{ position: 'absolute', inset: sticker ? '15%' : 0, width: sticker ? '70%' : '100%', height: sticker ? '70%' : '100%' }}
      />
    </Box>
  );
}
