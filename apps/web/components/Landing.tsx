'use client';
// Landing-page sections. app/page.tsx (a server component) composes them.
// Show the product, say little: a mosaic of real template screenshots, the
// before/after proof, the playground, and one call to action.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Container, Stack, Typography } from '@mui/material';
import { type Theme } from '@mui/material/styles';
import { motion, useReducedMotion } from 'motion/react';
import ArrowForward from '@mui/icons-material/ArrowForward';
import LinkButton from './LinkButton';
import CodeBlock, { CommandLine } from './CodeBlock';
import { EASE, Reveal } from './motion';
import BeforeAfter, { BEFORE_AFTER_CODE } from './landing/BeforeAfter';
import LivePlayground from './landing/LivePlayground';
import { colorPalette } from '@sorbet-ui/tokens';
import { SITE } from '@/lib/site';
import { BLOCKS } from '@/lib/blocks';
import { TEMPLATES } from '@/lib/templates';

// Accent text: one hue, a shade that clears 4.5:1 on either theme's background.
const accent = (t: Theme) => (t.palette.mode === 'dark' ? colorPalette.primary[300] : colorPalette.primary[700]);

// npm 7+ and pnpm install peer dependencies automatically.
const INSTALL = 'npm i @sorbet-ui/react @sorbet-ui/theme';

// Headings: calm weight, tight tracking, balanced lines.
const display = { fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, textWrap: 'balance' } as const;

function Section({ children, id, py = { xs: 10, md: 16 } }: { children: React.ReactNode; id?: string; py?: object }) {
  return (
    <Container component="section" id={id} maxWidth="lg" sx={{ py, scrollMarginTop: 80 }}>
      {children}
    </Container>
  );
}

