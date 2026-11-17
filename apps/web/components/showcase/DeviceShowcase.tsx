'use client';
// The hero's product showcase: one live app (Scoop Shop) in a browser frame and a
// phone frame, sharing state, with a theme bar that restyles both. The stage has its
// own ThemeProvider, built the way the code under it shows.
import * as React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import BatteryFull from '@mui/icons-material/BatteryFull';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import SignalCellularAlt from '@mui/icons-material/SignalCellularAlt';
import Wifi from '@mui/icons-material/Wifi';
import { Slider, ToggleButton, ToggleButtonGroup } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import type { Color } from '@/lib/site';
import { DARK, SCOOPS, scoop, type Scoop } from '@/lib/scoops';
import { TOUCH, touchTarget } from '@/lib/touch';
import { useColorMode } from '../ColorMode';
import CodeBlock from '../CodeBlock';
import Ink, { ARROW } from '../fun/Ink';
import ScoopShop, { useShop } from './ScoopShop';
import { DEFAULT_SETTINGS, FLAVORS, stageCode, stageTheme, swatch, type Density, type StageMode, type StageSettings } from './stage-theme';

/** Both frames from this width up; below it the phone alone. */
const WIDE = '@media (min-width: 1000px)';
const TABLET = '@media (min-width: 680px) and (max-width: 999.95px)';
const NOT_WIDE = '@media (max-width: 999.95px)';

const frameShadow = '0 1px 1px rgb(15 23 42 / 0.06), 0 6px 12px -4px rgb(15 23 42 / 0.1), 0 28px 56px -20px rgb(15 23 42 / 0.32)';

