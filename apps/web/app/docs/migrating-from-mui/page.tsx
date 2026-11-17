import type { Metadata } from 'next';
import { AlertTitle, Link } from '@mui/material';
import { Alert } from '@sorbet-ui/react';
import { pageMeta } from '@/lib/seo';
import { docPage } from '@/lib/docs-nav';
import GuidePage, { H3, Section } from '@/components/docs/GuidePage';
import CodeBlock from '@/components/CodeBlock';
import BeforeAfter from '../_start/BeforeAfter';
import DocTable from '../_start/DocTable';

const HREF = '/docs/migrating-from-mui';
const meta = docPage(HREF)!;

export const metadata: Metadata = pageMeta({ title: meta.title, description: meta.description, path: HREF });

const TOC = [
  { id: 'the-plan', label: 'The plan', depth: 2 },
  { id: 'swap-theme', label: 'Step 1: Swap the theme', depth: 2 },
  { id: 'what-restyles', label: 'What restyles automatically', depth: 3 },
  { id: 'palette', label: 'Palette and type', depth: 3 },
  { id: 'keep-overrides', label: 'Keep your overrides', depth: 2 },
  { id: 'adopt-components', label: 'Step 2: Adopt components', depth: 2 },
  { id: 'prop-names', label: 'Prop names', depth: 3 },
  { id: 'component-map', label: 'Component by component', depth: 3 },
  { id: 'mixing', label: 'Mixing MUI and Sorbet', depth: 2 },
  { id: 'checklist', label: 'Rollout checklist', depth: 2 },
  { id: 'known-differences', label: 'Known differences', depth: 2 },
] as const;

const BEFORE = `import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

const theme = createTheme({
  typography: { button: { fontWeight: 700 } },
  components: { MuiButton: { defaultProps: { size: 'small' } } },
});

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const AFTER = `import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';

// Same overrides, layered on top of the Sorbet theme.
const theme = createTheme(lightTheme, {
  typography: { button: { fontWeight: 700 } },
  components: { MuiButton: { defaultProps: { size: 'small' } } },
});

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const BOTH_MODES = `import { createTheme } from '@mui/material';
import { lightTheme, darkTheme } from '@sorbet-ui/theme';

const overrides = {
  typography: { button: { fontWeight: 700 } },
  components: { MuiButton: { defaultProps: { size: 'small' as const } } },
};

export const light = createTheme(lightTheme, overrides);
export const dark = createTheme(darkTheme, overrides);`;

const SHAPES_ONLY = `import { createTheme } from '@mui/material';
import { sorbetComponents } from '@sorbet-ui/theme';

// Your palette and type, Sorbet's component shapes.
const theme = createTheme({
  typography: { fontFamily: 'Georgia, serif' },
  components: sorbetComponents,
});`;

const COMPONENT_BEFORE = `import { Alert, Button } from '@mui/material';

<Alert severity="error" variant="filled">Payment failed</Alert>
<Button variant="contained" color="error" size="small">Retry</Button>
<Button variant="text">Cancel</Button>`;

const COMPONENT_AFTER = `import { Alert, Button } from '@sorbet-ui/react';

<Alert color="danger" variant="solid">Payment failed</Alert>
<Button variant="solid" color="danger" size="sm">Retry</Button>
<Button variant="plain" color="neutral">Cancel</Button>`;

const MIXED = `import { Card, CardContent, Typography } from '@mui/material';
import { Button, Chip } from '@sorbet-ui/react';

export function PlanCard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Team plan</Typography>
        <Chip variant="soft" color="success" label="Active" />
        <Button variant="soft" color="primary">Manage seats</Button>
      </CardContent>
    </Card>
  );
}`;

const c = (s: string) => <code>{s}</code>;

const RESTYLED: React.ReactNode[][] = [
  ['Button', <>No shadow, sentence-case labels, weight 600, rounded corners, a 3px focus ring. Outlined buttons get a 1.5px border.</>],
  ['IconButton', 'Rounded corners instead of a circle, and the same focus ring.'],
  ['TextField, Select, Autocomplete', <>Outlined inputs get a paper background, a soft border that darkens on hover, and a focus ring. Labels use weight 500.</>],
  ['Paper', <>Elevation {c('0')} by default, larger corners, no dark-mode gradient overlay. Elevation 1 is a soft shadow.</>],
  ['Card', <>Outlined by default, larger corners. {c('CardContent')} gets 24px padding.</>],
  ['AppBar', 'Flat, translucent paper color with a blur, text in the page color, and a hairline bottom border.'],
  ['Dialog, Menu', 'Larger corners and a hairline border. Menus get a soft shadow.'],
  ['Chip', 'Pill shape, weight 600. Colors stay as the palette sets them.'],
  ['Tabs, Tab', 'Sentence-case labels, weight 600, 44px tall, and a rounded indicator.'],
  ['TableCell', 'Divider-colored borders. Header cells are weight 600 with secondary text on a faint wash.'],
  ['Tooltip, Alert', 'Tooltips: rounder corners, 13px text, weight 500. Alerts: 12px corners, icon centered.'],
  ['LinearProgress, Switch, Avatar', 'Pill-shaped progress bar and switch track, a focus ring on Switch, weight 600 Avatar initials.'],
];

