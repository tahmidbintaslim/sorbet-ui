'use client';
// Landing-page sections. app/page.tsx (a server component) composes them.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import { motion, useReducedMotion } from 'motion/react';
import ArrowForward from '@mui/icons-material/ArrowForward';
import LinkButton from './LinkButton';
import CodeBlock, { CommandLine } from './CodeBlock';
import VariantMatrix from './VariantMatrix';
import { CountUp, EASE, Reveal } from './motion';
import HeroCanvas from './landing/HeroCanvas';
import HeroDashboard from './landing/HeroDashboard';
import WordRotator from './landing/WordRotator';
import BeforeAfter, { BEFORE_AFTER_CODE } from './landing/BeforeAfter';
import LivePlayground from './landing/LivePlayground';
import Bento from './landing/Bento';
import { ComponentMarquee, FAQ, Pricing } from './landing/Sections';
import { useGitHubStars, formatStars } from './GitHubStars';
import { colorPalette } from '@sorbet-ui/tokens';
import { SITE } from '@/lib/site';
import { BLOCKS, categoriesWithBlocks } from '@/lib/blocks';
import { TEMPLATES } from '@/lib/templates';

// Brand accent per section; light/dark pick a shade that reads as text.
type Accent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
const accent = (t: Theme, key: Accent) => (t.palette.mode === 'dark' ? colorPalette[key][300] : colorPalette[key][700]);

// npm 7+ and pnpm install peer dependencies automatically.
const INSTALL = 'npm i @sorbet-ui/react @sorbet-ui/theme';

const QUICK = `import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';
import { Button } from '@sorbet-ui/react';
import YourExistingApp from './App';

export default function Root() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {/* Step 2: your current MUI screens, restyled */}
      <YourExistingApp />
      {/* Step 3, optional: Sorbet variants */}
      <Button variant="soft" color="primary">Hello</Button>
    </ThemeProvider>
  );
}`;

function Section({ children, id, py = { xs: 8, md: 12 } }: { children: React.ReactNode; id?: string; py?: object }) {
  return (
    <Container component="section" id={id} maxWidth="lg" sx={{ py, scrollMarginTop: 80 }}>
      {children}
    </Container>
  );
}

