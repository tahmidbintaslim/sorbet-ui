import type { Metadata } from 'next';
import { AlertTitle, Link } from '@mui/material';
import { Alert } from '@sorbet-ui/react';
import { pageMeta } from '@/lib/seo';
import { docPage } from '@/lib/docs-nav';
import GuidePage, { H3, Section } from '@/components/docs/GuidePage';
import CodeBlock from '@/components/CodeBlock';
import BeforeAfter from './_start/BeforeAfter';
import LinkGrid from './_start/LinkGrid';

const HREF = '/docs';
const meta = docPage(HREF)!;

export const metadata: Metadata = pageMeta({ title: meta.title, description: meta.description, path: HREF });

const TOC = [
  { id: 'what-it-is', label: 'What Sorbet UI is', depth: 2 },
  { id: 'why', label: 'Why it exists', depth: 2 },
  { id: 'how-it-works', label: 'How it works', depth: 2 },
  { id: 'the-theme', label: 'The theme', depth: 3 },
  { id: 'the-components', label: 'The components', depth: 3 },
  { id: 'principles', label: 'Principles', depth: 2 },
  { id: 'in-the-box', label: 'What is in the box', depth: 2 },
  { id: 'is-it-for-you', label: 'Is it for you?', depth: 2 },
  { id: 'status', label: 'Project status', depth: 2 },
] as const;

const THEME = `import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const COMPONENTS = `import { Alert, Button, Chip } from '@sorbet-ui/react';

