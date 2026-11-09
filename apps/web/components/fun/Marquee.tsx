'use client';
// A conveyor of candy-colored component chips. It pauses on hover and focus, has
// a pause button (WCAG 2.2.2), stops off-screen, and for reduced motion it does not
// move at all: the chips simply wrap.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, IconButton } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import Pause from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { CATALOG } from '@/lib/catalog';
import { CANDY_TEXT, scoop, scoopAt } from '@/lib/scoops';
import { TOUCH } from '@/lib/touch';
import { useOnScreen } from '../motion';

const slide = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const REDUCE = '@media (prefers-reduced-motion: reduce)';

function Chips({ copy }: { copy: boolean }) {
  return (
    <Box
      component="ul"
      aria-hidden={copy || undefined}
      className={copy ? 'copy' : undefined}
      sx={{ display: 'flex', gap: 1.5, m: 0, p: 0, pr: 1.5, py: 1.5, listStyle: 'none', flexShrink: 0, [REDUCE]: { flexWrap: 'wrap', justifyContent: 'center', pr: 0, ...(copy && { display: 'none' }) } }}
    >
      {CATALOG.map((c, i) => {
        const s = scoopAt(i);
        return (
          <li key={c.slug}>
            <Box
              component={NextLink}
              href={`/docs/components/${c.slug}`}
              tabIndex={copy ? -1 : undefined}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                minHeight: 40,
                px: 2,
                borderRadius: 999,
                bgcolor: scoop(s, 'candy'),
                color: CANDY_TEXT,
                fontWeight: 600,
                fontSize: 15,
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                transform: `rotate(${i % 3 === 0 ? -2 : i % 3 === 1 ? 1.5 : 0}deg)`,
                transition: 'transform .35s cubic-bezier(.3,1.8,.5,1)',
                '&:hover, &:focus-visible': { transform: 'rotate(0) scale(1.08)' },
                '&:focus-visible': { outline: '3px solid', outlineColor: 'text.primary', outlineOffset: 2 },
                [TOUCH]: { minHeight: 44 },
                '&::before': { content: '""', width: 8, height: 8, borderRadius: '50%', bgcolor: scoop(s, 'ink'), [`[data-mode="dark"] &`]: { bgcolor: CANDY_TEXT } },
              }}
            >
              {c.name}
            </Box>
          </li>
        );
      })}
    </Box>
  );
}

export default function Marquee() {
  const ref = React.useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  const [paused, setPaused] = React.useState(false);
  return (
    <Box component="section" aria-label="Components" sx={{ position: 'relative', py: { xs: 3, md: 4 } }}>
      <Box
        ref={ref}
        sx={{
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
          [REDUCE]: { maskImage: 'none', WebkitMaskImage: 'none', px: 2 },
        }}
      >
        <Box
          data-testid="marquee-track"
          data-paused={paused || undefined}
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: `${slide} 70s linear infinite`,
            animationPlayState: paused || !onScreen ? 'paused' : 'running',
            '&:hover, &:focus-within': { animationPlayState: 'paused' },
            [REDUCE]: { animation: 'none', width: 'auto', maxWidth: 1100, mx: 'auto' },
          }}
        >
          <Chips copy={false} />
          <Chips copy />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5, [REDUCE]: { display: 'none' } }}>
        <IconButton
          size="small"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play component carousel' : 'Pause component carousel'}
          sx={{ width: 44, height: 44, color: 'text.secondary' }}
        >
          {paused ? <PlayArrow fontSize="small" /> : <Pause fontSize="small" />}
        </IconButton>
      </Box>
    </Box>
  );
}
