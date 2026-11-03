'use client';
// Remaining landing sections: component marquee, pricing, FAQ.
import NextLink from 'next/link';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useReducedMotion } from 'motion/react';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Check from '@mui/icons-material/Check';
import { Chip } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import LinkButton from '../LinkButton';
import { CATALOG } from '@/lib/catalog';
import { SITE } from '@/lib/site';

// All 26 exported components (the docs catalog groups a few of them).
export const COMPONENTS = [
  'Alert', 'Autocomplete', 'Avatar', 'Badge', 'Breadcrumbs', 'Button', 'Card', 'Checkbox', 'Chip',
  'DatePicker', 'Dialog', 'Drawer', 'Pagination', 'Popover', 'Progress', 'Radio', 'Rating', 'Select',
  'Slider', 'Snackbar', 'Switch', 'Table', 'Tabs', 'TextField', 'ToggleButtonGroup', 'Tooltip',
];
const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;
const DOCS = new Map(CATALOG.map((c) => [c.name, c.slug]));

/** Two rows scrolling in opposite directions; pauses on hover/focus, static with reduced motion. */
export function ComponentMarquee() {
  const reduce = useReducedMotion();
  const rows = [COMPONENTS.slice(0, 13), COMPONENTS.slice(13)];
  return (
    <Stack spacing={1.5} sx={{ '--gap': '12px', maskImage: reduce ? 'none' : 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
      {rows.map((row, r) => (
        <Box key={r} sx={{ overflow: 'hidden', '&:hover .track, &:focus-within .track': { animationPlayState: 'paused' } }}>
          <Box
            className="track"
            sx={{
              display: 'flex',
              gap: 'var(--gap)',
              width: reduce ? 'auto' : 'max-content',
              flexWrap: reduce ? 'wrap' : 'nowrap',
              animation: reduce ? 'none' : `marquee-${r} ${40 + r * 8}s linear infinite`,
              '@keyframes marquee-0': { to: { transform: 'translateX(calc(-50% - var(--gap) / 2))' } },
              '@keyframes marquee-1': { from: { transform: 'translateX(calc(-50% - var(--gap) / 2))' }, to: { transform: 'translateX(0)' } },
            }}
          >
            {(reduce ? row : [...row, ...row]).map((name, i) => {
              const slug = DOCS.get(name);
              const dup = !reduce && i >= row.length;
              const chip = (
                <Chip
                  label={name}
                  variant="soft"
                  color={COLORS[(i + r) % COLORS.length]}
                  sx={{ fontWeight: 600, px: 0.5, height: 36, fontSize: 14, cursor: slug ? 'pointer' : 'default' }}
                />
              );
              return slug ? (
                <Box
                  key={`${name}-${i}`}
                  component={NextLink}
                  href={`/docs/components/${slug}`}
                  aria-hidden={dup || undefined}
                  tabIndex={dup ? -1 : undefined}
                  sx={{ borderRadius: 999, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
                >
                  {chip}
                </Box>
              ) : (
                <Box key={`${name}-${i}`} component="span" aria-hidden={dup || undefined}>
                  {chip}
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

const PLANS = [
  {
    name: 'Open source',
    price: '$0',
    note: 'MIT, forever',
    cta: { label: 'Get started', href: '/docs' },
    featured: true,
    items: ['All 26 components', 'Light and dark themes', 'Design tokens package', 'TypeScript types, ESM and CJS', 'Storybook with every story'],
  },
  {
    name: 'Pro',
    price: 'Soon',
    note: 'Not on sale yet',
    cta: { label: 'Watch the repo for news', href: SITE.github },
    featured: false,
    items: ['Page templates (dashboard, settings, auth)', 'Advanced motion blocks', 'Figma source kit', 'Everything in Open source'],
  },
];

/** Two tiers with a frosted-glass card and gradient border. Pro is not for sale yet. */
export function Pricing() {
  return (
    <Grid container spacing={3} justifyContent="center">
      {PLANS.map((p) => (
        <Grid key={p.name} size={{ xs: 12, md: 5 }}>
          <Box
            sx={(t) => ({
              position: 'relative',
              height: '100%',
              p: 4,
              borderRadius: 5,
              bgcolor: alpha(t.palette.background.paper, 0.6),
              backdropFilter: 'blur(14px)',
              border: '1px solid transparent',
              background: p.featured
                ? `linear-gradient(${alpha(t.palette.background.paper, 0.85)}, ${alpha(t.palette.background.paper, 0.85)}) padding-box, linear-gradient(135deg, ${colorPalette.primary[400]}, ${colorPalette.secondary[400]}, ${colorPalette.danger[300]}) border-box`
                : `linear-gradient(${alpha(t.palette.background.paper, 0.6)}, ${alpha(t.palette.background.paper, 0.6)}) padding-box, linear-gradient(135deg, ${t.palette.divider}, ${t.palette.divider}) border-box`,
              boxShadow: p.featured ? '0 30px 70px -40px rgba(14,165,233,.6)' : 'none',
            })}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18 }}>
                {p.name}
              </Typography>
              {!p.featured && <Chip size="sm" label="Coming soon" variant="soft" color="secondary" />}
            </Stack>
            <Typography component="p" sx={{ fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em', mt: 2 }}>
              {p.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {p.note}
            </Typography>
            <Stack component="ul" spacing={1.25} sx={{ listStyle: 'none', p: 0, my: 3 }}>
              {p.items.map((it) => (
                <Stack component="li" key={it} direction="row" spacing={1} alignItems="center">
                  <Check fontSize="small" sx={{ color: 'success.main' }} />
                  <Typography variant="body2">{it}</Typography>
                </Stack>
              ))}
            </Stack>
            {p.cta.href.startsWith('/') ? (
              <LinkButton href={p.cta.href} variant="contained" disableElevation fullWidth size="large" sx={{ borderRadius: 2.5 }}>
                {p.cta.label}
              </LinkButton>
            ) : (
              <Box component="a" href={p.cta.href} rel="noopener" sx={{ display: 'block', textAlign: 'center', py: 1.25, borderRadius: 2.5, border: 1, borderColor: 'divider', color: 'text.primary', textDecoration: 'none', fontWeight: 600, '&:hover': { bgcolor: 'action.hover' } }}>
                {p.cta.label}
              </Box>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

const FAQS = [
  ['Do I have to rewrite my MUI app?', 'No. Pass lightTheme or darkTheme to the MUI ThemeProvider and your existing MUI components pick up the new look. Swap in Sorbet components where you want the extra variants.'],
  ['Which MUI version is supported?', 'Material UI v7 with React 19. DatePicker uses MUI X Date Pickers v8.'],
  ['Does it work with the Next.js App Router?', 'Yes. Components ship with a "use client" banner, so you can import them from Server Components. Put the ThemeProvider in a client providers file.'],
  ['Is it accessible?', 'Components keep MUI’s keyboard and ARIA behavior, and every color pair is contrast-tested in CI against WCAG AA in both light and dark themes.'],
  ['What will Pro include?', 'Page templates, advanced motion blocks and a Figma kit. Nothing is for sale yet; the open-source library stays free and MIT licensed.'],
];

export function FAQ() {
  return (
    <Box sx={{ maxWidth: 820, mx: 'auto' }}>
      {FAQS.map(([q, a], i) => (
        <Accordion
          key={q}
          disableGutters
          elevation={0}
          defaultExpanded={i === 0}
          sx={{ bgcolor: 'transparent', borderBottom: 1, borderColor: 'divider', '&::before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 0 }}>
            <Typography component="h3" sx={{ fontWeight: 600, fontSize: 17 }}>
              {q}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <Typography color="text.secondary">{a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
