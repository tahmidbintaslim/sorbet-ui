'use client';
// Hero illustration: three sorbet scoops on a waffle cone, all token colors.
// The cone bobs gently; hovering (or tapping) it makes the scoops wobble.
// Decorative only, so it is hidden from assistive tech.
import * as React from 'react';
import { Box } from '@mui/material';
import { motion } from 'motion/react';
import { keyframes } from '@mui/material/styles';
import { colorPalette, DARK_INK } from '@sorbet-ui/tokens';
import { NO_MOTION, scoop, type Scoop } from '@/lib/scoops';
import { useOnScreen } from '../motion';

const bob = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-14px) rotate(2deg); }
`;
const wobble = keyframes`
  0% { transform: rotate(0) scale(1); }
  20% { transform: rotate(-7deg) scale(1.05, .95); }
  45% { transform: rotate(5deg) scale(.97, 1.04); }
  70% { transform: rotate(-2deg) scale(1.01); }
  100% { transform: rotate(0) scale(1); }
`;
const twinkle = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); opacity: .9; }
  50% { transform: translateY(-8px) rotate(40deg); opacity: .5; }
`;

// A scoop: a round top plus a scalloped rim where it sits on what is below.
function ScoopShape({ cx, cy, r, flavor, className, children }: { cx: number; cy: number; r: number; flavor: Scoop; className: string; children?: React.ReactNode }) {
  const bumps = 6;
  const rimY = cy + r * 0.62;
  const span = r * 1.9;
  const br = span / bumps / 2 + 1.5;
  return (
    <g className={`scoop ${className}`}>
      {/* soft shadow on the layer below */}
      <ellipse cx={cx} cy={rimY + br * 0.9} rx={r * 0.95} ry={br * 0.6} fill={DARK_INK} opacity=".12" />
      <circle cx={cx} cy={cy} r={r} fill={scoop(flavor, 'fill')} />
      {Array.from({ length: bumps }, (_, i) => (
        <circle key={i} cx={cx - span / 2 + br - 1.5 + i * (span / bumps)} cy={rimY} r={br} fill={scoop(flavor, 'fill')} />
      ))}
      {/* shine */}
      <ellipse cx={cx - r * 0.38} cy={cy - r * 0.42} rx={r * 0.26} ry={r * 0.15} transform={`rotate(-30 ${cx - r * 0.38} ${cy - r * 0.42})`} fill="#fff" opacity=".55" />
      <circle cx={cx + r * 0.42} cy={cy - r * 0.05} r={r * 0.06} fill="#fff" opacity=".45" />
      {children}
    </g>
  );
}

const SPRINKLES: { x: number; y: number; r: number; c: Scoop }[] = [
  { x: 106, y: 36, r: -30, c: 'warning' },
  { x: 128, y: 30, r: 20, c: 'info' },
  { x: 140, y: 46, r: -60, c: 'danger' },
  { x: 116, y: 52, r: 70, c: 'success' },
  { x: 96, y: 50, r: 10, c: 'primary' },
];

export default function SorbetCone({ size = 300 }: { size?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  const [wobbling, setWobbling] = React.useState(false);
  const waffle = `waffle-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <Box
      ref={ref}
      aria-hidden
      data-testid="sorbet-cone"
      onPointerEnter={() => setWobbling(true)}
      onAnimationEnd={(e) => {
        if (e.animationName && (e.target as Element).classList.contains('top')) setWobbling(false);
      }}
      sx={{
        width: size,
        maxWidth: '100%',
        mx: 'auto',
        '& .bob': { animation: `${bob} 5s ease-in-out infinite`, transformOrigin: '50% 90%', ...NO_MOTION },
        '& .scoop': { transformBox: 'fill-box', transformOrigin: '50% 100%' },
        '&[data-wobble="true"] .scoop': { animation: `${wobble} .9s cubic-bezier(.3,1.6,.5,1) both`, ...NO_MOTION },
        '&[data-wobble="true"] .mid': { animationDelay: '.08s' },
        '&[data-wobble="true"] .top': { animationDelay: '.16s' },
        '& .float': { transformBox: 'fill-box', transformOrigin: 'center', animation: `${twinkle} 3.6s ease-in-out infinite`, ...NO_MOTION },
        '& .float:nth-of-type(2n)': { animationDelay: '-1.2s', animationDuration: '4.4s' },
        '& .float:nth-of-type(3n)': { animationDelay: '-2.1s' },
        '& *': { animationPlayState: onScreen ? 'running' : 'paused' },
      }}
      data-wobble={wobbling}
    >
      <svg viewBox="0 0 240 320" width="100%" height="auto" focusable="false" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <pattern id={waffle} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill={scoop('warning', 'fill')} />
            <path d="M0 0H14M0 0V14" stroke={colorPalette.warning[700]} strokeOpacity=".35" strokeWidth="2.5" />
          </pattern>
        </defs>
        {/* drifting sprinkles around the cone */}
        <rect className="float" x="14" y="120" width="14" height="5" rx="2.5" fill={scoop('secondary', 'fill')} />
        <rect className="float" x="208" y="96" width="14" height="5" rx="2.5" fill={scoop('success', 'fill')} transform="rotate(50 215 98)" />
        <circle className="float" cx="214" cy="200" r="5" fill={scoop('danger', 'fill')} />
        <circle className="float" cx="26" cy="226" r="4" fill={scoop('info', 'fill')} />
        <rect className="float" x="190" y="252" width="12" height="5" rx="2.5" fill={scoop('primary', 'fill')} transform="rotate(-30 196 254)" />
        <g className="bob">
          {/* cone */}
          <path d="M66 176 L174 176 L126 306 Q120 316 114 306 Z" fill={`url(#${waffle})`} />
          <path d="M60 170 Q120 186 180 170 L178 182 Q120 198 62 182 Z" fill={scoop('warning', 'fill')} />
          <path d="M60 170 Q120 186 180 170 L178 182 Q120 198 62 182 Z" fill={colorPalette.warning[700]} opacity=".18" />
          {/* scoops, bottom to top */}
          <ScoopShape cx={120} cy={142} r={58} flavor="success" className="low" />
          {/* drip down the cone */}
          <path d="M150 178 q6 0 6 10 v14 a6 6 0 0 1 -12 0 v-14 q0 -10 6 -10z" fill={scoop('success', 'fill')} className="scoop low" />
          <ScoopShape cx={120} cy={92} r={48} flavor="danger" className="mid" />
          {/* The top scoop can be pulled off; it springs back when let go. */}
          <motion.g
            className="drag"
            drag
            dragSnapToOrigin
            dragElastic={0.6}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 12 }}
            whileDrag={{ scale: 1.12, rotate: -8 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ cursor: 'grab', touchAction: 'none', transformBox: 'fill-box', transformOrigin: '50% 60%' }}
          >
            <ScoopShape cx={120} cy={48} r={38} flavor="secondary" className="top">
              {SPRINKLES.map((s, i) => (
                <rect key={i} x={s.x - 6} y={s.y - 2} width="12" height="4.5" rx="2.25" fill={scoop(s.c, 'ink')} transform={`rotate(${s.r} ${s.x} ${s.y})`} />
              ))}
            </ScoopShape>
          </motion.g>
        </g>
      </svg>
    </Box>
  );
}