const PALETTE: React.ReactNode[][] = [
  [c('primary'), <>Sorbet {c('primary')} (sky blue)</>],
  [c('secondary'), <>Sorbet {c('neutral')} (slate), not violet</>],
  [c('error'), <>Sorbet {c('danger')}</>],
  [<>{c('success')}, {c('warning')}, {c('info')}</>, 'The Sorbet color of the same name'],
  ['Typography', <>The system font stack instead of Roboto. Button text is not uppercase.</>],
  [c('shape.borderRadius'), <>{c('12')}, so {c("theme.shape.borderRadius")} gives rounder corners everywhere you use it.</>],
];

const PROPS: React.ReactNode[][] = [
  [c('variant'), <>{c('contained')} becomes {c('solid')}, {c('outlined')} stays {c('outlined')}, {c('text')} becomes {c('plain')}. New: {c('soft')}, {c('ghost')} (Button also {c('dash')}, {c('link')}).</>],
  [c('color'), <>{c('error')} becomes {c('danger')}. Sorbet adds {c('neutral')}. Sorbet&apos;s {c('secondary')} is violet; use {c('neutral')} to match MUI&apos;s {c('secondary')} under the Sorbet theme.</>],
  [c('size'), <>{c('small')}, {c('medium')}, {c('large')} become {c('sm')}, {c('md')}, {c('lg')}. New: {c('xs')} and {c('xl')}.</>],
  [<>Alert {c('severity')}</>, <>Removed. Use {c('color')}: {c('severity="error"')} becomes {c('color="danger"')}.</>],
];

const doc = (slug: string, name: string) => <Link href={`/docs/components/${slug}`}>{name}</Link>;

const COMPONENTS: React.ReactNode[][] = [
  [doc('button', 'Button'), c('Button'), <>Defaults to {c('solid')} (MUI defaults to {c('text')}). Adds {c('loading')}, {c('loadingPosition')} and {c('shape')}.</>],
  [doc('alert', 'Alert'), c('Alert'), <>{c('color')} replaces {c('severity')}. Defaults to {c('soft')} and {c('info')}. {c('AlertTitle')} still comes from {c('@mui/material')}.</>],
  [doc('chip', 'Chip'), c('Chip'), <>Defaults to {c('outlined')} (MUI defaults to filled).</>],
  [doc('text-field', 'TextField'), c('TextField'), <>Sorbet variants; defaults to {c('outlined')}. Adds {c('startIcon')}, {c('endIcon')}, {c('loading')}.</>],
  [doc('select', 'Select'), <>{c('Select')}, {c('MenuItem')}</>, <>Sorbet variants; adds {c('helperText')}. Import {c('MenuItem')} from either package.</>],
  [<>{doc('checkbox', 'Checkbox')}, {doc('radio', 'Radio')}, {doc('switch', 'Switch')}</>, c('FormControlLabel + control'), <>A {c('label')} prop replaces the {c('FormControlLabel')} wrapper.</>],
  [doc('tabs', 'Tabs'), <>{c('Tabs')} + {c('Tab')} children</>, <>Pass {c('tabs={[{ id, label, content }]}')}. {c('onChange')} receives the tab id, and panels render for you.</>],
  [doc('table', 'Table'), <>{c('Table')}, {c('TableHead')}, {c('TableRow')}…</>, <>Pass {c('data')} and {c('columns')}. Sorting, row selection, pagination and a sticky header are props.</>],
  [doc('progress', 'Progress'), <>{c('LinearProgress')}, {c('CircularProgress')}</>, <>One component: {c('type="linear"')} (default) or {c('type="circular"')}.</>],
  [doc('skeleton', 'Skeleton'), c('Skeleton'), <>MUI&apos;s shapes move to {c('shape')}; they still work in {c('variant')}.</>],
  [doc('breadcrumbs', 'Breadcrumbs'), c('Breadcrumbs'), <>Pass {c('items={[{ id, label, href }]}')} instead of link children.</>],
  [doc('stepper', 'Stepper'), <>{c('Stepper')}, {c('Step')}, {c('StepLabel')}</>, <>Pass {c('steps')} as data, or keep MUI {c('Step')} children. Adds {c('onStepClick')}.</>],
  [<>{doc('card', 'Card')}, {doc('dialog', 'Dialog')}, {doc('drawer', 'Drawer')}, {doc('menu', 'Menu')}, {doc('popover', 'Popover')}</>, 'Same names', <>Same structure. Add {c('variant')}, {c('color')}, {c('size')}. Dialog also exports {c('DialogTitle')}, {c('DialogContent')}, {c('DialogActions')}.</>],
  [<>{doc('tooltip', 'Tooltip')}, {doc('snackbar', 'Snackbar')}, {doc('badge', 'Badge')}, {doc('avatar', 'Avatar')}, {doc('pagination', 'Pagination')}</>, 'Same names', <>Same structure with the shared props. Avatar adds a {c('status')} dot.</>],
  [<>{doc('accordion', 'Accordion')}, {doc('rating', 'Rating')}, {doc('slider', 'Slider')}, {doc('toggle-button-group', 'ToggleButtonGroup')}</>, 'Same names', <>Same structure with the shared props.</>],
  [<>{doc('autocomplete', 'Autocomplete')}, {doc('date-picker', 'DatePicker')}</>, 'MUI, MUI X', <>Same structure with the shared props. DatePicker uses MUI X with dayjs and re-exports {c('dayjs')}.</>],
];

