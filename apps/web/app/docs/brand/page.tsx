import type { Metadata } from 'next';
import { Box, Link, Typography } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOff from '@mui/icons-material/HighlightOff';
import { backgrounds, colorPalette } from '@sorbet-ui/tokens';
import { pageMeta } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { CANDY_TEXT, SCOOPS, scoop, type Scoop } from '@/lib/scoops';
import GuidePage, { H3, Section } from '@/components/docs/GuidePage';
import CodeBlock from '@/components/CodeBlock';
import Logo from '@/components/Logo';
import Doodle, { type DoodleName } from '@/components/fun/Doodles';

export const metadata: Metadata = pageMeta({
  title: 'Brand assets',
  description: 'How to write the Sorbet UI name, use the logo, and pick from the six flavor colors, the type and the doodles.',
  path: '/docs/brand',
});

// Flavor names from lib/scoops.ts, with the token scale behind each.
const FLAVOR_NAME: Record<Scoop, string> = {
  danger: 'Raspberry',
  warning: 'Mango',
  success: 'Mint',
  primary: 'Sky',
  secondary: 'Violet',
  info: 'Cyan',
};
const SHADES = [100, 300, 500, 700] as const;

// The mark from components/Logo.tsx, written out with its token colors.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Sorbet UI">
  <circle cx="11" cy="13" r="7" fill="${colorPalette.primary[300]}"/>
  <circle cx="21" cy="13" r="7" fill="${colorPalette.secondary[300]}"/>
  <circle cx="16" cy="7.5" r="6.5" fill="${colorPalette.danger[300]}"/>
  <path d="M8.5 17.5h15L16 30z" fill="${colorPalette.warning[300]}"/>
  <path d="M8.5 17.5h15L16 30z" fill="none" stroke="${colorPalette.warning[500]}" stroke-opacity=".35"/>
