'use client';
// Landing-page sections. Kept in one client module because they use MUI icons
// and theme callbacks; app/page.tsx (a server component) just composes them.
import * as React from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import Tune from '@mui/icons-material/Tune';
import Layers from '@mui/icons-material/Layers';
import Contrast from '@mui/icons-material/Contrast';
import Code from '@mui/icons-material/Code';
import Palette from '@mui/icons-material/Palette';
import Bolt from '@mui/icons-material/Bolt';
import LinkButton from './LinkButton';
import CodeBlock, { CommandLine } from './CodeBlock';
import Showcase from './Showcase';
import VariantMatrix from './VariantMatrix';
import { colorPalette } from '@sorbet-ui/tokens';
import { SITE } from '@/lib/site';

// Brand accent per section; light/dark pick a shade that reads as text.
// Shades come straight from @sorbet-ui/tokens (MUI's palette names danger "error").
type Accent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
const accent = (t: Theme, key: Accent) =>
  t.palette.mode === 'dark' ? colorPalette[key][300] : colorPalette[key][700];

const INSTALL =
  'npm install @sorbet-ui/react @sorbet-ui/theme @mui/material @mui/icons-material @mui/x-date-pickers @emotion/react @emotion/styled dayjs';

const QUICK = `import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';
import { Button } from '@sorbet-ui/react';

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Button variant="soft" color="primary">Hello</Button>
    </ThemeProvider>
  );
}`;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={(t) => ({ color: accent(t, 'primary'), fontWeight: 700, letterSpacing: '0.12em' })}
    >
      {children}
    </Typography>
  );
}

function SectionTitle({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <Box sx={{ maxWidth: 680, mb: 5 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 40 }, letterSpacing: '-0.03em', lineHeight: 1.15, mt: 0.5 }}>
        {title}
      </Typography>
      {lead && (
        <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 18 }}>
          {lead}
        </Typography>
      )}
    </Box>
  );
}

// Soft blurred color fields behind the hero. Decorative only.
function Glow() {
  return (
    <Box
      aria-hidden
      sx={(t) => ({
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: t.palette.mode === 'dark' ? 0.25 : 0.45,
        },
        '&::before': { width: 520, height: 520, top: -160, right: -80, bgcolor: '#7dd3fc' },
        '&::after': { width: 440, height: 440, top: 120, right: 280, bgcolor: '#f0abfc' },
      })}
    />
  );
}