function SectionTitle({ title, lead }: { title: string; lead?: string }) {
  return (
    <Reveal>
      <Box sx={{ maxWidth: 680, mx: 'auto', mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
        <Typography component="h2" sx={{ ...display, fontSize: { xs: 32, md: 44 } }}>
          {title}
        </Typography>
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
// Hero: short copy on top, a wall of real screens below.
// ---------------------------------------------------------------------------

// Screens from scripts/gen-shots.mjs, each linking to its page.
const SHOTS = [
  ...TEMPLATES.map((t) => ({ file: t.slug, href: `/templates/${t.slug}`, label: `${t.name} template` })),
  { file: 'demo', href: '/demo', label: 'Acme Admin demo' },
];
// Four columns, each starting a little lower, like a contact sheet.
const COLUMNS = [[0, 4], [6, 1], [2, 5], [3]];
const OFFSETS = [0, 96, 40, 140];

function Shot({ file, href, label }: (typeof SHOTS)[number]) {
  const img = (mode: 'light' | 'dark') => (
    <Box
      component="img"
      src={`/shots/${file}-${mode}.jpg`}
      alt=""
      width={1280}
      height={1500}
      loading="lazy"
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
  return (
    <Box
      component={NextLink}
      href={href}
      aria-label={label}
      sx={(t) => ({
        display: 'block',
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: 'background.paper',
        // Elevation from layered shadow, edge from a neutral 1px outline.
        outline: `1px solid ${t.palette.mode === 'dark' ? 'rgb(255 255 255 / 0.1)' : 'rgb(0 0 0 / 0.1)'}`,
        outlineOffset: -1,
        boxShadow: '0 1px 2px rgb(0 0 0 / 0.06), 0 12px 32px -8px rgb(0 0 0 / 0.18)',
        transition: 'transform .25s, box-shadow .25s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 1px 2px rgb(0 0 0 / 0.06), 0 20px 40px -8px rgb(0 0 0 / 0.24)' },
        '&:focus-visible': { outline: `2px solid ${colorPalette.primary[500]}`, outlineOffset: 3 },
      })}
    >
      {img('light')}
      {img('dark')}
    </Box>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const item = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay: 0.08 * i } };

  return (
    <Box component="section" aria-labelledby="hero-title" sx={{ overflow: 'hidden' }}>
      <Container maxWidth="md" sx={{ pt: { xs: 8, md: 14 }, textAlign: 'center' }}>
        <motion.div {...item(0)}>
          <Typography id="hero-title" component="h1" sx={{ ...display, fontSize: { xs: 40, sm: 52, md: 64 } }}>
            Already on Material UI?{' '}
            <Box component="span" sx={{ color: accent }}>
              Make it look modern.
            </Box>
          </Typography>
        </motion.div>
        <motion.div {...item(1)}>
          <Typography color="text.secondary" sx={{ mt: 3, fontSize: { xs: 18, md: 20 }, maxWidth: 520, mx: 'auto', textWrap: 'pretty' }}>
            Swap one theme and your existing MUI app restyles. No rewrite.
          </Typography>
        </motion.div>
        <motion.div {...item(2)}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center', alignItems: { sm: 'center' }, mt: 5 }}>
            <LinkButton href="/docs" variant="contained" size="large" disableElevation endIcon={<ArrowForward />} sx={{ borderRadius: 2.5, px: 3, flexShrink: 0 }}>
              Get started
            </LinkButton>
            <Box sx={{ minWidth: 0, width: { sm: 460 } }}>
              <CommandLine command={INSTALL} mt={0} />
            </Box>
          </Stack>
        </motion.div>
      </Container>

      {/* The wall fades out at the bottom so it reads as a glimpse, not a grid. */}
      <motion.div {...item(3)}>
        <Box
          sx={{
            mt: { xs: 8, md: 12 },
            px: { xs: 2, md: 4 },
            height: { xs: 520, md: 760 },
            overflow: 'hidden',
            maskImage: 'linear-gradient(to bottom, #000 55%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent)',
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
            {COLUMNS.map((col, c) => (
              <Stack key={c} spacing={{ xs: 2, md: 3 }} sx={{ pt: `${OFFSETS[c]}px`, display: { xs: c > 1 ? 'none' : 'flex', md: 'flex' } }}>
                {col.map((i) => (
                  <Shot key={i} {...SHOTS[i]} />
                ))}
              </Stack>
            ))}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Facts: four numbers, each true of the repo today.
// ---------------------------------------------------------------------------

export function Facts() {
  const facts = [
    { value: '30', label: 'Components', href: '/docs/components' },
    { value: String(BLOCKS.length), label: 'Copy-paste blocks', href: '/blocks' },
    { value: String(TEMPLATES.length), label: 'Free templates', href: '/templates' },
    { value: 'AA', label: 'Contrast in light and dark', href: '/docs' },
  ];
  return (
    <Container component="section" aria-label="Sorbet UI in numbers" maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
      <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 4, md: 3 }, p: 0, m: 0, listStyle: 'none' }}>
        {facts.map((f) => (
          <Box component="li" key={f.label}>
            <Box component={NextLink} href={f.href} sx={{ display: 'block', color: 'text.primary', textDecoration: 'none', '&:hover .label': { color: 'text.primary' } }}>
              <Typography component="span" sx={(t) => ({ display: 'block', fontWeight: 600, fontSize: { xs: 44, md: 56 }, letterSpacing: '-0.04em', lineHeight: 1, color: accent(t), fontVariantNumeric: 'tabular-nums' })}>
                {f.value}
              </Typography>
              <Typography component="span" className="label" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontWeight: 500, transition: 'color .2s' }}>
                {f.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

// ---------------------------------------------------------------------------
// Proof and play.
// ---------------------------------------------------------------------------

export function Compare() {
  return (
    <Section id="compare">
      <SectionTitle title="Same MUI code. One new theme." lead="Drag the handle. Left is MUI's default theme, right is Sorbet. Nothing else changed." />
      <Reveal>
        <BeforeAfter />
      </Reveal>
      <Reveal>
        <Box sx={{ mt: 4, maxWidth: 720, mx: 'auto' }}>
          <CodeBlock code={BEFORE_AFTER_CODE} title="Root.tsx" label="The only change: swap the theme" />
        </Box>
      </Reveal>
    </Section>
  );
}

export function Playground() {
  return (
    <Section id="playground" py={{ xs: 4, md: 6 }}>
      <SectionTitle title="Change it. The code follows." />
      <Reveal>
        <LivePlayground />
      </Reveal>
    </Section>
  );
}

export function CallToAction() {
  return (
    <Section>
      <Reveal>
        <Box sx={{ textAlign: 'center' }}>
          <Typography component="h2" sx={{ ...display, fontSize: { xs: 32, md: 44 } }}>
            Try it on your app.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, fontSize: { xs: 17, md: 19 } }}>
            Free and MIT licensed.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', flexWrap: 'wrap', mt: 4 }} useFlexGap>
            <LinkButton href="/docs" variant="contained" size="large" disableElevation sx={{ borderRadius: 2.5, px: 3 }}>
              Get started
            </LinkButton>
            <LinkButton href={SITE.github} variant="outlined" size="large" sx={{ borderRadius: 2.5, px: 3 }}>
              View on GitHub
            </LinkButton>
          </Stack>
        </Box>
      </Reveal>
    </Section>
  );
}
