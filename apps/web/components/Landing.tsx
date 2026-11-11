'use client';
// Landing-page sections. app/page.tsx (a server component) composes them.
// A sorbet shop: a row of scoop colors, a cone that bobs, candy chips, tilted
// screens and scalloped bands. Copy stays short; the product does the talking.
// Every text color is a token pair checked in packages/tokens/src/contrast.test.ts.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import ArrowForward from '@mui/icons-material/ArrowForward';
import GitHub from '@mui/icons-material/GitHub';
import LinkButton from './LinkButton';
import CodeBlock, { CommandLine } from './CodeBlock';
import { CountUp, Reveal, Stagger, StaggerItem, useOnScreen } from './motion';
import BeforeAfter, { BEFORE_AFTER_CODE } from './landing/BeforeAfter';
import LivePlayground from './landing/LivePlayground';
import SorbetCone from './fun/SorbetCone';
import Marquee from './fun/Marquee';
import Ink, { ARROW, CIRCLE, type Stroke } from './fun/Ink';
import { RainbowBorder, ScoopBlobs, ScoopRow, Shine, Springy, Sticker, scallopMask } from './fun/Decor';
import { CANDY_TEXT, DARK, NO_MOTION, SCOOPS, scoop, scoopAt, type Scoop } from '@/lib/scoops';
import { colorPalette } from '@sorbet-ui/tokens';
import { SITE } from '@/lib/site';
import { BLOCKS } from '@/lib/blocks';
import { TEMPLATES } from '@/lib/templates';

// npm 7+ and pnpm install peer dependencies automatically.
const INSTALL = 'npm i @sorbet-ui/react @sorbet-ui/theme';

// Headings: heavy, tight, balanced.
const display = { fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, textWrap: 'balance' } as const;

