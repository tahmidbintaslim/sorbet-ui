import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import ExampleViewer from '@/components/docs/ExampleViewer';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks } from '../../_shared/parts';
import A from '../../_shared/A';
import { OverrideLadder } from '../demos';

export const metadata: Metadata = pageMeta({
  title: 'Overriding styles',
  description: 'Change one instance with sx, every instance with theme overrides, or build your own variant.',
  path: '/docs/customization/override-styles',
});

const toc: TocItem[] = [
  { id: 'which-tool', label: 'Which tool to use', depth: 2 },
  { id: 'sx', label: 'One instance: sx', depth: 2 },
  { id: 'styled', label: 'A reusable variant: styled()', depth: 2 },
  { id: 'theme', label: 'Every instance: the theme', depth: 2 },
  { id: 'slots', label: 'Inner parts: slots and classes', depth: 2 },
  { id: 'cascade', label: 'The cascade order', depth: 2 },
  { id: 'cascade-demo', label: 'See it', depth: 3 },
  { id: 'pitfalls', label: 'Pitfalls', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const SX = `import { Button } from '@sorbet-ui/react';

<Button
  variant="soft"
  sx={{
    borderRadius: 999,              // any CSS property
    px: 3,                          // theme spacing: 3 × 8px
    color: 'text.primary',          // theme palette paths
    '&:hover': { boxShadow: 2 },    // nested selectors and states
    width: { xs: '100%', sm: 'auto' }, // responsive values
  }}
>
  Upgrade
</Button>`;

const STYLED = `import { styled } from '@mui/material/styles';
import { Button } from '@sorbet-ui/react';

// A pill-shaped Button that keeps every Sorbet prop.
export const PillButton = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  paddingInline: theme.spacing(3),
}));

<PillButton variant="outlined" color="secondary">Follow</PillButton>`;

const WRAP = `import { Button, type ButtonProps } from '@sorbet-ui/react';

// Or fix the props instead of the styles: a team-wide "danger action".
export function DangerButton(props: ButtonProps) {
  return <Button variant="soft" color="danger" {...props} />;
}`;

const THEME = `import { createTheme, lightTheme } from '@sorbet-ui/theme';

export const theme = createTheme(lightTheme, {
  components: {
    MuiButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        // Applies to properties Sorbet's Button does not set itself...
        root: { letterSpacing: '0.01em' },
      },
    },
    MuiChip: {
      styleOverrides: {
        // ...and '&&' outranks the ones it does set.
        root: { '&&': { borderRadius: 6 } },
      },
    },
  },
});`;

const SLOTS = `import { TextField } from '@sorbet-ui/react';

// Target an inner part through its MUI class...
<TextField
  label="Search"
  sx={{
    '& .MuiOutlinedInput-root': { borderRadius: 999 },
    '& .MuiInputLabel-root': { fontWeight: 600 },
  }}
/>

// ...or pass props to it through slotProps (MUI v7 and v9).
<TextField
  label="Amount"
  slotProps={{ htmlInput: { inputMode: 'decimal', 'aria-describedby': 'amount-help' } }}
/>`;

const LADDER_SOURCE = `'use client';
import { ThemeProvider } from '@mui/material';
import { createTheme, styled, type Theme } from '@mui/material/styles';
import { Button } from '@sorbet-ui/react';

const Pill = styled(Button)({ borderRadius: 999 });

// Function themes extend the theme around them.
const squared = (outer: Theme) =>
  createTheme(outer, { components: { MuiButton: { styleOverrides: { root: { borderRadius: 2 } } } } });
const squaredStrong = (outer: Theme) =>
  createTheme(outer, { components: { MuiButton: { styleOverrides: { root: { '&&': { borderRadius: 2 } } } } } });

export default function OverrideLadder() {
  return (
    <>
      <Button>Save</Button>                                          {/* 8px: radius.md */}
      <ThemeProvider theme={squared}><Button>Save</Button></ThemeProvider>       {/* still 8px */}
      <ThemeProvider theme={squaredStrong}><Button>Save</Button></ThemeProvider> {/* 2px */}
      <Pill>Save</Pill>                                              {/* pill */}
      <Button sx={{ borderRadius: 0 }}>Save</Button>                 {/* square */}
    </>
  );
}`;

export default function Page() {
  return (
    <GuidePage href="/docs/customization/override-styles" toc={toc} doodle="jar" aside="your way">
      <p>
        Sorbet components are Material UI components with Emotion styles on top, so every MUI styling tool works on
        them. The one thing to know is the order in which those styles win.
      </p>

      <Section id="which-tool" title="Which tool to use">
        <DocTable
          label="Styling tools"
          head={['You want to change', 'Use', 'Where']}
          mono={[]}
          rows={[
            ['One instance', <code key="c">sx</code>, 'The JSX where you render it'],
            ['A reusable look you name', <code key="c">styled()</code>, 'A component file'],
            ['Every instance in the app', <code key="c">components.Mui*</code>, 'The theme'],
            ['An inner part (input, label, icon)', <code key="c">{"'& .Mui*-*'"}</code>, 'Inside sx, styled() or the theme'],
            ['Color, emphasis or size', <code key="c">variant / color / size</code>, 'Props first: they keep contrast tested'],
          ]}
        />
        <Callout title="Try props before styles">
          A <code>variant</code>, <code>color</code> or <code>size</code> change keeps hover, focus, disabled and dark
          mode in step and stays inside the contrast tests. A custom color in <code>sx</code> does neither.
        </Callout>
      </Section>

      <Section id="sx" title="One instance: sx">
        <p>
          <code>sx</code> takes any CSS plus shorthands that read the theme: spacing units, palette paths, breakpoints
          and nested selectors. It wins over the component&apos;s own styles.
        </p>
        <CodeBlock code={SX} label="sx on a Sorbet Button" />
      </Section>

      <Section id="styled" title="A reusable variant: styled()">
        <p>
          Wrap a Sorbet component with MUI&apos;s <code>styled</code> to give a look a name. The result takes the same
          props, and its styles win over the component&apos;s own.
        </p>
        <CodeBlock code={STYLED} title="PillButton.tsx" label="styled() around a Sorbet Button" />
        <p>When the look is really a fixed set of props, a plain wrapper is simpler:</p>
        <CodeBlock code={WRAP} title="DangerButton.tsx" label="A wrapper with fixed props" />
      </Section>

      <Section id="theme" title="Every instance: the theme">
        <p>
          <code>components.MuiX.defaultProps</code> and <code>styleOverrides</code> in the theme reach every instance:
          stock MUI components fully, and Sorbet components through the MUI component they are built on (a Sorbet{' '}
          <code>Button</code> is a <code>MuiButton</code>, a <code>Chip</code> a <code>MuiChip</code>).
        </p>
        <CodeBlock code={THEME} title="theme.ts" label="Theme style overrides" />
        <p>
          A theme override has the same specificity as the Sorbet component&apos;s own styles, and the Sorbet styles are
          applied after it. So it fills in properties Sorbet leaves alone and loses on the ones Sorbet sets. Doubling the
          class with <code>&apos;&amp;&amp;&apos;</code> raises its specificity so it wins. More on the{' '}
          <A href="/docs/theming#component-overrides">theme page</A>.
        </p>
      </Section>

      <Section id="slots" title="Inner parts: slots and classes">
        <p>
          Sorbet keeps MUI&apos;s class names on every part (<code>.MuiButton-startIcon</code>,{' '}
          <code>.MuiOutlinedInput-root</code>, <code>.MuiChip-label</code> and so on). Target them from{' '}
          <code>sx</code>, <code>styled()</code> or a theme override. Find a part&apos;s class in your browser&apos;s
          element inspector or in the MUI API page for that component.
        </p>
        <CodeBlock code={SLOTS} label="Inner parts" />
        <p>
          Use <code>slotProps</code> rather than <code>InputProps</code> / <code>inputProps</code>: MUI v9 removed the
          old props. Sorbet&apos;s <code>TextField</code> still accepts them from v7 code and merges them under{' '}
          <code>slotProps</code>.
        </p>
      </Section>

      <Section id="cascade" title="The cascade order">
        <p>From weakest to strongest, for the same property on the same element:</p>
        <ol>
          <li>MUI&apos;s base styles for the component.</li>
          <li>
            Theme <code>styleOverrides</code> (including the ones in <code>lightTheme</code> and <code>darkTheme</code>).
          </li>
          <li>The Sorbet component&apos;s own styles (variant, color, size).</li>
          <li>
            <code>styled()</code> around the Sorbet component.
          </li>
          <li>
            <code>sx</code>.
          </li>
        </ol>
        <p>
          Specificity beats order: a selector with more classes (<code>&apos;&amp;&amp;&apos;</code>,{' '}
          <code>&apos;&amp;.Mui-disabled&apos;</code>) wins over a later one with fewer, at any step.
        </p>
        <H3 id="cascade-demo">See it</H3>
        <ExampleViewer id="override-ladder" title="One Button, five ways" description="The same border radius change applied at each step. The plain theme override loses; the others win." source={LADDER_SOURCE} file="OverrideLadder.tsx">
          <OverrideLadder />
        </ExampleViewer>
      </Section>

      <Section id="pitfalls" title="Pitfalls">
        <ul>
          <li>
            <strong>A theme override &ldquo;does nothing&rdquo;.</strong> Sorbet sets that property itself. Use{' '}
            <code>&apos;&amp;&amp;&apos;</code>, or <code>sx</code> for a single instance.
          </li>
          <li>
            <strong>A palette change does not recolor Sorbet components.</strong> They read{' '}
            <code>@sorbet-ui/tokens</code>, not <code>theme.palette</code>. See{' '}
            <A href="/docs/theming#brand-colors">brand colors</A>.
          </li>
          <li>
            <strong>Hover, focus and disabled.</strong> Overriding <code>backgroundColor</code> at rest leaves the
            component&apos;s hover color in place. Override <code>&apos;&amp;:hover&apos;</code> and{' '}
            <code>&apos;&amp;:focus-visible&apos;</code> too, and keep a visible focus ring.
          </li>
          <li>
            <strong>Dark mode.</strong> A literal color in <code>sx</code> is the same in both modes. Use a palette path (
            <code>&apos;text.primary&apos;</code>) or a token picked with <code>colorScaleForMode</code>.
          </li>
          <li>
            <strong>Contrast.</strong> Any new text and background pair is outside the tests until you add one (
            <A href="/docs/customization/colors#add-pair">how</A>).
          </li>
          <li>
            <strong><code>!important</code>.</strong> It works, then nothing can override it, including your own{' '}
            <code>sx</code> later. Raise specificity instead.
          </li>
        </ul>
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/customization/variants', title: 'Variants, colors and sizes', note: 'Props before styles.' },
            { href: '/docs/theming', title: 'Theming', note: 'Theme-wide changes.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
