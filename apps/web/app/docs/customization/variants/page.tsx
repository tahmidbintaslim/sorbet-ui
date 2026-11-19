import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import ExampleViewer from '@/components/docs/ExampleViewer';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks } from '../../_shared/parts';
import A from '../../_shared/A';
import { componentFacts } from '../../_shared/source';
import { VariantMatrix } from '../demos';
import { getVariantStyles, type SorbetVariant } from '@sorbet-ui/core';
import { componentSizes } from '@sorbet-ui/tokens';

export const metadata: Metadata = pageMeta({
  title: 'Variants, colors and sizes',
  description: 'The one shared API: five variants, seven colors and five sizes on every component.',
  path: '/docs/customization/variants',
});

const toc: TocItem[] = [
  { id: 'the-api', label: 'The API', depth: 2 },
  { id: 'matrix', label: 'Every variant, every color', depth: 2 },
  { id: 'variant-matrix', label: 'Live matrix', depth: 3 },
  { id: 'variants', label: 'Variants', depth: 2 },
  { id: 'button-extras', label: "Button's dash and link", depth: 3 },
  { id: 'sizes', label: 'Sizes', depth: 2 },
  { id: 'support', label: 'Which components support what', depth: 2 },
  { id: 'how-it-maps', label: 'How variants map to styles', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const API = `import { Alert, Button, Chip, TextField } from '@sorbet-ui/react';

<Button variant="soft" color="success" size="lg">Publish</Button>
<Chip variant="outlined" color="warning" size="sm" label="Draft" />
<TextField variant="soft" color="info" size="md" label="Project name" />
<Alert variant="solid" color="danger" size="sm">Payment failed.</Alert>`;

const MATRIX_SOURCE = `'use client';
import { Button } from '@sorbet-ui/react';

const COLORS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;
const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain', 'dash', 'link'] as const;

export default function Matrix({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <table>
      <tbody>
        {VARIANTS.map((v) => (
          <tr key={v}>
            <th scope="row">{v}</th>
            {COLORS.map((c) => (
              <td key={c}>
                <Button variant={v} color={c} size={size}>Save</Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`;

const PRESETS = `'use client';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getVariantCss, getVariantStyles } from '@sorbet-ui/core';

// The raw colors for a variant and color, in light or dark mode.
const soft = getVariantStyles('soft', 'success', false);
console.log(soft.backgroundColor, soft.color); // the alpha12 tint and the dark shade

// Or a ready-made style object with hover, active, focus and disabled states.
export function RemoveButton() {
  const isDark = useTheme().palette.mode === 'dark';
  return (
    <Box component="button" type="button" sx={getVariantCss('outlined', 'danger', isDark)}>
      Remove
    </Box>
  );
}`;

const VARIANT_INFO: Record<SorbetVariant, string> = {
  solid: 'A filled shape for the main action. The strongest emphasis.',
  soft: 'A tinted fill. Strong enough to notice, calm enough to repeat in a list.',
  outlined: 'A colored border and colored text on the surface.',
  ghost: 'A neutral border and text that take the color on hover. For toolbars and secondary actions.',
  plain: 'Colored text only, with a tint on hover. The lightest touch.',
};

export default function Page() {
  const facts = componentFacts();

  return (
    <GuidePage href="/docs/customization/variants" toc={toc} doodle="jar" aside="mix and match">
      <p>
        Every Sorbet component takes the same three props: <code>variant</code> for the shape of its emphasis,{' '}
        <code>color</code> for its role, and <code>size</code>. Learn them once and they work everywhere, from a{' '}
        <code>Button</code> to a <code>Table</code>.
      </p>

      <Section id="the-api" title="The API">
        <CodeBlock code={API} label="variant, color and size" />
        <DocTable
          label="Prop values"
          head={['Prop', 'Values']}
          mono={[0, 1]}
          rows={[
            ['variant', "'solid' | 'soft' | 'outlined' | 'ghost' | 'plain'  (Button also 'dash' | 'link')"],
            ['color', "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'"],
            ['size', "'xs' | 'sm' | 'md' | 'lg' | 'xl'"],
          ]}
        />
        <p>
          The types are exported from <code>@sorbet-ui/core</code> as <code>SorbetVariant</code>,{' '}
          <code>SorbetButtonVariant</code>, <code>SorbetColor</code> and <code>SorbetSize</code>, for your own components.
          What each color means is on <A href="/docs/customization/colors#roles">Colors and tokens</A>.
        </p>
      </Section>

      <Section id="matrix" title="Every variant, every color">
        <p>Switch between Button and Chip and try each size. Hover and focus the buttons to see their states.</p>
        <ExampleViewer id="variant-matrix" title="Live matrix" description="Real Sorbet components: variants down, colors across." source={MATRIX_SOURCE} file="Matrix.tsx">
          <VariantMatrix />
        </ExampleViewer>
      </Section>

      <Section id="variants" title="Variants">
        <DocTable
          label="Variants"
          head={['Variant', 'Use it for']}
          rows={(Object.keys(VARIANT_INFO) as SorbetVariant[]).map((v) => [v, VARIANT_INFO[v]])}
        />
        <p>
          A screen reads best with one <code>solid</code> action per area. Use <code>soft</code> or{' '}
          <code>outlined</code> for the rest, and <code>ghost</code> or <code>plain</code> where there are many.
        </p>

        <H3 id="button-extras">Button&apos;s dash and link</H3>
        <ul>
          <li>
            <code>dash</code>: a dashed border, for &ldquo;add&rdquo; and drop-target actions.
          </li>
          <li>
            <code>link</code>: underlined text with no padding, for an action that sits inside a sentence. It is still a{' '}
            <code>&lt;button&gt;</code>; to go to a page, render a link (see{' '}
            <A href="/docs/guides/routing">Routing and links</A>).
          </li>
        </ul>
      </Section>

      <Section id="sizes" title="Sizes">
        <p>
          Sizes come from <code>componentSizes</code> in <code>@sorbet-ui/tokens</code>; each component has its own
          row. For Button:
        </p>
        <DocTable
          label="Button sizes"
          head={['Size', 'Height', 'Padding', 'Font size', 'Icon']}
          mono={[0, 1, 2, 3, 4]}
          rows={Object.entries(componentSizes.button).map(([k, v]) => [k, v.height, v.padding, v.fontSize, v.iconSize])}
        />
        <Callout tone="warning" title="Touch targets">
          <code>xs</code> and <code>sm</code> buttons are 24px and 32px tall. On touch screens, keep primary actions at{' '}
          <code>md</code> or larger, or give small ones enough space around them.
        </Callout>
      </Section>

      <Section id="support" title="Which components support what">
        <p>
          All {facts.length} components accept <code>variant</code>, <code>color</code> and <code>size</code>. Their
          defaults differ: an Alert starts <code>soft</code> and <code>info</code>, a Card <code>outlined</code> and{' '}
          <code>neutral</code>. This table is read from <code>packages/react/src</code> when the site is built.
        </p>
        <DocTable
          label="Variant, color and size defaults per component"
          head={['Component', 'Variants', 'Default variant', 'Default color', 'Default size']}
          mono={[0, 2, 3, 4]}
          rows={facts.map((f) => [
            f.name,
            f.variants.length > 5 ? `all 5 + ${f.variants.filter((v) => !(v in VARIANT_INFO)).join(', ')}` : 'all 5',
            f.defaults.variant,
            f.defaults.color,
            f.defaults.size,
          ])}
        />
        <p>
          Two components also accept MUI&apos;s own values in <code>variant</code> for drop-in compatibility:{' '}
          <code>Menu</code> (<code>&apos;menu&apos;</code>, <code>&apos;selectedMenu&apos;</code>; prefer{' '}
          <code>focusVariant</code>) and <code>Skeleton</code> (its shapes; prefer <code>shape</code>).
        </p>
      </Section>

      <Section id="how-it-maps" title="How variants map to styles">
        <p>
          The variant rules live in <code>packages/core/src/presets.ts</code>. For a variant, a color and the mode,{' '}
          <code>getVariantStyles</code> returns the colors for the rest, hover, active, focus and disabled states, all
          taken from the color&apos;s scale (<code>colorScaleForMode</code>). Here is primary in light mode, from that
          function:
        </p>
        <DocTable
          label="Primary variant styles, light mode"
          head={['Variant', 'Background', 'Text', 'Border', 'Hover background']}
          mono={[0, 1, 2, 3, 4]}
          rows={(Object.keys(VARIANT_INFO) as SorbetVariant[]).map((v) => {
            const s = getVariantStyles(v, 'primary', false);
            return [v, s.backgroundColor, s.color, s.borderWidth === '0px' ? 'none' : `${s.borderWidth} ${s.borderColor}`, s.hoverBackgroundColor];
          })}
        />
        <p>
          The pattern: <code>solid</code> fills with <code>main</code> under <code>contrastText</code>; <code>soft</code>{' '}
          tints with <code>alpha12</code> under the <code>dark</code> shade (<code>alpha20</code> and <code>light</code>{' '}
          in dark mode); <code>outlined</code> and <code>plain</code> use <code>main</code> as text; <code>ghost</code>{' '}
          stays neutral until hover. Each of those pairs is in the contrast tests. Components keep their own styled
          copies of these rules (Button&apos;s live in <code>Button.tsx</code>); <code>presets.test.ts</code> checks the
          presets against the same contrast bar.
        </p>
        <p>Use the presets to give your own component the Sorbet variants:</p>
        <CodeBlock code={PRESETS} label="Variant presets from @sorbet-ui/core" />
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/customization/override-styles', title: 'Overriding styles', note: 'Change a variant for one instance or all.' },
            { href: '/docs/components', title: 'Components', note: 'Each component with a playground.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