/** A full-bleed band; `tint` washes it in a scoop color with scalloped edges. */
function Band({ children, id, tint, label, py = { xs: 10, md: 14 } }: { children: React.ReactNode; id?: string; tint?: Scoop; label?: string; py?: object }) {
  return (
    <Box
      component="section"
      id={id}
      aria-label={label}
      sx={{ position: 'relative', py, scrollMarginTop: 80, ...(tint && { bgcolor: scoop(tint, 'tint'), ...scallopMask({ r: 16 }), my: 2 }) }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}

/** Hand-drawn squiggle under section titles; it draws itself when scrolled to. */
function Squiggle({ c }: { c: Scoop }) {
  return <Ink c={c} viewBox="0 0 120 12" strokes={['M2 6 Q 12 0 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 118 6']} duration={0.9} delay={0.2} sx={{ width: 96, height: 12, mx: 'auto', mt: 2 }} />;
}

function SectionTitle({ title, lead, c }: { title: string; lead?: string; c: Scoop }) {
  return (
    <Reveal>
      <Box sx={{ maxWidth: 680, mx: 'auto', mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
        <Typography component="h2" sx={{ ...display, fontSize: { xs: 34, md: 48 } }}>
          {title}
        </Typography>
        <Squiggle c={c} />
        {lead && (
          <Typography color="text.secondary" sx={{ mt: 2, fontSize: { xs: 17, md: 19 }, textWrap: 'pretty' }}>
            {lead}
          </Typography>
        )}
      </Box>
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Hero: a scoop-colored headline, a bobbing cone, and a wall of real screens.
// ---------------------------------------------------------------------------

// Each word of the second line is its own scoop. Transform-only entrance, so the
// words are readable in the static HTML even before any script runs.
const WORDS: [string, Scoop][] = [
  ['Make', 'danger'],
  ['it', 'warning'],
  ['look', 'success'],
  ['modern.', 'secondary'],
];
const pop = keyframes`
  0% { transform: translateY(.35em) scale(.7) rotate(-6deg); }
  55% { transform: translateY(-.06em) scale(1.08) rotate(3deg); }
  80% { transform: translateY(0) scale(.98) rotate(-1deg); }
  100% { transform: none; }
`;
const floatTile = keyframes`
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
`;

// Screens from scripts/gen-shots.mjs, each linking to its page.
const SHOTS = [
  ...TEMPLATES.map((t) => ({ file: t.slug, href: `/templates/${t.slug}`, label: `${t.name} template` })),
  { file: 'demo', href: '/demo', label: 'Acme Admin demo' },
];
// Four columns, each starting a little lower, like a contact sheet.
const COLUMNS = [[0, 4], [6, 1], [2, 5], [3]];
const OFFSETS = [0, 96, 40, 140];
const TILTS = [-3, 2.5, -1.5, 3, -2.5, 2, -3.5];

function Shot({ file, href, label, eager, i }: (typeof SHOTS)[number] & { eager?: boolean; i: number }) {
  const img = (mode: 'light' | 'dark') => (
    <Box
      component="img"
      src={`/shots/${file}-${mode}.jpg`}
      alt=""
      width={1280}
      height={1500}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      sx={{
        width: '100%',
        height: 'auto',
        // Show the screenshot that matches the site theme.
        display: mode === 'dark' ? 'none' : 'block',
        '[data-mode="dark"] &': { display: mode === 'dark' ? 'block' : 'none' },
      }}
    />
  );
  const tilt = TILTS[i % TILTS.length];
  return (
    <Box
      className="tile"
      sx={{
        position: 'relative',
        rotate: `${tilt}deg`,
        animation: `${floatTile} ${6 + (i % 3)}s ease-in-out ${-i * 1.3}s infinite`,
        transition: 'rotate .5s cubic-bezier(.3,1.6,.5,1)',
        '&:hover, &:focus-within': { rotate: '0deg', zIndex: 2 },
        '&:hover .back, &:focus-within .back': { rotate: `${-tilt * 2.2}deg`, scale: '1.03' },
        '&:hover .card, &:focus-within .card': { scale: '1.04', translate: '0 -8px' },
        ...NO_MOTION,
      }}
    >
      <Box
        aria-hidden
        className="back"
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: 4,
          bgcolor: scoop(scoopAt(i + 1), 'candy'),
          rotate: `${-tilt * 1.6}deg`,
          translate: '6px 8px',
          transition: 'rotate .5s cubic-bezier(.3,1.6,.5,1), scale .4s',
          [DARK]: { opacity: 0.85 },
        }}
      />
      <Box
        component={NextLink}
        href={href}
        aria-label={label}
        className="card"
        sx={(t) => ({
          position: 'relative',
          display: 'block',
          overflow: 'hidden',
          borderRadius: 3,
          bgcolor: 'background.paper',
          outline: `1px solid ${t.palette.mode === 'dark' ? 'rgb(255 255 255 / 0.1)' : 'rgb(0 0 0 / 0.1)'}`,
          outlineOffset: -1,
          boxShadow: '0 1px 2px rgb(0 0 0 / 0.06), 0 12px 32px -8px rgb(0 0 0 / 0.22)',
          transition: 'scale .4s cubic-bezier(.3,1.6,.5,1), translate .4s cubic-bezier(.3,1.6,.5,1), box-shadow .3s',
          '&:hover': { boxShadow: '0 1px 2px rgb(0 0 0 / 0.06), 0 28px 48px -12px rgb(0 0 0 / 0.3)' },
          '&:focus-visible': { outline: '3px solid', outlineColor: 'text.primary', outlineOffset: 3 },
        })}
      >
        {img('light')}
        {img('dark')}
      </Box>
    </Box>
  );
}

function ScreenWall() {
  const ref = React.useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  let n = 0;
  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        zIndex: 1,
        mt: { xs: 6, md: 8 },
        px: { xs: 3, md: 5 },
        pt: 3,
        height: { xs: 520, md: 760 },
        overflow: 'hidden',
        maskImage: 'linear-gradient(to bottom, #000 60%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 60%, transparent)',
        '& .tile': { animationPlayState: onScreen ? 'running' : 'paused' },
        '& .tile:hover, & .tile:focus-within': { animationPlayState: 'paused' },
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 3, md: 4 }, maxWidth: 1440, mx: 'auto' }}>
        {COLUMNS.map((col, c) => (
          <Stack key={c} spacing={{ xs: 3, md: 4 }} sx={{ pt: `${OFFSETS[c]}px`, display: { xs: c > 1 ? 'none' : 'flex', md: 'flex' } }}>
            {col.map((i, row) => (
              <Shot key={i} {...SHOTS[i]} eager={row === 0} i={n++} />
            ))}
          </Stack>
        ))}
      </Box>
    </Box>
  );
}

