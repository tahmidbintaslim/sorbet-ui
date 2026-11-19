import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks, Steps } from '../../_shared/parts';
import A from '../../_shared/A';
import {
  backgrounds,
  borderColors,
  colorPalette,
  darkModeColorPalette,
  textColors,
  type ColorScale,
  type SemanticColor,
} from '@sorbet-ui/tokens';

export const metadata: Metadata = pageMeta({
  title: 'Colors and tokens',
  description: 'The seven color roles, the palette scales and the design tokens behind them.',
  path: '/docs/customization/colors',
});

const toc: TocItem[] = [
  { id: 'roles', label: 'The seven roles', depth: 2 },
  { id: 'scales', label: 'Palette scales', depth: 2 },
  { id: 'shades', label: 'Shades 50 to 900', depth: 3 },
  { id: 'role-shades', label: 'Role shades, light and dark', depth: 3 },
  { id: 'surfaces', label: 'Surfaces, text and borders', depth: 3 },
  { id: 'use-tokens', label: 'Use the tokens', depth: 2 },
  { id: 'contrast', label: 'The contrast guarantee', depth: 2 },
  { id: 'add-pair', label: 'Add a color pair safely', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const ROLES: { name: SemanticColor; hue: string; use: string }[] = [
  { name: 'primary', hue: 'Sky blue', use: 'The main action on a screen, links, focus and selection.' },
  { name: 'secondary', hue: 'Violet', use: 'A second accent that should not compete with primary: tags, highlights, promos.' },
  { name: 'success', hue: 'Emerald', use: 'Completed work and positive states: saved, paid, online.' },
  { name: 'warning', hue: 'Amber', use: 'Needs attention but is not broken: expiring, near a limit, unsaved.' },
  { name: 'danger', hue: 'Rose', use: 'Errors and destructive actions: delete, failed, invalid.' },
  { name: 'info', hue: 'Cyan', use: 'Neutral news and hints: tips, release notes, helper messages.' },
  { name: 'neutral', hue: 'Slate', use: 'Everything that should stay quiet: secondary buttons, cancel, chrome.' },
];

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;
const ROLE_KEYS = ['main', 'dark', 'light', 'contrastText'] as const;

const USE = `'use client';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colorScaleForMode } from '@sorbet-ui/tokens';

// A status pill in the "soft" style, using the same pairs the components use
// (both are covered by the contrast tests).
export function StatusPill({ children }: { children: React.ReactNode }) {
  const isDark = useTheme().palette.mode === 'dark';
  const scale = colorScaleForMode('success', isDark);
  return (
    <Box
      component="span"
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 999,
        bgcolor: isDark ? scale.alpha20 : scale.alpha12,
        color: isDark ? scale.light : scale.dark,
      }}
    >
      {children}
    </Box>
  );
}`;

const PAIR_TEST = `// packages/tokens/src/contrast.test.ts
// Your component puts warning \`dark\` text on a neutral 100 banner (light mode).
describe('release banner', () => {
  it('warning dark on neutral 100 reaches 4.5:1', () => {
    expect(contrast(colorPalette.warning.dark, colorPalette.neutral[100])).toBeGreaterThanOrEqual(AA_TEXT);
  });

  // Dark mode: the banner sits on paper, so composite over the paper color.
  it('warning light on the alpha20 tint over dark paper reaches 4.5:1', () => {
    const paper = backgrounds.dark.paper;
    expect(contrast(darkModeColorPalette.warning.light, darkModeColorPalette.warning.alpha20, paper)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});`;

const RUN = `pnpm --filter @sorbet-ui/tokens test`;

function Chip({ value }: { value: string }) {
  return (
    <Box
      aria-hidden
      sx={{ height: 40, borderRadius: 2, bgcolor: value, border: 1, borderColor: 'divider' }}
    />
  );
}

function Swatch({ label, value }: { label: string; value: string }) {
  return (
    <Box component="li" sx={{ minWidth: 0, '&&': { m: 0 } }}>
      <Chip value={value} />
      <Box sx={{ mt: 0.75, fontSize: 12, lineHeight: 1.4 }}>
        <Box component="span" sx={{ display: 'block', fontWeight: 700, color: 'text.primary' }}>
          {label}
        </Box>
        <Box component="span" sx={{ display: 'block', fontFamily: 'var(--font-mono), ui-monospace, monospace', color: 'text.secondary', wordBreak: 'break-all' }}>
          {value}
        </Box>
      </Box>
    </Box>
  );
}

function Grid({ label, cols, children }: { label: string; cols: { xs: number; sm: number }; children: React.ReactNode }) {
  return (
    <Box
      component="ul"
      aria-label={label}
      sx={{
        '&&': { listStyle: 'none', p: 0, m: 0 },
        display: 'grid',
        gridTemplateColumns: { xs: `repeat(${cols.xs}, minmax(0, 1fr))`, sm: `repeat(${cols.sm}, minmax(0, 1fr))` },
        gap: 1.5,
      }}
    >
      {children}
    </Box>
  );
}

function RoleHeading({ name }: { name: string }) {
  return (
    <Box component="p" sx={{ '&&': { mt: 3, mb: 1, color: 'text.primary' }, fontWeight: 700, fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 14 }}>
      {name}
    </Box>
  );
}

function RoleShades({ scale, mode, name }: { scale: ColorScale; mode: string; name: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>{mode}</Box>
      <Grid label={`${name} role shades, ${mode}`} cols={{ xs: 2, sm: 4 }}>
        {ROLE_KEYS.map((k) => (
          <Swatch key={k} label={k} value={scale[k]} />
        ))}
      </Grid>
    </Box>
  );
}

export default function Page() {
  return (
    <GuidePage href="/docs/customization/colors" toc={toc} doodle="jar" aside="seven flavors">
      <p>
        Every Sorbet component takes a <code>color</code> prop with one of seven roles. Each role is a full scale in{' '}
        <code>@sorbet-ui/tokens</code>, and every color pair the components draw is checked for WCAG AA contrast in
        light and dark mode. The swatches on this page are rendered from those token objects.
      </p>

      <Section id="roles" title="The seven roles">
        <p>Pick a role by meaning, not by hue. Then a rebrand changes the hue and every screen still reads right.</p>
        <DocTable
          label="Color roles"
          head={['Role', 'Hue', 'Use it for', 'main (light)', 'main (dark)']}
          mono={[0, 3, 4]}
          rows={ROLES.map((r) => [
            r.name,
            r.hue,
            r.use,
            <Hex key="l" value={colorPalette[r.name].main} />,
            <Hex key="d" value={darkModeColorPalette[r.name].main} />,
          ])}
        />
        <CodeBlock code={`<Button color="danger">Delete</Button>\n<Chip color="success" label="Paid" />\n<Alert color="warning">Your trial ends in 3 days.</Alert>`} label="The color prop" />
      </Section>

      <Section id="scales" title="Palette scales">
        <p>
          A <code>ColorScale</code> has ten shades (<code>50</code> to <code>900</code>), four role shades (
          <code>main</code>, <code>dark</code>, <code>light</code>, <code>contrastText</code>) and six translucent tints
          of the 500 shade (<code>alpha8</code>, <code>alpha12</code>, <code>alpha16</code>, <code>alpha20</code>,{' '}
          <code>alpha30</code>, <code>alpha40</code>) for soft fills and hovers.
        </p>

        <H3 id="shades">Shades 50 to 900</H3>
        <p>
          From <code>colorPalette</code>. The numbered shades are the same in both modes.
        </p>
        {ROLES.map((r) => (
          <Box key={r.name}>
            <RoleHeading name={r.name} />
            <Grid label={`${r.name} shades`} cols={{ xs: 5, sm: 10 }}>
              {STEPS.map((s) => (
                <Swatch key={s} label={s} value={colorPalette[r.name][s]} />
              ))}
            </Grid>
          </Box>
        ))}

        <H3 id="role-shades">Role shades, light and dark</H3>
        <p>
          The role shades change with the mode. Light mode (<code>colorPalette</code>) uses darker shades that read on
          white, with white labels on solid fills. Dark mode (<code>darkModeColorPalette</code>) moves{' '}
          <code>main</code> to a lighter shade that reads on the dark page, and puts dark ink (
          <code>{darkModeColorPalette.primary.contrastText}</code>) on solid fills. Components pick the scale with{' '}
          <code>colorScaleForMode(color, isDark)</code>.
        </p>
        {ROLES.map((r) => (
          <Box key={r.name}>
            <RoleHeading name={r.name} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <RoleShades scale={colorPalette[r.name]} mode="light" name={r.name} />
              <RoleShades scale={darkModeColorPalette[r.name]} mode="dark" name={r.name} />
            </Box>
          </Box>
        ))}

        <H3 id="surfaces">Surfaces, text and borders</H3>
        <p>
          <code>backgrounds</code>, <code>textColors</code> and <code>borderColors</code> hold the neutral colors for
          each mode.
        </p>
        <DocTable
          label="Surface, text and border tokens"
          head={['Token', 'Light', 'Dark']}
          mono={[0, 1, 2]}
          rows={[
            ...(['default', 'paper', 'subtle', 'muted'] as const).map((k) => [
              `backgrounds.*.${k}`,
              <Hex key="l" value={backgrounds.light[k]} />,
              <Hex key="d" value={backgrounds.dark[k]} />,
            ]),
            ...(['primary', 'secondary', 'disabled', 'hint'] as const).map((k) => [
              `textColors.*.${k}`,
              <Hex key="l" value={textColors.light[k]} />,
              <Hex key="d" value={textColors.dark[k]} />,
            ]),
            ...(['default', 'subtle', 'strong'] as const).map((k) => [
              `borderColors.*.${k}`,
              <Hex key="l" value={borderColors.light[k]} />,
              <Hex key="d" value={borderColors.dark[k]} />,
            ]),
          ]}
        />
      </Section>

      <Section id="use-tokens" title="Use the tokens">
        <p>
          In your own components, pick the scale for the current mode with <code>colorScaleForMode</code> and reuse a
          pair the components already use. Those pairs are tested; a new pair is not until you add a test.
        </p>
        <CodeBlock code={USE} title="StatusPill.tsx" label="Use a color scale" />
        <p>
          <code>@sorbet-ui/tokens</code> also exports <code>textColorsForMode(isDark)</code> for body and secondary text,
          and the plain objects above for anything that is not mode-aware.
        </p>
      </Section>

      <Section id="contrast" title="The contrast guarantee">
        <p>
          <code>packages/tokens/src/contrast.test.ts</code> computes the WCAG 2.1 contrast ratio of every color pair the
          components draw and fails if normal text drops below 4.5:1. Translucent tints are composited over the page or
          card color first, so the test measures what you actually see. It covers:
        </p>
        <ul>
          <li>
            <strong>Light mode, per role:</strong> <code>contrastText</code> on <code>main</code> and <code>dark</code>{' '}
            (solid and its hover), <code>main</code> and <code>dark</code> on white (outlined, plain, link), and{' '}
            <code>dark</code> on the <code>alpha8</code>, <code>alpha12</code> and <code>alpha20</code> tints (soft and
            hover states).
          </li>
          <li>
            <strong>Dark mode, per role:</strong> the same pairs from <code>darkModeColorPalette</code> on the dark page
            and on dark paper, plus the pressed shade under solid labels.
          </li>
          <li>
            <strong>Theme palette:</strong> the shades <code>lightTheme</code> and <code>darkTheme</code> give stock MUI
            components.
          </li>
          <li>
            <strong>Stacked tints:</strong> Accordion, Menu and Stepper put text on two layers of tint; those layers
            are composited in order.
          </li>
        </ul>
        <p>Run it from the repository root:</p>
        <CodeBlock code={RUN} title="Terminal" label="Run the contrast tests" />
        <Callout title="The site is tested too">
          The docs site runs axe on every page in light and dark mode, and Storybook runs axe on every story, so a pair
          that slips past the token tests still fails a check before release. See{' '}
          <A href="/docs/guides/accessibility#testing">how we test</A>.
        </Callout>
      </Section>

      <Section id="add-pair" title="Add a color pair safely">
        <p>
          A new pair is any foreground on a background that the tests do not cover yet: a new component, a new state,
          or a token used on a surface it was not used on before.
        </p>
        <Steps>
          <li>
            <strong>Name both colors from tokens.</strong> Never a hex value in the component; a token can be tested, a
            literal cannot.
          </li>
          <li>
            <strong>Write the test first,</strong> for both modes, against the surface the pair really sits on (page or
            paper). The file already has <code>contrast()</code> and <code>AA_TEXT</code>.
          </li>
          <li>
            <strong>Run the suite.</strong> If it fails, step one shade further from the background (darker in light
            mode, lighter in dark mode) and run it again.
          </li>
          <li>
            <strong>Check it rendered,</strong> with the Storybook and site axe checks in both themes.
          </li>
        </Steps>
        <CodeBlock code={PAIR_TEST} title="contrast.test.ts" label="A new contrast test" />
        <p>
          Large text (24px, or 18.66px bold) and non-text UI such as borders and icons need 3:1 instead; the file
          already uses 3 for outlined borders in dark mode.
        </p>
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/customization/variants', title: 'Variants, colors and sizes', note: 'See every role on every variant.' },
            { href: '/docs/theming', title: 'Theming', note: 'Brand colors for stock MUI components.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}

function Hex({ value }: { value: string }) {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box aria-hidden component="span" sx={{ width: 14, height: 14, borderRadius: 1, bgcolor: value, flexShrink: 0, border: 1, borderColor: 'divider' }} />
      {value}
    </Box>
  );
}
