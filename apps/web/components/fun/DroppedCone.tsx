'use client';
// 404 illustration: a cone dropped upside down on its scoop, in a melting puddle.
// Token colors only. The cone lands once when the page loads (CSS only, so it is
// never hidden without JavaScript) and stays still under reduced motion.
import * as React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { colorPalette, DARK_INK } from '@sorbet-ui/tokens';
import { NO_MOTION, scoop, type Scoop } from '@/lib/scoops';

const land = keyframes`
  0% { transform: translateY(-70px) rotate(-14deg); }
  55% { transform: translateY(0) rotate(4deg); }
  75% { transform: translateY(-6px) rotate(-2deg); }
  100% { transform: translateY(0) rotate(0); }
`;
const squash = keyframes`
  0%, 40% { transform: scale(.86, 1.22); }
  60% { transform: scale(1.08, .84); }
  80% { transform: scale(.98, 1.04); }
  100% { transform: scale(1); }
`;
const spread = keyframes`
  0%, 45% { transform: scale(.72, .6); }
  100% { transform: scale(1); }
`;

const SPRINKLES: { x: number; y: number; r: number; c: Scoop }[] = [
  { x: 34, y: 150, r: -30, c: 'warning' },
  { x: 58, y: 204, r: 20, c: 'info' },
  { x: 246, y: 206, r: -50, c: 'secondary' },
  { x: 272, y: 150, r: 60, c: 'primary' },
  { x: 216, y: 124, r: 10, c: 'success' },
  { x: 74, y: 120, r: 75, c: 'secondary' },
];

export default function DroppedCone({ size = 300 }: { size?: number }) {
  const waffle = `waffle-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const ease = 'cubic-bezier(.3,1.3,.5,1)';
  return (
    <Box
      aria-hidden
      data-testid="dropped-cone"
      sx={{
        width: size,
        maxWidth: '100%',
        mx: 'auto',
        '& .cone': { transformBox: 'fill-box', transformOrigin: '50% 100%', animation: `${land} .9s ${ease} both`, ...NO_MOTION },
        '& .scoop': { transformBox: 'fill-box', transformOrigin: '50% 100%', animation: `${squash} .9s ${ease} both`, ...NO_MOTION },
        '& .puddle': { transformBox: 'fill-box', transformOrigin: '50% 60%', animation: `${spread} 1.3s ${ease} both`, ...NO_MOTION },
      }}
    >
      <svg viewBox="0 0 300 224" focusable="false" style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <pattern id={waffle} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill={scoop('warning', 'fill')} />
            <path d="M0 0H14M0 0V14" stroke={colorPalette.warning[700]} strokeOpacity=".35" strokeWidth="2.5" />
          </pattern>
        </defs>
        <ellipse cx="150" cy="196" rx="126" ry="14" fill={DARK_INK} opacity=".08" />
        {/* melting puddle */}
        <g className="puddle">
          <path
            d="M40 180C38 164 76 160 104 164C128 154 196 156 220 166C252 164 268 176 262 188C256 202 214 202 190 198C164 208 116 206 98 198C70 202 42 196 40 180Z"
            fill={scoop('danger', 'fill')}
          />
          <ellipse cx="86" cy="178" rx="20" ry="5" fill="#fff" opacity=".4" transform="rotate(-6 86 178)" />
          <circle cx="24" cy="198" r="5" fill={scoop('danger', 'fill')} />
          <circle cx="280" cy="180" r="4" fill={scoop('danger', 'fill')} />
        </g>
        {/* the scoop, squashed under the cone */}
        <g className="scoop">
          <path d="M88 180C84 128 190 124 196 178C172 190 112 190 88 180Z" fill={scoop('danger', 'fill')} />
          {[98, 117, 136, 155, 174, 190].map((x) => (
            <circle key={x} cx={x} cy={178} r="11" fill={scoop('danger', 'fill')} />
          ))}
          <path d="M88 180C84 128 190 124 196 178C172 190 112 190 88 180Z" fill={DARK_INK} opacity=".05" />
          <ellipse cx="112" cy="150" rx="13" ry="7" fill="#fff" opacity=".5" transform="rotate(-28 112 150)" />
        </g>
        {/* the cone, tip up and tilted */}
        <g transform="rotate(14 142 140)">
          <g className="cone">
            <path d="M104 140L180 140L147 34Q142 24 137 34Z" fill={`url(#${waffle})`} />
            <path d="M98 134Q142 148 186 134L184 146Q142 160 100 146Z" fill={scoop('warning', 'fill')} />
            <path d="M98 134Q142 148 186 134L184 146Q142 160 100 146Z" fill={colorPalette.warning[700]} opacity=".18" />
          </g>
        </g>
        {/* a second scoop that rolled away */}
        <circle cx="242" cy="166" r="19" fill={scoop('success', 'fill')} />
        <ellipse cx="235" cy="158" rx="6" ry="3.5" fill="#fff" opacity=".5" transform="rotate(-30 235 158)" />
        {SPRINKLES.map((s, i) => (
          <rect key={i} x={s.x - 7} y={s.y - 2.5} width="14" height="5" rx="2.5" fill={scoop(s.c, 'fill')} transform={`rotate(${s.r} ${s.x} ${s.y})`} />
        ))}
      </svg>
    </Box>
  );
}