export function Hero() {
  return (
    <Box
      component="section"
      aria-labelledby="hero-title"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${scoop('warning', 'tint')} 0%, ${scoop('danger', 'tint')} 55%, transparent 100%)`,
      }}
    >
      <ScoopBlobs
        blobs={[
          { c: 'danger', size: 'min(420px, 70vw)', top: '-8%', right: '-6%' },
          { c: 'primary', size: 'min(360px, 60vw)', top: '32%', right: '18%' },
          { c: 'success', size: 'min(300px, 55vw)', top: '48%', left: '-8%' },
          { c: 'warning', size: 'min(340px, 60vw)', top: '-12%', left: '22%' },
          { c: 'secondary', size: 'min(380px, 60vw)', bottom: '-6%', right: '30%' },
        ]}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                bgcolor: scoop('secondary', 'pastel'),
                color: scoop('secondary', 'pill'),
                fontWeight: 600,
                fontSize: 14,
                rotate: '-2deg',
              }}
            >
              <ScoopRow size={12} />
              Works with MUI v7 and v9
            </Box>
            <Typography id="hero-title" component="h1" sx={{ ...display, mt: 3, fontSize: { xs: 44, sm: 60, md: 76 } }}>
              Already on Material UI?{' '}
              <Box component="span" sx={{ display: 'block' }}>
                {WORDS.map(([w, c], i) => (
                  <React.Fragment key={w}>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        position: 'relative',
                        color: scoop(c, 'ink'),
                        transformOrigin: '50% 80%',
                        animation: `${pop} .8s cubic-bezier(.3,1.4,.5,1) ${0.25 + i * 0.1}s both`,
                        transition: 'transform .4s cubic-bezier(.3,1.8,.5,1)',
                        '&:hover': { transform: `rotate(${i % 2 ? 4 : -4}deg) scale(1.06)` },
                        ...NO_MOTION,
                      }}
                    >
                      {w}
                      {/* The last word gets circled with a marker, drawn after the words land. */}
                      {i === WORDS.length - 1 && (
                        <Ink
                          stretch
                          c="warning"
                          width={5}
                          viewBox="0 0 208 84"
                          strokes={CIRCLE}
                          duration={0.9}
                          delay={1.1}
                          sx={{ position: 'absolute', left: '-10%', top: '0%', width: '120%', height: '108%' }}
                        />
                      )}
                    </Box>
                    {i < WORDS.length - 1 && ' '}
                  </React.Fragment>
                ))}
              </Box>
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 3, fontSize: { xs: 18, md: 21 }, maxWidth: 520, mx: { xs: 'auto', md: 0 }, textWrap: 'pretty' }}>
              Swap one theme and your existing MUI app restyles. No rewrite.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'center', mt: 4 }}
            >
              <Springy>
                <RainbowBorder>
                  <LinkButton href="/docs" variant="contained" size="large" disableElevation endIcon={<ArrowForward />} sx={{ borderRadius: 999, px: 3.5, py: 1.4, fontWeight: 700, flexShrink: 0 }}>
                    Get started
                  </LinkButton>
                </RainbowBorder>
              </Springy>
              <Box sx={{ minWidth: 0, width: { xs: '100%', sm: 440 } }}>
                <CommandLine command={INSTALL} mt={0} />
              </Box>
            </Stack>
            {/* 0.1.0 is not on npm yet; say so next to the command instead of letting it fail. */}
            <Typography color="text.secondary" sx={{ mt: 2, fontSize: 14 }}>
              Pre-release: not on npm yet.{' '}
              <Box component={NextLink} href="/docs#build" sx={{ color: scoop('primary', 'ink'), fontWeight: 600 }}>
                Install from source
              </Box>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'relative', width: { xs: 190, sm: 230, md: 400 }, mx: 'auto', mt: { xs: 2, md: 0 } }}>
              <SorbetCone size={400} />
              {/* A handwritten nudge: the cone can be dragged and springs back. */}
              <Box aria-hidden sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: -96, top: 8, rotate: '-8deg' }}>
                <Typography component="span" sx={{ display: 'block', fontFamily: 'var(--font-hand), cursive', fontSize: 30, lineHeight: 1, color: scoop('danger', 'ink') }}>
                  drag me!
                </Typography>
                <Ink c="danger" width={3.5} viewBox="0 0 132 56" strokes={ARROW} duration={1} delay={1.6} sx={{ width: 120, height: 50, ml: 5, mt: 0.5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <ScreenWall />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Candy marquee and facts.
// ---------------------------------------------------------------------------

export function ComponentMarquee() {
  return <Marquee />;
}

export function Facts() {
  const facts: { value: number | string; label: string; href: string; c: Scoop }[] = [
    { value: 30, label: 'Components', href: '/docs/components', c: 'danger' },
    { value: BLOCKS.length, label: 'Copy-paste blocks', href: '/blocks', c: 'warning' },
    { value: TEMPLATES.length, label: 'Free templates', href: '/templates', c: 'success' },
    { value: 'AA', label: 'Contrast in light and dark', href: '/docs', c: 'secondary' },
  ];
  const rot = [-6, 5, -3, 7];
  return (
    <Container component="section" aria-label="Sorbet UI in numbers" maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 6, md: 8 } }}>
      <Stagger as="ul" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))', gap: 16, padding: 0, margin: 0, listStyle: 'none' }}>
        {facts.map((f, i) => (
          <StaggerItem as="li" key={f.label}>
            <Box
              component={NextLink}
              href={f.href}
              className="shine-host"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'text.primary',
                textDecoration: 'none',
                borderRadius: 4,
                '&:hover .sticker, &:focus-visible .sticker': { transform: `rotate(${rot[i] + 25}deg) scale(1.08)` },
                '&:hover .label': { color: 'text.primary' },
                '&:focus-visible': { outline: '3px solid', outlineColor: 'text.primary', outlineOffset: 4 },
                '& .sticker': { transition: 'transform .5s cubic-bezier(.3,1.8,.5,1)', ...NO_MOTION },
              }}
            >
              <Box sx={{ position: 'relative', width: { xs: 128, md: 156 }, aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
                <Sticker c={f.c} rotate={rot[i]} />
                <Shine />
                <Typography
                  component="span"
                  sx={{ position: 'relative', zIndex: 2, fontWeight: 800, fontSize: { xs: 44, md: 54 }, letterSpacing: '-0.04em', lineHeight: 1, color: scoop(f.c, 'ink'), fontVariantNumeric: 'tabular-nums' }}
                >
                  {typeof f.value === 'number' ? <CountUp value={f.value} onView /> : f.value}
                </Typography>
              </Box>
              <Typography component="span" className="label" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontWeight: 600, textAlign: 'center', transition: 'color .2s' }}>
                {f.label}
              </Typography>
            </Box>
          </StaggerItem>
        ))}
      </Stagger>
    </Container>
  );
}

// ---------------------------------------------------------------------------
// Proof and play.
// ---------------------------------------------------------------------------

/** Candy gradient frame around a demo. */
// ---------------------------------------------------------------------------
// How it works: three blueprint cells; each diagram draws itself like a sketch.
// ---------------------------------------------------------------------------

const STEPS: { title: string; body: string; href: string; c: Scoop; strokes: Stroke[] }[] = [
  {
    title: 'Swap one theme',
    body: 'Your MUI screens restyle. Your code stays.',
    href: '/docs',
    c: 'primary',
    strokes: [
      { d: 'M22 42 h58 v58 h-58 z', neutral: true, w: 3 },
      { d: 'M96 71 H146', c: 'warning' },
      { d: 'M134 59 L148 71 L134 83', c: 'warning' },
      { d: 'M162 50 q0 -10 10 -10 h40 q10 0 10 10 v42 q0 10 -10 10 h-40 q-10 0 -10 -10 z' },
      { d: 'M176 72 l11 11 l19 -22', c: 'success', w: 5 },
    ],
  },
  {
    title: 'Light and dark',
    body: 'Both themes ship, both pass AA contrast.',
    href: '/docs/theming',
    c: 'warning',
    strokes: [
      { d: 'M120 28 A43 43 0 0 0 120 114' },
      { d: 'M120 114 A43 43 0 0 0 120 28', c: 'secondary' },
      { d: 'M120 18 V124', neutral: true, w: 3 },
      { d: 'M100 71 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0' },
      { d: 'M100 52 v-5 M100 95 v-5 M83 71 h-4' },
      { d: 'M146 56 a17 17 0 1 0 8 30 a13 13 0 0 1 -8 -30', c: 'secondary' },
    ],
  },
  {
    title: 'Copy a block',
    body: 'One command drops a finished section in.',
    href: '/blocks',
    c: 'success',
    strokes: [
      { d: 'M52 50 L30 71 L52 92', c: 'danger' },
      { d: 'M72 50 L94 71 L72 92', c: 'danger' },
      { d: 'M104 62 C118 36, 138 36, 150 54', c: 'warning', w: 3 },
      { d: 'M140 50 L151 56 L153 43', c: 'warning', w: 3 },
      { d: 'M146 70 q0 -8 8 -8 h56 q8 0 8 8 v36 q0 8 -8 8 h-56 q-8 0 -8 -8 z' },
      { d: 'M158 78 h34 M158 90 h46 M158 102 h22', neutral: true, w: 3 },
    ],
  },
];

export function HowItWorks() {
  return (
    <Band id="how" py={{ xs: 8, md: 12 }}>
      <SectionTitle c="warning" title="Three moves" />
      <Stagger>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            // Blueprint look: dashed rules between cells, like a sketchbook grid.
            border: '1.5px dashed',
            borderColor: 'divider',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          {STEPS.map((st, i) => (
            <StaggerItem key={st.title}>
              <Box
                component={NextLink}
                href={st.href}
                sx={{
                  display: 'block',
                  height: '100%',
                  p: { xs: 3, md: 4 },
                  color: 'text.primary',
                  textDecoration: 'none',
                  borderTop: { xs: i ? '1.5px dashed' : 0, md: 0 },
                  borderLeft: { md: i ? '1.5px dashed' : 0 },
                  borderColor: 'divider',
                  transition: 'background-color .3s',
                  '&:hover': { bgcolor: scoop(st.c, 'tint') },
                  '&:hover svg': { transform: 'scale(1.05) rotate(-1.5deg)' },
                  '&:focus-visible': { outline: `3px solid ${colorPalette.primary[500]}`, outlineOffset: -3 },
                }}
              >
                <Ink
                  c={st.c}
                  viewBox="0 0 240 142"
                  strokes={st.strokes}
                  duration={1.8}
                  delay={0.2 + i * 0.25}
                  sx={{ width: '100%', maxWidth: 260, mx: 'auto', color: 'text.secondary', transition: 'transform .5s cubic-bezier(.3,1.6,.5,1)', '@media (prefers-reduced-motion: reduce)': { transition: 'none' } }}
                />
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: 20, mt: 2 }}>
                  {st.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {st.body}
                </Typography>
              </Box>
            </StaggerItem>
          ))}
        </Box>
      </Stagger>
    </Band>
  );
}

export const candyFrame = {
  p: { xs: '5px', md: '7px' },
  borderRadius: '26px',
  background: `linear-gradient(120deg, ${SCOOPS.map((s) => scoop(s, 'fill')).join(', ')})`,
  boxShadow: '0 30px 60px -30px rgb(15 23 42 / 0.35)',
} as const;

export function Compare() {
  return (
    <Band id="compare" tint="secondary">
      <SectionTitle c="secondary" title="Same MUI code. One new theme." lead="Drag the handle. Left is MUI's default theme, right is Sorbet. Nothing else changed." />
      <Reveal>
        <Box sx={candyFrame}>
          <BeforeAfter />
        </Box>
      </Reveal>
      <Reveal>
        <Box sx={{ mt: 4, maxWidth: 720, mx: 'auto' }}>
          <CodeBlock code={BEFORE_AFTER_CODE} title="Root.tsx" label="The only change: swap the theme" />
        </Box>
      </Reveal>
    </Band>
  );
}

export function Playground() {
  return (
    <Band id="playground" py={{ xs: 8, md: 12 }}>
      <SectionTitle c="success" title="Change it. The code follows." />
      <Reveal>
        <LivePlayground />
      </Reveal>
    </Band>
  );
}

export function CallToAction() {
  return (
    <Box
      component="section"
      aria-labelledby="cta-title"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        mt: { xs: 4, md: 6 },
        py: { xs: 10, md: 14 },
        color: CANDY_TEXT,
        background: `linear-gradient(110deg, ${scoop('danger', 'candy')}, ${scoop('warning', 'candy')} 30%, ${scoop('success', 'candy')} 55%, ${scoop('info', 'candy')} 75%, ${scoop('secondary', 'candy')})`,
        ...scallopMask({ r: 20 }),
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
        <Reveal>
          <ScoopRow size={30} sx={{ justifyContent: 'center', mb: 3 }} />
          <Typography id="cta-title" component="h2" sx={{ ...display, fontSize: { xs: 40, md: 64 } }}>
            Try it on your app.
          </Typography>
          <Typography sx={{ mt: 2, fontSize: { xs: 18, md: 21 }, fontWeight: 500 }}>Free and MIT licensed.</Typography>
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', flexWrap: 'wrap', mt: 4 }} useFlexGap>
            <Springy>
              <LinkButton
                href="/docs"
                variant="contained"
                size="large"
                disableElevation
                endIcon={<ArrowForward />}
                sx={{ borderRadius: 999, px: 3.5, py: 1.4, fontWeight: 700, bgcolor: CANDY_TEXT, color: colorPalette.neutral[50], '&:hover': { bgcolor: colorPalette.neutral[700] } }}
              >
                Get started
              </LinkButton>
            </Springy>
            <Springy>
              <Button
                href={SITE.github}
                variant="outlined"
                size="large"
                startIcon={<GitHub />}
                sx={{ borderRadius: 999, px: 3.5, py: 1.4, fontWeight: 700, color: CANDY_TEXT, borderColor: CANDY_TEXT, borderWidth: 2, '&:hover': { borderWidth: 2, borderColor: CANDY_TEXT, bgcolor: 'rgb(255 255 255 / 0.35)' } }}
              >
                View on GitHub
              </Button>
            </Springy>
          </Stack>
        </Reveal>
      </Container>
    </Box>
  );
}