// ---------------------------------------------------------------------------
// Device frames (decorative chrome; the app inside is the content)
// ---------------------------------------------------------------------------

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={(t) => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '14px',
        bgcolor: 'background.default',
        border: `1px solid ${t.palette.mode === 'dark' ? 'rgb(255 255 255 / 0.12)' : 'rgb(15 23 42 / 0.12)'}`,
        boxShadow: frameShadow,
      })}
    >
      <Box
        aria-hidden
        sx={(t) => ({
          flexShrink: 0,
          height: 42,
          display: 'grid',
          gridTemplateColumns: '1fr minmax(0, 320px) 1fr',
          alignItems: 'center',
          px: 1.75,
          bgcolor: t.palette.mode === 'dark' ? colorPalette.neutral[800] : colorPalette.neutral[100],
          borderBottom: `1px solid ${t.palette.mode === 'dark' ? 'rgb(255 255 255 / 0.08)' : colorPalette.neutral[200]}`,
        })}
      >
        <Box sx={{ display: 'flex', gap: '7px' }}>
          {(['danger', 'warning', 'success'] as const).map((c) => (
            <Box key={c} sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: colorPalette[c][400] }} />
          ))}
        </Box>
        <Box
          sx={(t) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            height: 26,
            px: 1.5,
            borderRadius: 999,
            fontSize: 12.5,
            color: 'text.secondary',
            bgcolor: t.palette.mode === 'dark' ? colorPalette.neutral[900] : '#fff',
            border: `1px solid ${t.palette.mode === 'dark' ? 'rgb(255 255 255 / 0.06)' : colorPalette.neutral[200]}`,
          })}
        >
          <LockOutlined sx={{ fontSize: 12 }} />
          scoopshop.example/orders
        </Box>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Box>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        height: '100%',
        p: '9px',
        borderRadius: '46px',
        bgcolor: colorPalette.neutral[900],
        boxShadow: `inset 0 0 0 1.5px ${colorPalette.neutral[600]}, inset 0 0 0 4px ${colorPalette.neutral[800]}, ${frameShadow}`,
      }}
    >
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '37px', bgcolor: 'background.default', color: 'text.primary' }}>
        <Box aria-hidden sx={{ flexShrink: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 3.25, pr: 2.5, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
          <span>9:41</span>
          <Box sx={{ position: 'absolute', top: 10, left: '50%', translate: '-50% 0', width: 84, height: 24, borderRadius: 999, bgcolor: colorPalette.neutral[900] }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SignalCellularAlt sx={{ fontSize: 15 }} />
            <Wifi sx={{ fontSize: 15 }} />
            <BatteryFull sx={{ fontSize: 17, rotate: '90deg' }} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
        <Box aria-hidden sx={{ position: 'absolute', bottom: 6, left: '50%', translate: '-50% 0', width: 108, height: 4, borderRadius: 999, bgcolor: 'text.primary', opacity: 0.55, pointerEvents: 'none' }} />
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Theme bar
// ---------------------------------------------------------------------------

const groupLabel = { fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary', whiteSpace: 'nowrap' } as const;

function Group({ label, id, stack, children }: { label: string; id?: string; stack?: boolean; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, [NOT_WIDE]: stack ? { flexDirection: 'column', alignItems: 'stretch', gap: 0.5 } : { justifyContent: 'space-between' } }}>
      <Typography component="span" id={id} sx={groupLabel}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function ThemeBar({ settings, set, setMode }: { settings: StageSettings; set: (p: Partial<StageSettings>) => void; setMode: (m: StageMode) => void }) {
  const id = React.useId();
  return (
    <Box
      role="group"
      aria-label="Stage theme"
      data-testid="theme-bar"
      sx={(t) => ({
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 3,
        rowGap: 1.5,
        px: 3,
        py: 1.25,
        borderRadius: '28px',
        bgcolor: 'background.paper',
        border: `1px solid ${t.palette.divider}`,
        boxShadow: '0 1px 2px rgb(15 23 42 / 0.06), 0 16px 36px -16px rgb(15 23 42 / 0.3)',
        // Stacked rows next to (tablet) or under (phone) the phone frame.
        [NOT_WIDE]: { flexDirection: 'column', alignItems: 'stretch', px: 2.5, py: 2, rowGap: 1.75 },
      })}
    >
      <Group stack label="Accent" id={`${id}-accent`}>
        <Box role="radiogroup" aria-labelledby={`${id}-accent`} sx={{ display: 'flex', gap: 0.75, [NOT_WIDE]: { gap: 0, justifyContent: 'space-between', mx: -1 } }}>
          {FLAVORS.map((f) => (
            <Box
              key={f.id}
              component="label"
              title={f.name}
              sx={{ position: 'relative', display: 'grid', placeItems: 'center', width: 26, height: 26, cursor: 'pointer', [TOUCH]: { height: 44 }, [NOT_WIDE]: { width: 40, height: 44 }, '@media (max-width: 359.95px)': { width: 34 } }}
            >
              <Box
                component="input"
                type="radio"
                name={`${id}-accent`}
                value={f.id}
                checked={settings.flavor === f.id}
                onChange={() => set({ flavor: f.id })}
                aria-label={f.name}
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', m: 0, opacity: 0, cursor: 'pointer' }}
              />
              <Box
                aria-hidden
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: swatch(f.id),
                  // Paint only: clicks go to the radio underneath.
                  pointerEvents: 'none',
                  transition: 'scale .2s cubic-bezier(.3,1.6,.5,1), box-shadow .2s',
                  'input:checked + &': { boxShadow: (t) => `0 0 0 2px ${t.palette.background.paper}, 0 0 0 4px ${t.palette.text.primary}` },
                  'input:focus-visible + &': { outline: '2px solid', outlineColor: 'text.primary', outlineOffset: 5 },
                  'label:hover &': { scale: '1.12' },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              />
            </Box>
          ))}
        </Box>
      </Group>
      <Group label="Radius">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: 150, [NOT_WIDE]: { width: 'min(200px, 60%)' } }}>
          <Slider aria-label="Corner radius" size="sm" color={settings.flavor} min={0} max={24} step={2} value={settings.radius} onChange={(_, v) => set({ radius: v as number })} />
          <Typography component="span" aria-hidden sx={{ width: 34, flexShrink: 0, fontSize: 13, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {settings.radius}px
          </Typography>
        </Box>
      </Group>
      <Group label="Density">
        <ToggleButtonGroup exclusive size="sm" variant="soft" color={settings.flavor} value={settings.density} onChange={(_, v) => v && set({ density: v as Density })} aria-label="Density" sx={{ '& .MuiToggleButton-root': touchTarget }}>
          <ToggleButton value="compact">Compact</ToggleButton>
          <ToggleButton value="comfortable">Comfy</ToggleButton>
        </ToggleButtonGroup>
      </Group>
      <Group label="Stage">
        <ToggleButtonGroup exclusive size="sm" variant="soft" color={settings.flavor} value={settings.mode} onChange={(_, v) => v && setMode(v as StageMode)} aria-label="Stage color mode" sx={{ '& .MuiToggleButton-root': touchTarget }}>
          <ToggleButton value="light" aria-label="Light stage">
            <LightModeOutlined sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton value="dark" aria-label="Dark stage">
            <DarkModeOutlined sx={{ fontSize: 18 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Group>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Showcase
// ---------------------------------------------------------------------------

const isScoop = (c: Color): c is Scoop => (SCOOPS as readonly string[]).includes(c);

export default function DeviceShowcase() {
  const { mode: siteMode } = useColorMode();
  // The stage follows the site mode until the visitor flips it on the bar.
  const [override, setOverride] = React.useState<StageMode | null>(null);
  const [picked, setPicked] = React.useState(DEFAULT_SETTINGS);
  const settings: StageSettings = React.useMemo(() => ({ ...picked, mode: override ?? siteMode }), [picked, override, siteMode]);
  const theme = React.useMemo(() => stageTheme(settings), [settings]);
  const shop = useShop();
  // One accessible copy of the app: the browser frame on wide screens (the phone is
  // a visual mirror), the phone below that (the browser frame is display: none).
  // The static HTML assumes wide, so it never exposes two copies; on phones the
  // phone frame becomes the accessible copy on hydration (it is not interactive before).
  const wide = useMediaQuery('(min-width:1000px)', { defaultMatches: true });
  const a: Scoop = isScoop(settings.flavor) ? settings.flavor : 'primary';
  const b = SCOOPS[(SCOOPS.indexOf(a) + 2) % SCOOPS.length];

  return (
    <Box
      data-testid="device-showcase"
      sx={{
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 3,
        [TABLET]: { gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'center', gap: 4 },
      }}
    >
      <Box
        role="group"
        aria-label="Live demo: Scoop Shop, a sample order app"
        data-testid="stage"
        data-stage-mode={settings.mode}
        sx={{
          position: 'relative',
          minWidth: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 3.5,
          p: { xs: 2, sm: 3, lg: 4 },
          borderRadius: { xs: '32px', md: '40px' },
          background: `linear-gradient(125deg, ${scoop(a, 'pastel')}, ${scoop(b, 'pastel')})`,
          boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.7), 0 1px 0 rgb(15 23 42 / 0.04)',
          [DARK]: { boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.08)' },
          [WIDE]: { height: 680, pb: 6.5 },
        }}
      >
        <ThemeProvider theme={theme}>
          <Box data-frame="browser" sx={{ display: 'none', flex: 1, minWidth: 0, [WIDE]: { display: 'block' } }}>
            <BrowserFrame>
              <ScoopShop shop={shop} flavor={settings.flavor} density={settings.density} />
            </BrowserFrame>
          </Box>
          <Box
            data-frame="phone"
            aria-hidden={wide || undefined}
            inert={wide}
            sx={{ flexShrink: 1, minWidth: 0, width: 'min(100%, 340px)', height: 660, [TABLET]: { width: 320 }, [WIDE]: { width: 304, height: 'auto' } }}
          >
            <PhoneFrame>
              <ScoopShop compact shop={shop} flavor={settings.flavor} density={settings.density} />
            </PhoneFrame>
          </Box>
        </ThemeProvider>
        <Box aria-hidden sx={{ display: 'none', [WIDE]: { display: 'block' }, position: 'absolute', left: 36, top: -44, rotate: '-4deg', pointerEvents: 'none' }}>
          <Typography component="span" sx={{ display: 'inline-block', fontFamily: 'var(--font-hand), cursive', fontSize: 26, lineHeight: 1, color: scoop('danger', 'ink') }}>
            it&apos;s live, click around
          </Typography>
          <Ink c="danger" width={3.5} viewBox="0 0 132 56" strokes={ARROW} duration={1} delay={0.6} sx={{ display: 'inline-block', verticalAlign: 'top', width: 70, height: 30, ml: 1, mt: 1.5, rotate: '50deg' }} />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, justifyItems: 'center', minWidth: 0, [WIDE]: { mt: -6.5 }, [NOT_WIDE]: { justifyItems: 'stretch' } }}>
        <ThemeBar settings={settings} set={(p) => setPicked((s) => ({ ...s, ...p }))} setMode={setOverride} />
        <Box sx={{ width: '100%', maxWidth: 860, minWidth: 0 }}>
          <CodeBlock code={stageCode(settings)} label="Theme for the current stage settings" />
        </Box>
      </Box>
    </Box>
  );
}
