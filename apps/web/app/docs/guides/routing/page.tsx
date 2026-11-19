import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import ExampleViewer from '@/components/docs/ExampleViewer';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks } from '../../_shared/parts';
import A from '../../_shared/A';
import { RoutingDemo } from '../demos';

export const metadata: Metadata = pageMeta({
  title: 'Routing and links',
  description: 'Render buttons and links with your router: Next.js Link, React Router and plain anchors.',
  path: '/docs/guides/routing',
});

const toc: TocItem[] = [
  { id: 'links-or-buttons', label: 'Link or button?', depth: 2 },
  { id: 'plain-anchors', label: 'Plain anchors', depth: 2 },
  { id: 'nextjs', label: 'Next.js', depth: 2 },
  { id: 'per-component', label: 'One component', depth: 3 },
  { id: 'theme-wide', label: 'Every component, from the theme', depth: 3 },
  { id: 'react-router', label: 'React Router', depth: 2 },
  { id: 'breadcrumbs', label: 'Breadcrumbs with a router', depth: 2 },
  { id: 'active-state', label: 'Active navigation state', depth: 2 },
  { id: 'demo', label: 'Try it', depth: 2 },
  { id: 'routing-demo', label: 'Live example', depth: 3 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const ANCHOR = `import { Button } from '@sorbet-ui/react';

// With href, Button renders an <a>: a full page load, no router needed.
<Button href="/pricing" variant="soft">See pricing</Button>
<Button href="https://status.example.com" variant="plain">Status page</Button>`;

const NEXT_ONE = `'use client';
import NextLink from 'next/link';
import { Link } from '@mui/material';
import { Button } from '@sorbet-ui/react';

export function Hero() {
  return (
    <>
      <Button component={NextLink} href="/signup">Start free</Button>
      <Link component={NextLink} href="/docs">Read the docs</Link>
    </>
  );
}`;

const NEXT_THEME = `// app/providers.tsx
'use client';
import NextLink from 'next/link';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme, lightTheme } from '@sorbet-ui/theme';

const theme = createTheme(lightTheme, {
  components: {
    // Every Button or IconButton with an href renders a Next link.
    MuiButtonBase: { defaultProps: { LinkComponent: NextLink } },
    // Every MUI Link, including the links inside Sorbet Breadcrumbs.
    MuiLink: { defaultProps: { component: NextLink } },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const NEXT_THEN = `// Any file, even a Server Component: just pass href.
<Button href="/signup">Start free</Button>
<Link href="/docs">Read the docs</Link>`;

const RR = `// src/theme.tsx
import * as React from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router';
import { createTheme, lightTheme } from '@sorbet-ui/theme';

// MUI passes href; React Router's Link wants to.
const LinkBehavior = React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }>(
  function LinkBehavior({ href, ...props }, ref) {
    return <RouterLink ref={ref} to={href} {...props} />;
  },
);

export const theme = createTheme(lightTheme, {
  components: {
    MuiButtonBase: { defaultProps: { LinkComponent: LinkBehavior } },
    MuiLink: { defaultProps: { component: LinkBehavior } },
  },
});`;

const CRUMBS = `import { Breadcrumbs } from '@sorbet-ui/react';

// With the theme setup above, these links navigate with your router.
<Breadcrumbs
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'current', label: 'Moonbeam' }, // the last item is the current page
  ]}
/>`;

const CRUMBS_CLICK = `'use client';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@sorbet-ui/react';

export function ProjectCrumbs() {
  const router = useRouter();
  return (
    <Breadcrumbs
      items={[
        // onClick replaces the default navigation of the link.
        { id: 'projects', label: 'Projects', href: '/projects', onClick: () => router.push('/projects') },
        { id: 'current', label: 'Moonbeam' },
      ]}
    />
  );
}`;

const ACTIVE_NEXT = `'use client';
import { usePathname } from 'next/navigation';
import { Button } from '@sorbet-ui/react';