export function Hero() {
  return (
    <Box component="section" sx={{ position: 'relative' }}>
      <Glow />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 6, md: 12 }, pb: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
            <Box
              sx={(t) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                border: 1,
                borderColor: 'divider',
                bgcolor: alpha(t.palette.background.paper, 0.7),
                fontSize: 13,
                fontWeight: 600,
              })}
            >
              <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
              v0.1.0 · MIT · Material UI v7
            </Box>
            <Typography
              component="h1"
              sx={{ fontWeight: 800, fontSize: { xs: 44, sm: 56, md: 68 }, lineHeight: 1.02, letterSpacing: '-0.04em', mt: 3 }}
            >
              Material UI,
              <br />
              but{' '}
              <Box component="span" sx={(t) => ({ color: accent(t, 'secondary') })}>
                softer.
              </Box>
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 3, fontSize: { xs: 18, md: 20 }, maxWidth: 520 }}>
              {SITE.description}
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 4 }} flexWrap="wrap" useFlexGap>
              <LinkButton href="/docs" variant="contained" size="large" disableElevation sx={{ borderRadius: 2.5, px: 3 }}>
                Get started
              </LinkButton>
              <LinkButton href="/docs/components" variant="outlined" size="large" sx={{ borderRadius: 2.5, px: 3 }}>
                Browse components
              </LinkButton>
            </Stack>
            <CommandLine command={INSTALL} />
            <Stack direction="row" spacing={3} sx={{ mt: 4 }} flexWrap="wrap" useFlexGap>
              {[
                ['26', 'components'],
                ['5', 'variants'],
                ['7', 'colors'],
                ['5', 'sizes'],
              ].map(([n, l]) => (
                <Box key={l}>
                  <Typography component="span" sx={{ fontWeight: 800, fontSize: 22 }}>
                    {n}
                  </Typography>{' '}
                  <Typography component="span" color="text.secondary">
                    {l}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
            <Showcase />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export function Matrix() {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionTitle
        eyebrow="One API"
        title="Five variants. Seven colors. Every component."
        lead="The same variant, color and size props work across the library, so once you know one component you know them all."
      />
      <VariantMatrix />
    </Container>
  );
}

const FEATURES = [
  { icon: Tune, color: 'primary', title: 'One variant API', body: 'solid, soft, outlined, ghost and plain on every component, with shared color and size props.' },
  { icon: Layers, color: 'secondary', title: 'Still Material UI', body: 'Each component wraps its MUI v7 counterpart, so MUI props, sx and your theme keep working.' },
  { icon: Contrast, color: 'info', title: 'Light and dark', body: 'lightTheme and darkTheme for the MUI ThemeProvider, built from shared design tokens.' },
  { icon: Palette, color: 'danger', title: 'Design tokens', body: '@sorbet-ui/tokens exports colors, type, spacing and motion for use outside React too.' },
  { icon: Code, color: 'success', title: 'Typed end to end', body: 'Strict TypeScript with exported prop types. ESM and CJS builds with no side effects.' },
  { icon: Bolt, color: 'warning', title: 'Next.js ready', body: 'Ships with a "use client" banner, so it drops into App Router layouts without wrappers.' },
] as const;

export function Features() {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionTitle eyebrow="Why Sorbet" title="Familiar foundations, friendlier defaults" />
      <Grid container spacing={2.5}>
        {FEATURES.map(({ icon: Icon, color, title, body }) => (
          <Grid key={title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                transition: 'border-color .2s, transform .2s',
                '&:hover': { borderColor: colorPalette[color][400], transform: 'translateY(-2px)' },
              }}
            >
              <Box
                sx={(t) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  display: 'grid',
                  placeItems: 'center',
                  color: accent(t, color),
                  bgcolor: alpha(colorPalette[color][500], 0.14),
                })}
              >
                <Icon />
              </Box>
              <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18, mt: 2 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.65 }}>
                {body}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const STEPS = [
  { title: 'Install', body: 'Add the components, the theme and their Material UI peers.' },
  { title: 'Wrap your app', body: 'Pass lightTheme or darkTheme to the MUI ThemeProvider.' },
  { title: 'Use components', body: 'Import from @sorbet-ui/react and pick a variant and color.' },
];

export function QuickStart() {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionTitle eyebrow="Quick start" title="Up and running in a minute" />
          <Stack component="ol" spacing={3} sx={{ p: 0, m: 0, listStyle: 'none' }}>
            {STEPS.map((s, i) => (
              <Stack component="li" key={s.title} direction="row" spacing={2}>
                <Box
                  sx={(t) => ({
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    color: accent(t, 'primary'),
                    border: 1,
                    borderColor: 'divider',
                  })}
                >
                  {i + 1}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.body}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
          <LinkButton href="/docs" variant="text" sx={{ mt: 3, ml: -1 }}>
            Full setup guide for Vite and Next.js →
          </LinkButton>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }} sx={{ minWidth: 0 }}>
          <CodeBlock code={QUICK} title="App.tsx" label="Quick start example" />
        </Grid>
      </Grid>
    </Container>
  );
}

export function CallToAction() {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={(t) => ({
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 5,
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 8 },
          textAlign: 'center',
          border: 1,
          borderColor: 'divider',
          background:
            t.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0c4a6e 0%, #3b0764 100%)'
              : 'linear-gradient(135deg, #e0f2fe 0%, #fae8ff 55%, #ffe4e6 100%)',
        })}
      >
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 40 }, letterSpacing: '-0.03em' }}>
          Ready for a softer Material UI?
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: 18, opacity: 0.85 }}>
          Read the docs, then try every component in the playground.
        </Typography>
        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 4 }} flexWrap="wrap" useFlexGap>
          <LinkButton href="/docs" variant="contained" size="large" disableElevation sx={{ borderRadius: 2.5, px: 3 }}>
            Get started
          </LinkButton>
          <LinkButton href="/docs/components/button" variant="outlined" size="large" sx={{ borderRadius: 2.5, px: 3, bgcolor: 'background.paper' }}>
            Open the playground
          </LinkButton>
        </Stack>
      </Box>
    </Container>
  );
}