export default function MigratingFromMui() {
  return (
    <GuidePage href={HREF} toc={[...TOC]} doodle="cone" aside="no rewrite">
      <Section id="the-plan" title="The plan">
        <p>
          You do not need to rewrite anything to start. Migration has two steps, and you can stop
          after the first:
        </p>
        <ol>
          <li>
            <strong>Swap the theme.</strong> One change at the root. Every stock MUI component in
            your app picks up the Sorbet look.
          </li>
          <li>
            <strong>Adopt Sorbet components</strong> where you want the shared{' '}
            <code>variant</code>, <code>color</code> and <code>size</code> API, one screen at a time.
          </li>
        </ol>
        <p>
          First, install the packages as shown in{' '}
          <Link href="/docs/installation">Installation</Link>. Step 1 needs only{' '}
          <code>@sorbet-ui/theme</code> and its dependency <code>@sorbet-ui/tokens</code>, and works
          with React 18 or 19.
        </p>
      </Section>

      <Section id="swap-theme" title="Step 1: Swap the theme">
        <p>Here is a typical MUI root with a few overrides:</p>
        <CodeBlock code={BEFORE} title="Before: Root.tsx" label="Before: a stock MUI theme" />
        <p>
          Pass <code>lightTheme</code> as the first argument to <code>createTheme</code>. Your
          overrides are merged on top, so they still win:
        </p>
        <CodeBlock code={AFTER} title="After: Root.tsx" label="After: the Sorbet theme with your overrides" />
        <p>
          No component code changes. If you have no overrides, pass <code>lightTheme</code> to{' '}
          <code>ThemeProvider</code> directly.
        </p>

        <H3 id="what-restyles">What restyles automatically</H3>
        <p>
          The theme ships style overrides for these stock <code>@mui/material</code> components.
          They read colors from the palette, so they follow light and dark mode.
        </p>
        <BeforeAfter />
        <DocTable label="Stock MUI components the Sorbet theme restyles" head={['Component', 'What changes']} rows={RESTYLED} minWidth={560} testId="restyled-table" />
        <p>
          Components not listed keep MUI&apos;s styles, with the Sorbet palette, type and corner
          radius.
        </p>

        <H3 id="palette">Palette and type</H3>
        <p>
          The palette comes from the same token scales as the Sorbet components, and those scales
          are tested for WCAG AA contrast in both modes. <code>darkTheme</code> uses lighter shades
          so text and outlines stay readable on dark surfaces.
        </p>
        <DocTable label="How MUI theme values map to Sorbet" head={['MUI theme value', 'In the Sorbet theme']} rows={PALETTE} minWidth={480} />
      </Section>

      <Section id="keep-overrides" title="Keep your overrides">
        <p>
          <code>createTheme(lightTheme, yours)</code> deep-merges your options into the Sorbet theme.
          A <code>defaultProps</code> you add to <code>MuiButton</code> keeps Sorbet&apos;s style
          overrides for it, and the other way round. Build the dark theme the same way:
        </p>
        <CodeBlock code={BOTH_MODES} title="theme.ts" label="Your overrides on both Sorbet themes" />
        <p>
          To keep your own palette and typography and take only Sorbet&apos;s component shapes, use
          the <code>sorbetComponents</code> export:
        </p>
        <CodeBlock code={SHAPES_ONLY} title="theme.ts" label="Only the Sorbet component overrides" />
        <Alert variant="soft" color="warning" sx={{ my: 2 }}>
          <AlertTitle>Your palette, your contrast</AlertTitle>
          The contrast tests cover the Sorbet palette. If you bring your own colors, check them
          yourself. Also note that Sorbet components take their colors from the tokens, not from{' '}
          <code>palette</code>, so changing <code>palette.primary</code> changes stock MUI
          components but not Sorbet ones.
        </Alert>
      </Section>

      <Section id="adopt-components" title="Step 2: Adopt components">
        <p>
          Sorbet components wrap the MUI ones and accept their props, except the few they redefine.
          Change the import, then rename the props:
        </p>
        <CodeBlock code={COMPONENT_BEFORE} title="Before" label="Before: MUI Alert and Button" />
        <CodeBlock code={COMPONENT_AFTER} title="After" label="After: Sorbet Alert and Button" />

        <H3 id="prop-names">Prop names</H3>
        <DocTable label="MUI prop values and their Sorbet equivalents" head={['Prop', 'From MUI to Sorbet']} rows={PROPS} minWidth={560} testId="prop-table" />

        <H3 id="component-map">Component by component</H3>
        <p>
          Every component below is exported from <code>@sorbet-ui/react</code>. Each one takes{' '}
          <code>sx</code> and the props of the MUI component it wraps.
        </p>
        <DocTable label="MUI components and their Sorbet equivalents" head={['Sorbet', 'Replaces', 'What changes']} rows={COMPONENTS} minWidth={720} testId="component-map" />
      </Section>

      <Section id="mixing" title="Mixing MUI and Sorbet">
        <p>
          Both read the same <code>ThemeProvider</code>, so you can mix them in one tree for as long
          as you like. A common middle state: MUI layout and surfaces, Sorbet controls.
        </p>
        <CodeBlock code={MIXED} title="PlanCard.tsx" label="Stock MUI Card with Sorbet Chip and Button" />
      </Section>

      <Section id="checklist" title="Rollout checklist">
        <ol>
          <li>Build and install the packages (<Link href="/docs/installation">Installation</Link>).</li>
          <li>
            Swap the root theme, merging your overrides with{' '}
            <code>createTheme(lightTheme, yours)</code>.
          </li>
          <li>
            Walk your main screens in light and dark. Look for the{' '}
            <Link href="#known-differences">known differences</Link> below.
          </li>
          <li>Update visual snapshots and run your accessibility checks.</li>
          <li>Ship the theme on its own. It is the biggest visible change with the smallest diff.</li>
          <li>
            Pick one screen and move its controls to Sorbet components, using the tables above.
            Repeat screen by screen.
          </li>
        </ol>
      </Section>

      <Section id="known-differences" title="Known differences">
        <ul>
          <li>
            <strong>Fewer shadows.</strong> <code>Paper</code> and <code>AppBar</code> default to
            elevation <code>0</code>, <code>Card</code> defaults to <code>outlined</code>, and
            buttons have no shadow. Set <code>elevation</code> where you still want depth.
          </li>
          <li>
            <strong>
              <code>secondary</code> is slate.
            </strong>{' '}
            Stock components with <code>color=&quot;secondary&quot;</code> turn neutral grey-blue.
            Sorbet components keep a violet <code>secondary</code>.
          </li>
          <li>
            <strong>Different defaults on Sorbet components.</strong> Sorbet Button defaults to{' '}
            <code>solid</code> and Chip to <code>outlined</code>. Set <code>variant</code>{' '}
            explicitly when you swap imports.
          </li>
          <li>
            <strong>Extra Button variants in TypeScript.</strong> <code>@sorbet-ui/theme</code> adds{' '}
            <code>solid</code>, <code>soft</code>, <code>ghost</code> and <code>plain</code> to the
            stock Button&apos;s <code>variant</code> type. The stock Button type-checks with them
            but has no styles for them: it renders as plain text. Use Sorbet&apos;s Button for those
            variants.
          </li>
          <li>
            <strong>System font.</strong> The theme uses the system font stack, not Roboto. Many
            Sorbet components ask for Inter; see{' '}
            <Link href="/docs/installation#fonts">Load the Inter font</Link>.
          </li>
        </ul>
        <Alert variant="soft" color="info" sx={{ mt: 3 }}>
          <AlertTitle>Something else looks off?</AlertTitle>
          Open an issue with a screenshot and the MUI component name. See{' '}
          <Link href="/docs/contributing" color="inherit" sx={{ fontWeight: 600 }}>
            Contributing
          </Link>
          .
        </Alert>
      </Section>
    </GuidePage>
  );
}
