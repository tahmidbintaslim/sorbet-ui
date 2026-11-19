import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks } from '../../_shared/parts';
import A from '../../_shared/A';
import { componentFacts } from '../../_shared/source';
import { lightTheme } from '@sorbet-ui/theme';
import { fontFamily, fontSize, radius, spacing, typographyPresets } from '@sorbet-ui/tokens';

export const metadata: Metadata = pageMeta({
  title: 'Typography and spacing',
  description: 'Type scale, font stack, spacing and corner radius, and how to change them.',
  path: '/docs/customization/typography',
});

const toc: TocItem[] = [
  { id: 'type-scale', label: 'Type scale', depth: 2 },
  { id: 'presets', label: 'Text presets', depth: 3 },
  { id: 'font-stack', label: 'Font stack', depth: 2 },
  { id: 'spacing', label: 'Spacing scale', depth: 2 },
  { id: 'radius', label: 'Corner radius', depth: 2 },
  { id: 'change-font', label: 'Change the font', depth: 2 },
  { id: 'token-font-components', label: 'Components with their own font', depth: 3 },
  { id: 'change-radius', label: 'Change the corner radius', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const MONO = 'var(--font-mono), ui-monospace, monospace';
const rem = (v: string) => (v.endsWith('rem') ? `${parseFloat(v) * 16}px` : v);

const FONT_LAYOUT = `// app/layout.tsx (a Server Component)
import { Nunito_Sans } from 'next/font/google';
import Providers from './providers';

// Self-hosted at build time and exposed as a CSS variable.
const brand = Nunito_Sans({ subsets: ['latin'], variable: '--font-brand', display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={brand.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`;

const FONT_THEME = `// theme.ts
import { createTheme, lightTheme } from '@sorbet-ui/theme';

const FONT = 'var(--font-brand), system-ui, sans-serif';

// MUI bakes the font into each text variant when a theme is created, so set it
// on every variant, not only on typography.fontFamily.
const VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2',
  'body1', 'body2', 'button', 'caption', 'overline'] as const;

export const theme = createTheme(lightTheme, {
  typography: {
    fontFamily: FONT,
    ...Object.fromEntries(VARIANTS.map((v) => [v, { fontFamily: FONT }])),
  },
});`;

const FONT_COMPONENTS = `export const theme = createTheme(lightTheme, {
  typography: { /* as above */ },
  components: {
    // '&&' doubles the class, so it outranks the component's own font.
    MuiChip: { styleOverrides: { root: { '&&': { fontFamily: 'inherit' } } } },
    MuiAlert: { styleOverrides: { root: { '&&': { fontFamily: 'inherit' } } } },
  },
});`;

const RADIUS = `import { createTheme, lightTheme } from '@sorbet-ui/theme';

export const theme = createTheme(lightTheme, {
  // Stock MUI components and the outlined input of TextField.
  shape: { borderRadius: 4 },
  components: {
    // Sorbet components with a token radius: override per component.
    MuiButton: { styleOverrides: { root: { '&&': { borderRadius: 4 } } } },
  },
});`;

export default function Page() {
  const facts = componentFacts();
  const tokenFont = facts.filter((f) => f.tokenFont).map((f) => f.name);
  const inherits = facts.filter((f) => !f.tokenFont).map((f) => f.name);
  const presetRows = Object.entries(typographyPresets).map(([name, p]) => [
    name,
    rem(p.fontSize),
    String(p.fontWeight),
    String(p.lineHeight),
    'letterSpacing' in p ? p.letterSpacing : '',
  ]);

  return (
    <GuidePage href="/docs/customization/typography" toc={toc} doodle="jar" aside="fine print">
      <p>
        Sizes, weights, spacing and radii are tokens in <code>@sorbet-ui/tokens</code>. Components read them
        directly, and the MUI theme carries its own font and radius. Everything below is rendered from the token
        objects.
      </p>

      <Section id="type-scale" title="Type scale">
        <p>
          <code>fontSize</code> runs from <code>xs</code> to <code>9xl</code> in rem, so it follows the reader&apos;s
          browser font size. Components use <code>xs</code> to <code>xl</code>; the larger steps are for headings.
        </p>
        <DocTable
          label="Font size tokens"
          head={['Token', 'Value', 'At 16px root', 'Sample']}
          mono={[0, 1, 2]}
          rows={Object.entries(fontSize).map(([k, v]) => [
            k,
            v,
            rem(v),
            <Box key="s" component="span" aria-hidden sx={{ fontSize: v, lineHeight: 1.1, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap' }}>
              Aa
            </Box>,
          ])}
        />

        <H3 id="presets">Text presets</H3>
        <p>
          <code>typographyPresets</code> combines size, weight and line height for common roles. Use them with{' '}
          <code>sx</code>, for example <code>{'sx={typographyPresets.label}'}</code>.
        </p>
        <DocTable label="Typography presets" head={['Preset', 'Size', 'Weight', 'Line height', 'Letter spacing']} mono={[0, 1]} rows={presetRows} />
      </Section>

      <Section id="font-stack" title="Font stack">
        <DocTable
          label="Font family tokens"
          head={['Token', 'Stack', 'Sample']}
          mono={[0]}
          rows={(Object.keys(fontFamily) as (keyof typeof fontFamily)[]).map((k) => [
            `fontFamily.${k}`,
            <Box key="v" component="code" sx={{ whiteSpace: 'normal' }}>
              {fontFamily[k]}
            </Box>,
            <Box key="s" component="span" sx={{ fontFamily: fontFamily[k], color: 'text.primary', fontSize: 18, whiteSpace: 'nowrap' }}>
              Sorbet 123
            </Box>,
          ])}
        />
        <p>Two things set the font, and they differ:</p>
        <ul>
          <li>
            <strong>The theme</strong> uses the system stack: <code>{lightTheme.typography.fontFamily}</code>. MUI&apos;s{' '}
            <code>Typography</code>, the page body (through <code>CssBaseline</code>) and stock MUI components use it.
          </li>
          <li>
            <strong>{tokenFont.length} Sorbet components</strong> set <code>fontFamily.sans</code> in their own styles,
            which asks for Inter first. The tokens do not load Inter: load it yourself (for example with{' '}
            <code>next/font</code> or <code>@fontsource/inter</code>), or those components fall back to the system fonts
            after it.
          </li>
        </ul>
      </Section>

      <Section id="spacing" title="Spacing scale">
        <p>
          <code>spacing</code> is a 4px grid, keyed like Tailwind: <code>spacing[4]</code> is{' '}
          <code>{spacing[4]}</code>. Components use it for padding and gaps.
        </p>
        <Callout title="Theme spacing is MUI's 8px unit">
          The theme keeps MUI&apos;s default spacing, so in <code>sx</code> and <code>theme.spacing()</code> one unit is{' '}
          <code>{lightTheme.spacing(1)}</code>: <code>{'sx={{ p: 2 }}'}</code> is {lightTheme.spacing(2)}, which is{' '}
          <code>spacing[4]</code> in the token scale.
        </Callout>
        <DocTable
          label="Spacing tokens"
          head={['Token', 'Value', 'Size']}
          mono={[0, 1]}
          rows={Object.entries(spacing)
            .sort(([a], [b]) => Number(a) - Number(b))
            .filter(([, v]) => parseFloat(v) <= 96)
            .map(([k, v]) => [
              `spacing[${k}]`,
              v,
              <Box key="b" aria-hidden sx={{ width: v, height: 12, borderRadius: 1, bgcolor: 'primary.main' }} />,
            ])}
        />
        <p>
          The scale continues past 96px up to <code>spacing[96]</code> ({spacing[96]}) for layout.
        </p>
      </Section>

      <Section id="radius" title="Corner radius">
        <p>
          <code>radius</code> holds the corner tokens. The theme&apos;s <code>shape.borderRadius</code> is{' '}
          <code>{lightTheme.shape.borderRadius}px</code>.
        </p>
        <Box
          component="ul"
          aria-label="Radius tokens"
          sx={{ '&&': { listStyle: 'none', p: 0, m: 0, my: 3 }, display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)' }, gap: 2 }}
        >
          {Object.entries(radius).map(([k, v]) => (
            <Box component="li" key={k} sx={{ '&&': { m: 0 }, textAlign: 'center' }}>
              <Box aria-hidden sx={{ height: 64, border: 2, borderColor: 'primary.main', bgcolor: 'action.hover', borderRadius: v }} />
              <Box sx={{ mt: 1, fontSize: 13, fontWeight: 700, color: 'text.primary', fontFamily: MONO }}>{k}</Box>
              <Box sx={{ fontSize: 12, color: 'text.secondary', fontFamily: MONO }}>{v}</Box>
            </Box>
          ))}
        </Box>
        <p>
          For example, <code>Button</code> uses <code>radius.md</code> ({radius.md}) and <code>Card</code> uses{' '}
          <code>radius.lg</code> ({radius.lg}).
        </p>
      </Section>

      <Section id="change-font" title="Change the font">
        <p>
          Load the font, then build the theme with it. With Next.js, <code>next/font</code> self-hosts the files and
          gives you a CSS variable:
        </p>
        <CodeBlock code={FONT_LAYOUT} title="app/layout.tsx" label="Load a font with next/font" />
        <p>
          Then set the font on the theme. Merging only <code>typography.fontFamily</code> into an existing theme is not
          enough: MUI computed every text variant when <code>lightTheme</code> was created, so set it on each variant
          too.
        </p>
        <CodeBlock code={FONT_THEME} title="theme.ts" label="Set the font on the theme" />
        <p>
          This changes MUI&apos;s <code>Typography</code>, the page body, stock MUI components, and the Sorbet
          components that inherit the font: {inherits.map((n, i) => (
            <span key={n}>
              <code>{n}</code>
              {i < inherits.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>

        <H3 id="token-font-components">Components with their own font</H3>
        <p>
          The rest set the token stack in their own styles:{' '}
          {tokenFont.map((n, i) => (
            <span key={n}>
              <code>{n}</code>
              {i < tokenFont.length - 1 ? ', ' : '.'}
            </span>
          ))}{' '}
          To move one of them to your font, override its MUI root in the theme with a doubled class:
        </p>
        <CodeBlock code={FONT_COMPONENTS} title="theme.ts" label="Override a component's font" />
        <p>
          Some of these set the font on an inner part rather than the root; inspect the element and target that part (
          <A href="/docs/customization/override-styles#slots">slots and classes</A>).
        </p>
      </Section>

      <Section id="change-radius" title="Change the corner radius">
        <p>
          <code>shape.borderRadius</code> reaches stock MUI components and the outlined input of <code>TextField</code>.
          Sorbet components that set a token radius (<code>Button</code>, <code>Card</code>, <code>Chip</code> and
          others) keep it; override those per component.
        </p>
        <CodeBlock code={RADIUS} title="theme.ts" label="Change the radius" />
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/customization/override-styles', title: 'Overriding styles', note: 'Why the doubled class wins.' },
            { href: '/docs/customization/colors', title: 'Colors and tokens', note: 'The color half of the tokens.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