function SectionTitle({ eyebrow, title, lead, center }: { eyebrow: string; title: string; lead?: string; center?: boolean }) {
  return (
    <Reveal>
      <Box sx={{ maxWidth: 720, mb: 6, mx: center ? 'auto' : 0, textAlign: center ? 'center' : 'left' }}>
        <Typography variant="overline" sx={(t) => ({ color: accent(t, 'primary'), fontWeight: 700, letterSpacing: '0.12em' })}>
          {eyebrow}
        </Typography>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 44 }, letterSpacing: '-0.035em', lineHeight: 1.1, mt: 0.5 }}>
          {title}
        </Typography>
        {lead && (
          <Typography color="text.secondary" sx={{ mt: 2, fontSize: 18 }}>
            {lead}
          </Typography>
        )}
      </Box>
    </Reveal>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const stars = useGitHubStars();
  // Staggered entrance for the hero copy.
  const item = (i: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay: 0.08 * i } };

  return (
    <HeroCanvas>
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 11 }, pb: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 6, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
            <motion.div {...item(0)}>
              <Box
                component="a"
                href="#compare"
                sx={(t) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  pl: 0.75,
                  pr: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: alpha(t.palette.background.paper, 0.7),
                  backdropFilter: 'blur(8px)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover .arrow': { transform: 'translateX(3px)' },
                })}
              >
                <Box component="span" sx={(t) => ({ px: 1, py: 0.25, borderRadius: 999, bgcolor: alpha(colorPalette.primary[500], 0.15), color: accent(t, 'primary') })}>
                  MUI v7 · v9
                </Box>
                See it on a real dashboard
                <ArrowForward className="arrow" sx={{ fontSize: 14, transition: 'transform .2s' }} />
              </Box>
            </motion.div>
            <motion.div {...item(1)}>
              <Typography
                component="h1"
                aria-label="Already on Material UI? Make it look modern."
                sx={{ fontWeight: 800, fontSize: { xs: 42, sm: 56, md: 66 }, lineHeight: 1.04, letterSpacing: '-0.045em', mt: 3 }}
              >
                <span aria-hidden>Already on Material UI?</span>
                <br />
                <span aria-hidden>Make it </span>
                <Box
                  component="span"
                  sx={{
                    backgroundImage: `linear-gradient(90deg, ${colorPalette.primary[500]}, ${colorPalette.secondary[500]}, ${colorPalette.danger[400]})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  <WordRotator words={['look modern.', 'feel calmer.', 'yours.']} />
                </Box>
              </Typography>
            </motion.div>
            <motion.div {...item(2)}>
              <Typography color="text.secondary" sx={{ mt: 3, fontSize: { xs: 18, md: 20 }, maxWidth: 540 }}>
                Sorbet UI is a theme and component layer for MUI. Wrap your app in one ThemeProvider and your existing Buttons, Tables
                and forms restyle, with no rewrite. Then copy ready-made blocks when you need more.
              </Typography>
            </motion.div>
            <motion.div {...item(3)}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }} alignItems={{ sm: 'center' }}>
                <LinkButton href="/docs" variant="contained" size="large" disableElevation endIcon={<ArrowForward />} sx={{ borderRadius: 2.5, px: 3, flexShrink: 0 }}>
                  Get started — free
                </LinkButton>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <CommandLine command={INSTALL} mt={0} />
                </Box>
              </Stack>
            </motion.div>
            <motion.div {...item(4)}>
              <Stack direction="row" spacing={3} sx={{ mt: 4, color: 'text.secondary', fontSize: 14 }} flexWrap="wrap" useFlexGap>
                <span>MUI v7 &amp; v9</span>
                <span>WCAG AA in light and dark</span>
                <span>MIT licensed</span>
                {!!stars && <span>★ {formatStars(stars)} on GitHub</span>}
              </Stack>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
            <motion.div
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              initial={reduce ? false : { opacity: 0, y: 40, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            >
              <HeroDashboard />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </HeroCanvas>
  );
}

export function Marquee() {
  return (
    <Box component="section" aria-label="All components" sx={{ py: 4, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
      <ComponentMarquee />
    </Box>
  );
}

export function Compare() {
  return (
    <Section id="compare">
      <SectionTitle
        eyebrow="No rewrite"
        title="Your MUI code. Unchanged."
        lead="Both sides run the exact same @mui/material dashboard. The left uses MUI's default theme; the right wraps it in Sorbet's theme. That is the whole migration."
      />
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

const AUDIENCE = [
  { title: 'Teams with an existing MUI app', body: 'Dashboards, admin panels and internal tools that work but look like 2016. Keep DataGrid, Pickers and your code.' },
  { title: 'Solo builders shipping on MUI', body: 'Start from blocks and templates that already look finished, in light and dark.' },
  { title: 'AI-assisted coding', body: 'Claude Code, Cursor and other agents read component props from the Storybook MCP server and AGENTS.md instead of guessing.' },
];

const COMPARE_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: 'Keeps your MUI code', values: ['Yes, one theme swap', 'Yes', 'No, a rewrite to Tailwind'] },
  { label: 'Modern look out of the box', values: ['Yes', 'Material Design', 'Yes'] },
  { label: 'MUI X DataGrid and Pickers', values: ['Yes', 'Yes', 'Not built in'] },
  { label: 'Copy-paste blocks', values: ['54 blocks, 6 templates', 'Paid templates', 'Yes'] },
  { label: 'Contrast checked in CI, light and dark', values: ['Yes', 'Partly', 'Up to you'] },
];

export function WhoFor() {
  return (
    <Section id="why">
      <SectionTitle eyebrow="Who it is for" title="Built for apps that cannot leave Material UI" />
      <Grid container spacing={3}>
        {AUDIENCE.map((a) => (
          <Grid key={a.title} size={{ xs: 12, md: 4 }}>
            <Reveal>
              <Box sx={{ height: '100%', p: 3, border: 1, borderColor: 'divider', borderRadius: 4, bgcolor: 'background.paper' }}>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18 }}>
                  {a.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {a.body}
                </Typography>
              </Box>
            </Reveal>
          </Grid>
        ))}
      </Grid>
      <Reveal>
        <Box tabIndex={0} role="region" aria-label="Sorbet UI compared with alternatives" sx={{ mt: 6, overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 4 }}>
          <Box component="table" sx={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', '& th, & td': { p: 2, textAlign: 'left', borderBottom: 1, borderColor: 'divider' }, '& tr:last-of-type td': { borderBottom: 0 } }}>
            <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Sorbet UI compared with default MUI and shadcn/ui</caption>
            <thead>
              <tr>
                <Box component="th" scope="col" sx={{ color: 'text.secondary', fontWeight: 600 }} />
                <Box component="th" scope="col" sx={(t) => ({ fontWeight: 700, color: accent(t, 'primary') })}>Sorbet UI</Box>
                <Box component="th" scope="col" sx={{ fontWeight: 700 }}>Default MUI</Box>
                <Box component="th" scope="col" sx={{ fontWeight: 700 }}>shadcn/ui</Box>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r) => (
                <tr key={r.label}>
                  <Box component="th" scope="row" sx={{ fontWeight: 600 }}>{r.label}</Box>
                  {r.values.map((v, i) => (
                    <Box component="td" key={i} sx={{ color: i === 0 ? 'text.primary' : 'text.secondary', fontWeight: i === 0 ? 600 : 400 }}>{v}</Box>
                  ))}
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      </Reveal>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Starting a new project without MUI? shadcn/ui is a great choice. Sorbet is for when Material UI is already part of your stack.
      </Typography>
    </Section>
  );
}

export function Playground() {
  return (
    <Section id="playground">
      <SectionTitle eyebrow="Live playground" title="Change it. The code follows." lead="Pick a variant, color, size and radius. The source on the left updates as you go, ready to copy." />
      <Reveal>
        <LivePlayground />
      </Reveal>
    </Section>
  );
}

export function Matrix() {
  return (
    <Section>
      <SectionTitle eyebrow="One API" title="Seven variants. Seven colors. Five sizes." lead="The same variant, color and size props work across the library, so once you know one component you know them all." />
      <Reveal>
        <VariantMatrix />
      </Reveal>
    </Section>
  );
}

export function Library() {
  const items = [
    { href: '/blocks', count: BLOCKS.length, label: 'copy-paste blocks', body: `Heroes, pricing, dashboards, auth and more, in ${categoriesWithBlocks().length} categories. Preview, then copy the code.`, color: 'primary' as const },
    { href: '/templates', count: TEMPLATES.length, label: 'free templates', body: 'Full pages assembled from blocks: SaaS landing, product launch, store, auth and app screens.', color: 'secondary' as const },
    { href: '/demo', count: 4, label: 'screen live demo', body: 'Acme Admin: a working dashboard with orders, customers, dialogs, a drawer and toasts.', color: 'success' as const },
  ];
  return (
    <Section>
      <SectionTitle eyebrow="Ready to paste" title="Blocks, templates and a working demo" lead="Everything is built from the published packages, MIT licensed, and checked for WCAG AA in both themes." />
      <Grid container spacing={2.5}>
        {items.map((it, i) => (
          <Grid key={it.href} size={{ xs: 12, md: 4 }}>
            <Reveal delay={i * 0.06}>
              <LinkCard href={it.href} count={it.count} label={it.label} body={it.body} color={it.color} />
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}

function LinkCard({ href, count, label, body, color }: { href: string; count: number; label: string; body: string; color: Accent }) {
  return (
    <Box
      component={NextLink}
      href={href}
      sx={(t) => ({
        display: 'block',
        height: '100%',
        p: 3.5,
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.primary',
        textDecoration: 'none',
        transition: 'transform .2s, border-color .2s',
        '&:hover': { transform: 'translateY(-3px)', borderColor: colorPalette[color][400] },
        '&:hover .go': { transform: 'translateX(4px)' },
        '& .num': { color: accent(t, color) },
      })}
    >
      <Typography component="p" className="num" sx={{ fontWeight: 800, fontSize: 48, letterSpacing: '-0.04em', lineHeight: 1 }}>
        <CountUp value={count} />
      </Typography>
      <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18, mt: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {body}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 2, fontWeight: 600, fontSize: 14 }}>
        <span>Open</span>
        <ArrowForward className="go" sx={{ fontSize: 16, transition: 'transform .2s' }} />
      </Stack>
    </Box>
  );
}

export function Showcase() {
  return (
    <Section>
      <SectionTitle eyebrow="Built with Sorbet" title="Small demos, real components" lead="Every tile below is interactive and made from the published packages." />
      <Bento />
    </Section>
  );
}

const STEPS = [
  { title: 'Install', body: 'Add the theme and components next to your existing MUI packages.' },
  { title: 'Wrap your app', body: 'Pass lightTheme or darkTheme to the ThemeProvider you already have. Your MUI screens restyle right away.' },
  { title: 'Go further when you want', body: 'Copy a block, or use Sorbet components for soft, dash and ghost variants. Adopt them one screen at a time.' },
];

export function QuickStart() {
  return (
    <Section>
      <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionTitle eyebrow="Quick start" title="Three steps, no rewrite" />
          <Stack component="ol" spacing={3} sx={{ p: 0, m: 0, listStyle: 'none' }}>
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08}>
                <Stack direction="row" spacing={2}>
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
              </Reveal>
            ))}
          </Stack>
          <LinkButton href="/docs" variant="text" sx={{ mt: 3, ml: -1 }}>
            Full setup guide for Vite and Next.js →
          </LinkButton>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }} sx={{ minWidth: 0 }}>
          <Reveal>
            <CodeBlock code={QUICK} title="App.tsx" label="Quick start example" />
          </Reveal>
        </Grid>
      </Grid>
    </Section>
  );
}

export function PricingSection() {
  return (
    <Section id="pricing">
      <SectionTitle center eyebrow="Pricing" title="Free and open source" lead="The library is MIT licensed and stays that way. A Pro kit with templates is planned; nothing is for sale yet." />
      <Reveal>
        <Pricing />
      </Reveal>
    </Section>
  );
}

export function FAQSection() {
  return (
    <Section>
      <SectionTitle center eyebrow="FAQ" title="Questions, answered" />
      <Reveal>
        <FAQ />
      </Reveal>
    </Section>
  );
}

export function CallToAction() {
  const reduce = useReducedMotion();
  return (
    <Section py={{ xs: 4, md: 6 }}>
      <Reveal>
        <Box
          sx={(t) => ({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 6,
            px: { xs: 3, md: 8 },
            py: { xs: 7, md: 10 },
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            background:
              t.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0c4a6e 0%, #3b0764 100%)'
                : 'linear-gradient(135deg, #e0f2fe 0%, #fae8ff 55%, #ffe4e6 100%)',
          })}
        >
          {/* Slowly drifting scoops in the background. */}
          {!reduce &&
            [colorPalette.primary[300], colorPalette.secondary[300], colorPalette.danger[300]].map((c, i) => (
              <motion.div
                key={c}
                aria-hidden
                animate={{ x: [0, 30 - i * 20, 0], y: [0, -20 + i * 10, 0] }}
                transition={{ duration: 9 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: c, opacity: 0.35, filter: 'blur(50px)', left: `${10 + i * 32}%`, top: i % 2 ? '50%' : '-10%' }}
              />
            ))}
          <Box sx={{ position: 'relative' }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 46 }, letterSpacing: '-0.035em' }}>
              Ready for a softer Material UI?
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 18, opacity: 0.85 }}>Read the docs, browse the blocks, then copy what you need.</Typography>
            <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 4 }} flexWrap="wrap" useFlexGap>
              <LinkButton href="/docs" variant="contained" size="large" disableElevation sx={{ borderRadius: 2.5, px: 3 }}>
                Get started
              </LinkButton>
              <LinkButton href="/blocks" variant="outlined" size="large" sx={{ borderRadius: 2.5, px: 3, bgcolor: 'background.paper' }}>
                Browse blocks
              </LinkButton>
            </Stack>
            <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
              <Box component="a" href={SITE.github} rel="noopener" sx={{ color: 'inherit' }}>
                Star Sorbet UI on GitHub
              </Box>
            </Typography>
          </Box>
        </Box>
      </Reveal>
    </Section>
  );
}