const NAV = [
  { href: '/projects', label: 'Projects' },
  { href: '/team', label: 'Team' },
  { href: '/settings', label: 'Settings' },
];

export function SideNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main">
      <ul>
        {NAV.map((n) => {
          const current = pathname === n.href || pathname.startsWith(\`\${n.href}/\`);
          return (
            <li key={n.href}>
              <Button
                href={n.href}
                variant={current ? 'soft' : 'plain'}
                color={current ? 'primary' : 'neutral'}
                aria-current={current ? 'page' : undefined}
              >
                {n.label}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}`;

const DEMO_SOURCE = `'use client';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@mui/material';
import { createTheme, type Theme } from '@mui/material/styles';
import { Breadcrumbs, Button } from '@sorbet-ui/react';

// Extends the page's theme: MUI links and href buttons render Next links.
const withRouterLinks = (outer: Theme) =>
  createTheme(outer, {
    components: {
      MuiLink: { defaultProps: { component: NextLink } },
      MuiButtonBase: { defaultProps: { LinkComponent: NextLink } },
    },
  });

const NAV = [
  { href: '/docs/guides/forms', label: 'Forms' },
  { href: '/docs/guides/routing', label: 'Routing' },
  { href: '/docs/guides/ai', label: 'AI and MCP' },
];

export default function RoutingDemo() {
  const pathname = usePathname();
  return (
    <ThemeProvider theme={withRouterLinks}>
      <Breadcrumbs
        items={[
          { id: 'docs', label: 'Docs', href: '/docs' },
          { id: 'guides', label: 'Guides', href: '/docs/guides/forms' },
          { id: 'routing', label: 'Routing and links' },
        ]}
      />
      <nav aria-label="Guides (example)">
        <ul>
          {NAV.map((n) => {
            const current = pathname === n.href || pathname === \`\${n.href}/\`;
            return (
              <li key={n.href}>
                <Button href={n.href} size="sm" variant={current ? 'soft' : 'plain'}
                  color={current ? 'primary' : 'neutral'} aria-current={current ? 'page' : undefined}>
                  {n.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
      <Button component={NextLink} href="/docs/guides/forms" variant="outlined">
        Read the forms guide
      </Button>
    </ThemeProvider>
  );
}`;

export default function Page() {
  return (
    <GuidePage href="/docs/guides/routing" toc={toc} doodle="cone" aside="this way">
      <p>
        Sorbet&apos;s <code>Button</code> is MUI&apos;s <code>Button</code>, and Sorbet&apos;s <code>Breadcrumbs</code>{' '}
        render MUI <code>Link</code>s. So the MUI ways of rendering a router link work unchanged: the{' '}
        <code>component</code> prop for one element, or <code>LinkComponent</code> in the theme for all of them.
      </p>

      <Section id="links-or-buttons" title="Link or button?">
        <DocTable
          label="Link or button"
          head={['It…', 'Use', 'Renders']}
          mono={[]}
          rows={[
            ['goes to another page or URL', <code key="c">{'<Button href="…">'}</code>, <code key="r">{'<a href>'}</code>],
            ['does something on this page', <code key="c">{'<Button onClick={…}>'}</code>, <code key="r">{'<button>'}</code>],
            ['is a link inside text', <code key="c">{'<Link href="…">'}</code>, <code key="r">{'<a href>'}</code>],
          ]}
        />
        <p>
          Getting this right gives people the browser features they expect from links: open in a new tab, copy the
          address, see the URL on hover. The <code>link</code> variant only changes how a Button looks; without{' '}
          <code>href</code> it is still a <code>&lt;button&gt;</code>.
        </p>
      </Section>

      <Section id="plain-anchors" title="Plain anchors">
        <CodeBlock code={ANCHOR} label="Button with href" />
        <p>
          The <code>ButtonProps</code> type covers <code>href</code> but not other anchor attributes such as{' '}
          <code>target</code>. For a link that opens a new tab, use MUI&apos;s <code>Link</code>, and say so in the
          text so the change of context is not a surprise.
        </p>
      </Section>

      <Section id="nextjs" title="Next.js">
        <p>
          Next.js <code>Link</code> prefetches the page and navigates without a full reload. Hand it to the Sorbet
          component in one of two ways.
        </p>
        <H3 id="per-component">One component</H3>
        <p>
          Pass it as <code>component</code>. A component is a function, so this has to happen in a{' '}
          <code>&apos;use client&apos;</code> file (<A href="/docs/guides/server-rendering#needs-client">why</A>).
        </p>
        <CodeBlock code={NEXT_ONE} title="Hero.tsx" label="Next.js Link per component" />
        <H3 id="theme-wide">Every component, from the theme</H3>
        <p>
          Set it once in the theme. MUI&apos;s <code>ButtonBase</code> renders its <code>LinkComponent</code> whenever
          it gets an <code>href</code>, and <code>Link</code> takes a default <code>component</code>. Both reach the
          Sorbet components.
        </p>
        <CodeBlock code={NEXT_THEME} title="app/providers.tsx" label="Next.js Link from the theme" />
        <CodeBlock code={NEXT_THEN} label="Then pass href" />
        <Callout title="External links">
          Next.js <code>Link</code> accepts external URLs (<code>https://…</code>) too and navigates to them normally,
          so the theme setup is safe for every <code>href</code>.
        </Callout>
      </Section>

      <Section id="react-router" title="React Router">
        <p>
          React Router&apos;s <code>Link</code> takes <code>to</code> instead of <code>href</code>, so map one to the
          other in a small adapter, then register it in the theme the same way:
        </p>
        <CodeBlock code={RR} title="src/theme.tsx" label="React Router Link from the theme" />
        <p>
          Use the theme route with React Router rather than <code>component=&#123;RouterLink&#125;</code> on one
          Button: <code>ButtonProps</code> has no <code>to</code> prop, while the adapter lets you keep passing{' '}
          <code>href</code>.
        </p>
      </Section>

      <Section id="breadcrumbs" title="Breadcrumbs with a router">
        <p>
          <code>Breadcrumbs</code> takes its trail as <code>items</code>. Items with an <code>href</code> render MUI{' '}
          <code>Link</code>s, so the theme setup above makes them router links. The last item is the current page: it
          renders as text with <code>aria-current=&quot;page&quot;</code>.
        </p>
        <CodeBlock code={CRUMBS} label="Breadcrumbs with links" />
        <p>
          Without the theme setup, give an item an <code>onClick</code>. Breadcrumbs then prevents the link&apos;s own
          navigation and calls your handler. Keep the <code>href</code> so the link still shows its address:
        </p>
        <CodeBlock code={CRUMBS_CLICK} title="ProjectCrumbs.tsx" label="Breadcrumbs with router.push" />
      </Section>

      <Section id="active-state" title="Active navigation state">
        <p>
          Read the current path from the router, style the active item, and mark it with{' '}
          <code>aria-current=&quot;page&quot;</code> so screen readers announce it too.
        </p>
        <CodeBlock code={ACTIVE_NEXT} title="SideNav.tsx" label="Active nav item with usePathname" />
        <p>
          With React Router, use <code>useLocation().pathname</code> the same way, or its <code>NavLink</code>, which
          sets <code>aria-current=&quot;page&quot;</code> on the active link for you.
        </p>
      </Section>

      <Section id="demo" title="Try it">
        <p>
          These links navigate inside this site without a full reload. The current guide in the small nav is marked
          active.
        </p>
        <ExampleViewer id="routing-demo" title="Live example" description="Breadcrumbs, an active nav and a Button rendering Next.js links." source={DEMO_SOURCE} file="RoutingDemo.tsx">
          <RoutingDemo />
        </ExampleViewer>
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/components/breadcrumbs', title: 'Breadcrumbs', note: 'Collapsing, separators and sizes.' },
            { href: '/docs/guides/server-rendering', title: 'Server rendering', note: 'Where client components start.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