<Alert variant="soft" color="success">Changes saved</Alert>
<Chip variant="outlined" color="info" label="Beta" />
<Button variant="ghost" color="danger" size="sm">Delete</Button>`;

const BOX = [
  { href: '/docs/installation', title: 'Installation', note: 'Build the packages, install them, and render your first component.' },
  { href: '/docs/migrating-from-mui', title: 'Migrating from MUI', note: 'Restyle an existing app, then adopt components one screen at a time.' },
  { href: '/docs/theming', title: 'Theming', note: 'The light and dark themes, and how to extend them like any MUI theme.' },
  { href: '/docs/components', title: 'Components', note: '30 components with live examples and props tables.' },
  { href: '/blocks', title: 'Blocks', note: 'Ready-made page sections: heroes, pricing, dashboards and more. Copy the code.' },
  { href: '/templates', title: 'Templates', note: 'Full app screens to start from, shown on phone, tablet and desktop.' },
];

export default function Introduction() {
  return (
    <GuidePage href={HREF} toc={[...TOC]} doodle="cone" aside="start here!">
      <Section id="what-it-is" title="What Sorbet UI is">
        <p>
          Sorbet UI is a theme and a set of React components for apps built on{' '}
          <Link href="https://mui.com/material-ui/" rel="noopener">Material UI</Link> (MUI) v7 or v9. Wrap
          your app in the Sorbet theme and the MUI screens you already have get a softer, flatter
          look. Add Sorbet components where you want one prop API for style: <code>variant</code>,{' '}
          <code>color</code> and <code>size</code>.
        </p>
        <p>Both panels below run the same stock Material UI code. The only change is the theme.</p>
        <BeforeAfter />
      </Section>

      <Section id="why" title="Why it exists">
        <p>
          Material UI is a solid base: accessible widgets, a theme system, MUI X for data grids and
          date pickers, and years of fixes. Its default look, though, reads as Material Design: raised
          buttons, uppercase labels, heavy shadows. Teams that want a more current look usually face
          a choice between a full theme rewrite and moving to another library. Both cost months and
          put working screens at risk.
        </p>
        <p>
          Sorbet UI is a third option. You keep MUI, your code and your tests. One theme provider
          changes how existing screens look, and you adopt new components only where they help.
        </p>
      </Section>

      <Section id="how-it-works" title="How it works">
        <p>Sorbet UI has two layers. You can use the first without the second.</p>
        <H3 id="the-theme">The theme</H3>
        <p>
          <code>@sorbet-ui/theme</code> exports <code>lightTheme</code> and <code>darkTheme</code>.
          They are ordinary MUI themes, made with <code>createTheme</code>, with style overrides for
          stock components such as Button, TextField, Card, Chip, Tabs, Table, Dialog and AppBar.
        </p>
        <CodeBlock code={THEME} title="Root.tsx" label="Wrap your app in the Sorbet theme" />
        <H3 id="the-components">The components</H3>
        <p>
          <code>@sorbet-ui/react</code> has 30 components built on MUI. Each takes the same three
          props, plus the props of the MUI component it wraps, so <code>sx</code> and your theme keep
          working.
        </p>
        <CodeBlock code={COMPONENTS} title="Example.tsx" label="Sorbet components share variant, color and size" />
        <ul>
          <li>
            <code>variant</code>: <code>solid</code>, <code>soft</code>, <code>outlined</code>,{' '}
            <code>ghost</code>, <code>plain</code> (Button also has <code>dash</code> and{' '}
            <code>link</code>).
          </li>
          <li>
            <code>color</code>: <code>primary</code>, <code>secondary</code>, <code>success</code>,{' '}
            <code>warning</code>, <code>danger</code>, <code>info</code>, <code>neutral</code>.
          </li>
          <li>
            <code>size</code>: <code>xs</code>, <code>sm</code>, <code>md</code>, <code>lg</code>,{' '}
            <code>xl</code>.
          </li>
        </ul>
      </Section>

      <Section id="principles" title="Principles">
        <ul>
          <li>
            <strong>Built on MUI, not beside it.</strong> Sorbet wraps MUI components and themes.
            It does not fork them, so MUI fixes and MUI X keep working.
          </li>
          <li>
            <strong>Accessible by default.</strong> Every color pair the variants use is checked for
            WCAG AA contrast by tests in <code>@sorbet-ui/tokens</code>, in both themes. Every
            Storybook story and every page of this site is checked with axe in CI. The library has
            not been tested with screen readers yet.
          </li>
          <li>
            <strong>Light and dark.</strong> Both themes come from the same tokens. Switching is one
            prop on <code>ThemeProvider</code>.
          </li>
          <li>
            <strong>Calm motion.</strong> Accordion, Skeleton and Stepper stop animating when the
            operating system asks for reduced motion. Alert, Avatar, Badge, Card, Chip, Dialog,
            Drawer, Popover, Snackbar and Tooltip take a <code>disableAnimation</code> prop.
          </li>
        </ul>
      </Section>

      <Section id="in-the-box" title="What is in the box">
        <LinkGrid items={BOX} testId="intro-links" />
        <p>
          Four packages: <code>@sorbet-ui/theme</code> (the themes), <code>@sorbet-ui/react</code>{' '}
          (the components), <code>@sorbet-ui/tokens</code> (colors, spacing, type and motion as
          plain TypeScript objects) and <code>@sorbet-ui/core</code> (shared types and helpers the
          components use).
        </p>
      </Section>

      <Section id="is-it-for-you" title="Is it for you?">
        <p>Sorbet UI is a good fit when:</p>
        <ul>
          <li>Your app already uses Material UI v7 or v9, and you want it to look current without a rewrite.</li>
          <li>You want soft, ghost and plain styles with one prop API across components.</li>
          <li>You use, or plan to use, MUI X date pickers alongside your own screens.</li>
        </ul>
        <p>Pick something else when:</p>
        <ul>
          <li>You do not use MUI. A library built for your stack will serve you better.</li>
          <li>You need a stable, published release today. See the status below.</li>
          <li>You need a Material Design look. Stock MUI already does that well.</li>
        </ul>
      </Section>

      <Section id="status" title="Project status">
        <Alert variant="soft" color="warning" data-testid="intro-status">
          <AlertTitle>Pre-release</AlertTitle>
          Version 0.1.0 is not on npm yet. To try Sorbet UI today, build the packages from source and
          install the tarballs, as shown in <Link href="/docs/installation" color="inherit" sx={{ fontWeight: 600 }}>Installation</Link>. APIs can
          still change before the first release.
        </Alert>
      </Section>
    </GuidePage>
  );
}
