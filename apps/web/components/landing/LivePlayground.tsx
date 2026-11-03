'use client';
// Split playground: multi-tab code on the left, live preview + controls on the
// right. Every control rewrites the code so what you see is what you copy.
import * as React from 'react';
import { Box, Grid, Slider as MuiSlider, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Button, Switch } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import CodeBlock from '../CodeBlock';
import { COLORS, SIZES, type Color, type Size } from '@/lib/site';

const VARIANTS = ['solid', 'soft', 'outlined', 'dash', 'ghost', 'plain'] as const;
type V = (typeof VARIANTS)[number];
const DOT: Record<Color, string> = {
  primary: colorPalette.primary[500],
  secondary: colorPalette.secondary[500],
  success: colorPalette.success[500],
  warning: colorPalette.warning[500],
  danger: colorPalette.danger[500],
  info: colorPalette.info[500],
  neutral: colorPalette.neutral[500],
};

// Celebration burst: sorbet-colored dots fly out from the button.
function Burst({ id }: { id: number }) {
  const dots = React.useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 60 + Math.random() * 40;
        return { x: Math.cos(a) * r, y: Math.sin(a) * r, c: Object.values(DOT)[i % 6] };
      }),
    [id],
  );
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'grid', placeItems: 'center' }}>
      {dots.map((d, i) => (
        <motion.span
          key={`${id}-${i}`}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: d.x, y: d.y, scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: d.c }}
        />
      ))}
    </Box>
  );
}

export default function LivePlayground() {
  const reduce = useReducedMotion();
  const [variant, setVariant] = React.useState<V>('solid');
  const [color, setColor] = React.useState<Color>('primary');
  const [size, setSize] = React.useState<Size>('md');
  const [radius, setRadius] = React.useState(8);
  const [loading, setLoading] = React.useState(false);
  const [bursts, setBursts] = React.useState<number[]>([]);
  const [file, setFile] = React.useState<'tsx' | 'theme'>('tsx');

  const props = [`variant="${variant}"`, `color="${color}"`, `size="${size}"`, loading && 'loading', radius !== 8 && `sx={{ borderRadius: '${radius}px' }}`]
    .filter(Boolean)
    .join(' ');
  const code =
    file === 'tsx'
      ? `import { Button } from '@sorbet-ui/react';\n\nexport function ShipIt() {\n  return (\n    <Button ${props}>\n      Ship it\n    </Button>\n  );\n}`
      : `import { ThemeProvider } from '@mui/material';\nimport { lightTheme, darkTheme } from '@sorbet-ui/theme';\n\n// Same components, either theme.\n<ThemeProvider theme={prefersDark ? darkTheme : lightTheme}>\n  <ShipIt />\n</ThemeProvider>`;

  const fire = () => {
    if (loading) return;
    if (!reduce) setBursts((b) => [...b.slice(-3), Date.now()]);
  };

  return (
    <Grid container spacing={3} alignItems="stretch">
      <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0, order: { xs: 2, md: 1 } }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={file}
          onChange={(_, f) => f && setFile(f)}
          aria-label="Source file"
          sx={{ mb: -1 }}
        >
          <ToggleButton value="tsx">ShipIt.tsx</ToggleButton>
          <ToggleButton value="theme">App.tsx</ToggleButton>
        </ToggleButtonGroup>
        <CodeBlock code={code} title={file === 'tsx' ? 'ShipIt.tsx' : 'App.tsx'} label="Playground source" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
        <Box sx={{ height: '100%', border: 1, borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box
            data-known-contrast
            data-testid="playground-preview"
            sx={(t) => ({
              position: 'relative',
              flex: 1,
              minHeight: 200,
              display: 'grid',
              placeItems: 'center',
              backgroundImage: `radial-gradient(${t.palette.divider} 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            })}
          >
            <motion.div layout transition={{ type: 'spring', stiffness: 380, damping: 26 }}>
              <Button variant={variant} color={color} size={size} loading={loading} onClick={fire} sx={{ borderRadius: `${radius}px` }}>
                Ship it
              </Button>
            </motion.div>
            <AnimatePresence>{bursts.map((id) => <Burst key={id} id={id} />)}</AnimatePresence>
          </Box>
          <Stack spacing={2} sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}>
            <ToggleButtonGroup size="small" exclusive value={variant} onChange={(_, v) => v && setVariant(v)} aria-label="Variant" sx={{ flexWrap: 'wrap' }}>
              {VARIANTS.map((v) => (
                <ToggleButton key={v} value={v}>
                  {v}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Stack direction="row" spacing={1} role="radiogroup" aria-label="Color" flexWrap="wrap" useFlexGap>
              {COLORS.map((c) => (
                <Box
                  key={c}
                  component="button"
                  role="radio"
                  aria-checked={color === c}
                  aria-label={c}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: 2,
                    borderColor: color === c ? 'text.primary' : 'transparent',
                    outline: 'none',
                    bgcolor: DOT[c],
                    cursor: 'pointer',
                    boxShadow: 'inset 0 0 0 2px var(--mui-palette-background-paper, #fff)',
                    transition: 'transform .15s',
                    '&:hover': { transform: 'scale(1.12)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                  }}
                />
              ))}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography id="pg-size" variant="caption" color="text.secondary">
                  Size: {size}
                </Typography>
                <MuiSlider
                  aria-labelledby="pg-size"
                  size="small"
                  min={0}
                  max={4}
                  step={1}
                  marks
                  value={SIZES.indexOf(size)}
                  onChange={(_, n) => setSize(SIZES[n as number])}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography id="pg-radius" variant="caption" color="text.secondary">
                  Radius: {radius}px
                </Typography>
                <MuiSlider aria-labelledby="pg-radius" size="small" min={0} max={28} value={radius} onChange={(_, n) => setRadius(n as number)} />
              </Box>
              <Switch label="Loading" checked={loading} onChange={(_, c) => setLoading(c)} />
            </Stack>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
