import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks } from '../_shared/parts';
import A from '../_shared/A';
import { darkTheme, lightTheme, sorbetComponents } from '@sorbet-ui/theme';
import { colorScaleForMode, type SemanticColor } from '@sorbet-ui/tokens';

export const metadata: Metadata = pageMeta({
  title: 'Theming',
  description: 'The light and dark themes, and how to extend them like any MUI theme.',
  path: '/docs/theming',
});

const toc: TocItem[] = [
  { id: 'use-the-themes', label: 'Use the themes', depth: 2 },
  { id: 'whats-in-the-theme', label: "What's in the theme", depth: 2 },
  { id: 'palette', label: 'Palette', depth: 3 },
  { id: 'shape-and-type', label: 'Shape and type', depth: 3 },
  { id: 'restyled-mui', label: 'Restyled MUI components', depth: 3 },
  { id: 'extend', label: 'Extend the theme', depth: 2 },
  { id: 'brand-colors', label: 'Use your brand colors', depth: 2 },
  { id: 'contrast-rule', label: 'The contrast rule', depth: 3 },
  { id: 'component-overrides', label: 'Theme-level component overrides', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const PROVIDERS = `// app/providers.tsx
'use client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const EXTEND = `// theme.ts
import type { ThemeOptions } from '@mui/material/styles';
import { createTheme, darkTheme, lightTheme } from '@sorbet-ui/theme';

// One set of changes, applied to both themes.
const changes: ThemeOptions = {
  components: {
    MuiTooltip: { defaultProps: { arrow: true } },
    MuiAppBar: { defaultProps: { elevation: 0 } },
  },
};

export const appLight = createTheme(lightTheme, changes);
export const appDark = createTheme(darkTheme, changes);`;

const BRAND_MUI = `import { createTheme, darkTheme, lightTheme } from '@sorbet-ui/theme';

// Stock @mui/material components read these. Pick shades per mode:
// a darker one for the white page, a lighter one for the dark page.
export const appLight = createTheme(lightTheme, {
  palette: { primary: { main: '#7c3aed', dark: '#6d28d9', contrastText: '#ffffff' } },
});
export const appDark = createTheme(darkTheme, {
  palette: { primary: { main: '#a78bfa', dark: '#c4b5fd', contrastText: '#0f172a' } },
});`;

const CHECK = `import { getContrastRatio } from '@mui/material/styles';

const AA = 4.5; // WCAG 2.1 AA, normal-size text
const pairs = [
  ['#ffffff', '#7c3aed'], // label on the light solid fill
  ['#ffffff', '#6d28d9'], // label on its hover shade
  ['#7c3aed', '#ffffff'], // outlined and text buttons on the white page
  ['#0f172a', '#a78bfa'], // label on the dark solid fill
  ['#a78bfa', '#111827'], // text buttons on the dark page
];
for (const [fg, bg] of pairs) {
  const ratio = getContrastRatio(fg, bg);
  if (ratio < AA) throw new Error(\`\${fg} on \${bg} is \${ratio.toFixed(2)}:1\`);
}`;

const OVERRIDES = `import type { Theme } from '@mui/material/styles';
import { createTheme, lightTheme } from '@sorbet-ui/theme';

export const theme = createTheme(lightTheme, {
  components: {
    // Defaults for every instance of a component.
    MuiTextField: { defaultProps: { fullWidth: true } },
    // Styles for every instance. Merged with the Sorbet overrides already there.
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({ borderBottom: \`1px solid \${theme.palette.divider}\` }),
      },
    },
  },
});`;

// MUI's palette keys and the Sorbet role each one is built from (packages/theme/src/theme.ts).
type PaletteKey = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
const PALETTE: [PaletteKey, SemanticColor][] = [
  ['primary', 'primary'],
  ['secondary', 'neutral'],
  ['success', 'success'],
  ['warning', 'warning'],
  ['error', 'danger'],
  ['info', 'info'],
];

function Hex({ value }: { value: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span aria-hidden style={{ width: 14, height: 14, borderRadius: 4, background: value, boxShadow: 'inset 0 0 0 1px rgba(127,127,127,.4)', flexShrink: 0 }} />
      {value}
    </span>
  );
}

export default function Page() {
  // Read from the real themes, and fail the build if the mapping above drifts.
  const rows = PALETTE.map(([key, role]) => {
    const light = lightTheme.palette[key].main;
    const dark = darkTheme.palette[key].main;
    if (light !== colorScaleForMode(role, false).main || dark !== colorScaleForMode(role, true).main) {
      throw new Error(`theming page: palette.${key} is no longer built from the ${role} tokens`);
    }
    return [`palette.${key}`, <code key="r">{role}</code>, <Hex key="l" value={light} />, <Hex key="d" value={dark} />];
  });
  const overridden = Object.keys(sorbetComponents);

  return (
    <GuidePage href="/docs/theming" toc={toc} doodle="jar" aside="your recipe">
      <p>
        <code>@sorbet-ui/theme</code> exports two ordinary Material UI themes, <code>lightTheme</code> and{' '}
        <code>darkTheme</code>. Wrap your app in one and every Sorbet component, and every stock{' '}
        <code>@mui/material</code> component, picks up the Sorbet look.
      </p>

      <Section id="use-the-themes" title="Use the themes">
        <p>
          Pass a theme to MUI&apos;s <code>ThemeProvider</code> and add <code>CssBaseline</code> for the page
          background, text color and font smoothing.
        </p>
        <CodeBlock code={PROVIDERS} title="app/providers.tsx" label="Theme provider" />
        <p>
          A theme holds functions (style overrides are functions of the theme), so it cannot cross from a Server
          Component into a Client Component as a prop. In the Next.js App Router, create the provider in a file
          marked <code>&apos;use client&apos;</code>, as above, and render it from your root layout. The{' '}
          <A href="/docs/guides/server-rendering">server rendering guide</A> has the full setup.
        </p>
        <p>
          To switch between light and dark, pick the theme by mode. <A href="/docs/customization/dark-mode">Dark mode</A>{' '}
          shows how to follow the system setting and remember a toggle.
        </p>
      </Section>

      <Section id="whats-in-the-theme" title="What's in the theme">
        <p>
          Both themes are built from the <code>@sorbet-ui/tokens</code> scales. The values below are read from the
          themes this page imports, so they match the version you install.
        </p>

        <H3 id="palette">Palette</H3>
        <p>
          MUI has six palette keys; Sorbet has seven color roles. Each key is built from one role. Note the two that
          differ by name: MUI&apos;s <code>secondary</code> is Sorbet&apos;s <code>neutral</code> (slate), and{' '}
          <code>error</code> is <code>danger</code>.
        </p>
        <DocTable label="Theme palette" head={['Key', 'Sorbet role', 'lightTheme main', 'darkTheme main']} rows={rows} mono={[0, 2, 3]} />
        <p>
          Dark mode uses lighter shades because the light-theme shades are too dark to read on the dark page. Page
          colors: <code>background.default</code> is <code>{lightTheme.palette.background.default}</code> in light
          and <code>{darkTheme.palette.background.default}</code> in dark, with <code>background.paper</code> at{' '}
          <code>{darkTheme.palette.background.paper}</code> for dark cards and menus.
        </p>

        <H3 id="shape-and-type">Shape and type</H3>
        <ul>
          <li>
            <code>shape.borderRadius</code> is <code>{lightTheme.shape.borderRadius}</code> (px).
          </li>
          <li>
            <code>typography.fontFamily</code> is the system stack <code>{lightTheme.typography.fontFamily}</code>.
            Buttons use sentence case (<code>textTransform: &apos;none&apos;</code>) at weight{' '}
            <code>{String(lightTheme.typography.button.fontWeight)}</code>.
          </li>
          <li>
            Spacing and breakpoints are MUI&apos;s defaults: <code>theme.spacing(1)</code> is{' '}
            <code>{lightTheme.spacing(1)}</code>.
          </li>
        </ul>
        <p>
          <A href="/docs/customization/typography">Typography and spacing</A> covers the token scales and how to
          change the font and radius.
        </p>

        <H3 id="restyled-mui">Restyled MUI components</H3>
        <p>
          The themes also carry style overrides for {overridden.length} stock MUI components, so an existing MUI
          screen restyles with no code changes:
        </p>
        <p>
          {overridden.map((name, i) => (
            <span key={name}>
              <code>{name}</code>
              {i < overridden.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
        <p>
          They are exported on their own as <code>sorbetComponents</code> if you build a theme from scratch.
        </p>
      </Section>

      <Section id="extend" title="Extend the theme">
        <p>
          Pass a Sorbet theme as the first argument to <code>createTheme</code> and your changes as the second. MUI
          deep-merges them, so you only write what changes. <code>@sorbet-ui/theme</code> re-exports MUI&apos;s{' '}
          <code>createTheme</code>.
        </p>
        <CodeBlock code={EXTEND} title="theme.ts" label="Extend both themes" />
        <p>Apply the same changes to both themes, then pick between them by mode.</p>
        <Callout tone="warning" title="Changing the font needs more than typography.fontFamily">
          MUI computes each text variant (<code>body1</code>, <code>h4</code> and so on) when the theme is created,
          so merging a new <code>typography.fontFamily</code> into an existing theme leaves those variants on the old
          font. <A href="/docs/customization/typography#change-font">Change the font</A> shows the version that
          works.
        </Callout>
      </Section>

      <Section id="brand-colors" title="Use your brand colors">
        <p>Colors reach two kinds of components in two different ways:</p>
        <ul>
          <li>
            <strong>Stock <code>@mui/material</code> components</strong> (and anything that reads{' '}
            <code>theme.palette</code>) take their colors from the theme palette. Change the palette and they follow.
          </li>
          <li>
            <strong>Sorbet components</strong> take their colors straight from the <code>@sorbet-ui/tokens</code>{' '}
            scales, picked by mode. A palette change in the theme does not reach them.
          </li>
        </ul>
        <p>For stock MUI components, override the palette per theme:</p>
        <CodeBlock code={BRAND_MUI} title="theme.ts" label="Brand palette for stock MUI components" />
        <p>
          To recolor the Sorbet components too, change the scale in <code>packages/tokens/src/colors.ts</code> in
          your copy of the repository and rebuild. Run the contrast tests after every change (see{' '}
          <A href="/docs/customization/colors#contrast">the contrast guarantee</A>).
        </p>

        <H3 id="contrast-rule">The contrast rule</H3>
        <p>
          Components put <code>main</code> behind <code>contrastText</code> (solid fills) and use <code>main</code> as
          text on the page (outlined, plain and link styles). So each shade has to reach WCAG AA, 4.5:1, both ways:
        </p>
        <ul>
          <li>
            <code>contrastText</code> on <code>main</code> and on <code>dark</code> (the hover shade).
          </li>
          <li>
            <code>main</code> and <code>dark</code> as text on the page: white in light mode,{' '}
            <code>{darkTheme.palette.background.default}</code> in dark mode.
          </li>
        </ul>
        <p>
          No single shade passes on both a white and a near-black page, which is why each mode gets its own. Check
          your pairs before you ship them:
        </p>
        <CodeBlock code={CHECK} title="check-brand.ts" label="Check brand colors for contrast" />
      </Section>

      <Section id="component-overrides" title="Theme-level component overrides">
        <p>
          Use <code>components</code> to set default props and styles for every instance of a MUI component. Your
          entries merge with the Sorbet ones already in the theme.
        </p>
        <CodeBlock code={OVERRIDES} title="theme.ts" label="Component overrides in the theme" />
        <Callout title="Sorbet components keep their own styles">
          Sorbet components are built on MUI, so overrides for the underlying MUI component reach them, but a Sorbet
          component&apos;s own styles win wherever both set the same property. A <code>MuiButton</code> border radius
          in the theme changes stock buttons, not the Sorbet <code>Button</code>.{' '}
          <A href="/docs/customization/override-styles">Overriding styles</A> explains the order and how to win it.
        </Callout>
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/customization/colors', title: 'Colors and tokens', note: 'The seven roles and every scale.' },
            { href: '/docs/customization/dark-mode', title: 'Dark mode', note: 'System setting, toggle, no flash.' },
            { href: '/docs/customization/variants', title: 'Variants, colors and sizes', note: 'The shared component API.' },
            { href: '/docs/customization/override-styles', title: 'Overriding styles', note: 'sx, styled() and the cascade.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