</svg>`;

const DOODLES: DoodleName[] = ['cone', 'popsicle', 'jar', 'waffle', 'sundae', 'emptyCone'];
const DOODLE_LABEL: Record<DoodleName, string> = {
  cone: 'Cone',
  popsicle: 'Popsicle',
  jar: 'Sprinkle jar',
  waffle: 'Waffle',
  sundae: 'Sundae',
  emptyCone: 'Empty cone',
};

const DOS = [
  'Write the name as “Sorbet UI”: two words, capital S, capital UI.',
  'Use @sorbet-ui/… only for package names in code.',
  'Give the logo clear space of at least half its width on every side.',
  'Put the logo on plain light or dark backgrounds.',
  'Use flavor colors for accents and illustrations, and token text colors for text.',
];
const DONTS = [
  'Write “SorbetUI”, “Sorbet-UI” or “sorbet ui” in prose.',
  'Recolor, rotate, stretch or outline the logo.',
  'Put body text in a flavor fill color: the 300 shades are for shapes, not words.',
  'Imply that your project is made or endorsed by Sorbet UI.',
  'Animate the logo for visitors who ask for reduced motion.',
];

function LogoTile({ dark }: { dark: boolean }) {
  return (
    <Box>
      <Box
        role="img"
        aria-label={`Sorbet UI logo on a ${dark ? 'dark' : 'light'} background`}
        sx={{
          display: 'grid',
          placeItems: 'center',
          height: 160,
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
          bgcolor: dark ? backgrounds.dark.default : '#ffffff',
        }}
      >
        <Logo size={88} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        On {dark ? 'dark' : 'light'} ({dark ? backgrounds.dark.default : '#ffffff'})
      </Typography>
    </Box>
  );
}

function Swatch({ s }: { s: Scoop }) {
  const scale = colorPalette[s];
  return (
    <Box component="li" sx={{ listStyle: 'none', m: '0 !important', border: 1, borderColor: 'divider', borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Box sx={{ position: 'relative', height: 96, bgcolor: scale[300] }}>
        <Box
          component="span"
          sx={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            px: 1.25,
            py: 0.25,
            borderRadius: 999,
            bgcolor: scoop(s, 'candy'),
            color: CANDY_TEXT,
            fontFamily: 'var(--font-hand), cursive',
            fontSize: 22,
            lineHeight: 1.3,
            rotate: '-3deg',
          }}
        >
          {FLAVOR_NAME[s]}
        </Box>
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: 14 }}>
          <code>{s}</code>
        </Typography>
        <Box component="dl" sx={{ m: 0, mt: 1, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 1.5, rowGap: 0.5, fontSize: 13 }}>
          {SHADES.map((n) => (
            <Box key={n} sx={{ display: 'contents' }}>
              <Box component="dt" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                <Box aria-hidden component="span" sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: scale[n], border: 1, borderColor: 'divider' }} />
                {n}
              </Box>
              <Box component="dd" sx={{ m: 0, fontFamily: 'var(--font-mono), monospace', color: 'text.secondary' }}>
                {scale[n]}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function Rules({ items, good }: { items: string[]; good: boolean }) {
  const Icon = good ? CheckCircleOutline : HighlightOff;
  const flavor: Scoop = good ? 'success' : 'danger';
  return (
    <Box sx={{ p: 2.5, borderRadius: 4, border: 1, borderColor: scoop(flavor, 'fill'), bgcolor: scoop(flavor, 'tint') }}>
      <Typography component="p" sx={{ fontWeight: 800, color: scoop(flavor, 'ink'), display: 'flex', alignItems: 'center', gap: 1, m: 0 }}>
        <Icon aria-hidden sx={{ fontSize: 22 }} />
        {good ? 'Do' : 'Don’t'}
      </Typography>
      <Box component="ul" sx={{ m: 0, mt: 1, pl: '20px !important' }}>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </Box>
    </Box>
  );
}

export default function Page() {
  return (
    <GuidePage
      href="/docs/brand"
      doodle="popsicle"
      aside="house style"
      toc={[
        { id: 'name', label: 'Name', depth: 2 },
        { id: 'logo', label: 'Logo', depth: 2 },
        { id: 'colors', label: 'Flavor colors', depth: 2 },
        { id: 'typography', label: 'Typography', depth: 2 },
        { id: 'doodles', label: 'Doodles', depth: 2 },
        { id: 'do-and-dont', label: 'Do and don’t', depth: 2 },
      ]}
    >
      <p>
        Writing about Sorbet UI, or building something with it? Here is how the project looks and sounds. Everything on this page comes from the code: the colors are the{' '}
        <code>@sorbet-ui/tokens</code> values and the logo and doodles are the components this site uses.
      </p>

      <Section id="name" title="Name">
        <p>
          The name is <strong>Sorbet UI</strong>: two words, capital S, capital UI. The packages are <code>@sorbet-ui/react</code>, <code>@sorbet-ui/theme</code>,{' '}
          <code>@sorbet-ui/tokens</code> and <code>@sorbet-ui/core</code>; use those spellings only in code. The tagline is “{SITE.tagline}”.
        </p>
        <p>
          The voice is the site&apos;s: playful in the decoration (a sorbet shop, with flavors, scoops and doodles), plain and short in the words. Docs talk to you in the second
          person and start with the task.
        </p>
      </Section>

      <Section id="logo" title="Logo">
        <p>
          The mark is three stacked scoops (sky, violet and raspberry) on a mango cone. It is a small inline SVG, so it stays sharp at any size and renders without a request.
        </p>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, my: 3 }}>
          <LogoTile dark={false} />
          <LogoTile dark />
        </Box>
        <H3 id="logo-svg">The SVG</H3>
        <p>
          There is no separate logo file to download yet. Copy the markup below; it is the same drawing as the site&apos;s <code>Logo</code> component, with its token colors filled in.
        </p>
        <CodeBlock code={LOGO_SVG} title="sorbet-ui-logo.svg" label="Sorbet UI logo SVG" />
        <H3 id="logo-sizes">Sizes</H3>
        <Box role="img" aria-label="The logo at 16, 24, 32, 48 and 64 pixels" sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap', my: 2 }}>
          {[16, 24, 32, 48, 64].map((n) => (
            <Box key={n} sx={{ display: 'grid', justifyItems: 'center', gap: 0.5 }}>
              <Logo size={n} />
              <Typography component="span" variant="caption" color="text.secondary">
                {n}px
              </Typography>
            </Box>
          ))}
        </Box>
        <p>Keep it at 16px or larger. In the site header it is 28px, next to the name in 18px extra-bold Inter.</p>
      </Section>

      <Section id="colors" title="Flavor colors">
        <p>
          Six flavors, each a <code>@sorbet-ui/tokens</code> color scale. The 300 shade is the fill for shapes; text in a flavor uses the 700 shade on light pages and the 300 shade on
          dark ones, pairs that are tested for 4.5:1 contrast. Neutral grays carry the body text.
        </p>
        <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, p: '0 !important', my: 3 }}>
          {SCOOPS.map((s) => (
            <Swatch key={s} s={s} />
          ))}
        </Box>
        <p>
          The full scales, the neutral grays and the color roles are on <Link href="/docs/customization/colors">Colors and tokens</Link>.
        </p>
      </Section>

      <Section id="typography" title="Typography">
        <Box sx={{ display: 'grid', gap: 2, my: 3 }}>
          <Box sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 4 }}>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ m: 0 }}>
              Inter: headings, body and UI
            </Typography>
            <Typography component="p" sx={{ fontFamily: 'var(--font-sans), sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '-0.035em', lineHeight: 1.15, mt: 1 }}>
              Make Material UI look modern
            </Typography>
            <Typography component="p" sx={{ fontFamily: 'var(--font-sans), sans-serif', color: 'text.secondary', mt: 1 }}>
              Body text, labels and buttons use Inter too.
            </Typography>
          </Box>
          <Box sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 4 }}>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ m: 0 }}>
              Caveat: short handwritten notes only
            </Typography>
            <Typography component="p" sx={{ fontFamily: 'var(--font-hand), cursive', fontSize: 30, color: scoop('danger', 'ink'), rotate: '-2deg', width: 'fit-content', mt: 1 }}>
              start here!
            </Typography>
          </Box>
          <Box sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 4 }}>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ m: 0 }}>
              JetBrains Mono: code
            </Typography>
            <Typography component="p" sx={{ fontFamily: 'var(--font-mono), monospace', fontSize: 15, mt: 1 }}>
              {'<Button variant="soft" color="success">'}
            </Typography>
          </Box>
        </Box>
        <p>
          The components ask for Inter (the <code>fontFamily.sans</code> token) and fall back to the system UI font. Keep the handwriting to one to three words: page notes and labels, never
          sentences.
        </p>
      </Section>

      <Section id="doodles" title="Doodles">
        <p>
          Hand-drawn ink sketches, one per part of the site. They draw themselves once, and appear finished for visitors who prefer reduced motion. They are decoration, so they are hidden
          from screen readers.
        </p>
        <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gap: 2, p: '0 !important', my: 3 }}>
          {DOODLES.map((name, i) => (
            <Box
              component="li"
              key={name}
              sx={{ listStyle: 'none', m: '0 !important', display: 'grid', justifyItems: 'center', gap: 1, py: 2, border: 1, borderColor: 'divider', borderRadius: 4 }}
            >
              <Doodle name={name} flavor={SCOOPS[i % SCOOPS.length]} sx={{ width: { xs: 96, sm: 112 } }} />
              <Typography component="span" sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                {DOODLE_LABEL[name]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Section>

      <Section id="do-and-dont" title="Do and don’t">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, my: 3 }}>
          <Rules items={DOS} good />
          <Rules items={DONTS} good={false} />
        </Box>
        <p>
          Sorbet UI is MIT licensed; the license covers the code. Questions about using the name or logo? <Link href="/support">Ask on GitHub</Link>.
        </p>
      </Section>
    </GuidePage>
  );
}
