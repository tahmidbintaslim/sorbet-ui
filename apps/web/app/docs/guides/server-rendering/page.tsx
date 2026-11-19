import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks, Steps } from '../../_shared/parts';
import A from '../../_shared/A';

export const metadata: Metadata = pageMeta({
  title: 'Server rendering',
  description: 'Server components, client boundaries and streaming with Sorbet UI.',
  path: '/docs/guides/server-rendering',
});

const toc: TocItem[] = [
  { id: 'how-it-fits', label: 'How the packages fit', depth: 2 },
  { id: 'setup', label: 'Set up the App Router', depth: 2 },
  { id: 'boundary', label: "The 'use client' boundary", depth: 2 },
  { id: 'server-ok', label: 'Fine in a Server Component', depth: 3 },
  { id: 'needs-client', label: 'Needs a Client Component', depth: 3 },
  { id: 'static-export', label: 'Static export', depth: 2 },
  { id: 'hydration', label: 'Avoid hydration mismatches', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const LAYOUT = `// app/layout.tsx (a Server Component)
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Collects the Emotion styles of the server render into the HTML. */}
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}`;

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

const SERVER_PAGE = `// app/billing/page.tsx (a Server Component: no 'use client')
import { Alert, Button, Chip } from '@sorbet-ui/react';
import { getInvoice } from '@/lib/billing';
import PayButton from './PayButton';

export default async function Billing() {
  const invoice = await getInvoice(); // runs on the server
  return (
    <>
      <Chip color={invoice.paid ? 'success' : 'warning'} label={invoice.paid ? 'Paid' : 'Due'} />
      <Alert color="info">Invoices are sent on the 1st of each month.</Alert>
      <Button href="/billing/history" variant="outlined">History</Button>
      <PayButton invoiceId={invoice.id} />
    </>
  );
}`;

const CLIENT_ISLAND = `// app/billing/PayButton.tsx
'use client';
import * as React from 'react';
import { Button } from '@sorbet-ui/react';

export default function PayButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      loading={loading}
      onClick={async () => {
        setLoading(true);
        await fetch(\`/api/pay/\${invoiceId}\`, { method: 'POST' });
        setLoading(false);
      }}
    >
      Pay now
    </Button>
  );
}`;

const NEXT_CONFIG = `// next.config.ts (this site's)
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // Fully static site: every route is prerendered at build time.
  output: 'export',
  images: { unoptimized: true },
};

export default config;`;

const STATIC_PARAMS = `// app/docs/components/[slug]/page.tsx (excerpt)
export const dynamicParams = false;
export const generateStaticParams = () => CATALOG.map((d) => ({ slug: d.slug }));`;

const HYDRATION = `'use client';
import * as React from 'react';

export function LastVisit() {
  // Wrong: localStorage does not exist on the server, and the value differs per visitor.
  // const last = localStorage.getItem('last-visit');

  // Right: render the same thing on both sides, then read browser state in an effect.
  const [last, setLast] = React.useState<string | null>(null);
  React.useEffect(() => {
    try {
      setLast(localStorage.getItem('last-visit'));
    } catch {
      /* storage blocked */
    }
  }, []);
  return last ? <span>Welcome back. Last visit: {last}</span> : null;
}`;

export default function Page() {
  return (
    <GuidePage href="/docs/guides/server-rendering" toc={toc} doodle="cone" aside="on the server">
      <p>
        Sorbet works in React Server Components frameworks such as the Next.js App Router. The components render on
        the server and arrive styled; you only decide where interactivity starts.
      </p>

      <Section id="how-it-fits" title="How the packages fit">
        <DocTable
          label="Packages and the server"
          head={['Package', 'On the server', 'Why']}
          mono={[0]}
          rows={[
            [
              '@sorbet-ui/react',
              'Import it in Server Components',
              "The bundle starts with 'use client', so every component is a client component you can render from the server.",
            ],
            [
              '@sorbet-ui/theme',
              'Use it in a client provider',
              'A theme holds functions (style overrides), which cannot be passed from a Server Component to a Client Component.',
            ],
            ['@sorbet-ui/tokens', 'Use it anywhere', 'Plain values: strings and numbers. This site reads them in its server layout.'],
            ['@sorbet-ui/core', 'Use it anywhere', 'Types, presets and helpers with no React state.'],
          ]}
        />
        <p>
          Styles come from Emotion, which writes CSS while the components render. On the server that CSS has to be
          collected and put in the HTML, which is the job of MUI&apos;s cache provider.
        </p>
      </Section>

      <Section id="setup" title="Set up the App Router">
        <Steps>
          <li>
            <strong>Install</strong> <code>@mui/material-nextjs</code> next to <code>@mui/material</code> (same major).
          </li>
          <li>
            <strong>Wrap the body</strong> in <code>AppRouterCacheProvider</code> in your root layout. Import it from the
            entry for your Next.js major: <code>v16-appRouter</code> for Next.js 16 (entries back to{' '}
            <code>v13-appRouter</code> exist).
          </li>
          <li>
            <strong>Put the theme in a client provider</strong> inside it.
          </li>
        </Steps>
        <CodeBlock code={LAYOUT} title="app/layout.tsx" label="Root layout with the cache provider" />
        <CodeBlock code={PROVIDERS} title="app/providers.tsx" label="Client theme provider" />
        <p>
          Without the cache provider the page still works, but the server HTML has no component styles, so it shows
          unstyled until the JavaScript runs. This site uses the same setup in <code>app/layout.tsx</code>, with{' '}
          <code>options=&#123;&#123; enableCssLayer: false &#125;&#125;</code>.
        </p>
      </Section>

      <Section id="boundary" title="The 'use client' boundary">
        <p>
          A Server Component can render a client component and pass it props that can be serialized: strings, numbers,
          booleans, plain objects and arrays, and other rendered elements as <code>children</code>. It cannot pass
          functions, which rules out event handlers, render props, and components as props.
        </p>
        <H3 id="server-ok">Fine in a Server Component</H3>
        <CodeBlock code={SERVER_PAGE} title="app/billing/page.tsx" label="Sorbet components in a Server Component" />
        <p>
          Data loads on the server, the markup and styles arrive in the HTML, and only <code>PayButton</code> ships its
          own logic.
        </p>
        <H3 id="needs-client">Needs a Client Component</H3>
        <p>
          Anything with an event handler (<code>onClick</code>, <code>onChange</code>), state, effects, or a prop that
          is a function or component (<code>component=&#123;NextLink&#125;</code>, a <code>sx</code> callback) goes in a
          file that starts with <code>&apos;use client&apos;</code>. Keep these islands small and pass them data from the
          server.
        </p>
        <CodeBlock code={CLIENT_ISLAND} title="app/billing/PayButton.tsx" label="A client island" />
        <Callout title="The usual error">
          &ldquo;Functions cannot be passed directly to Client Components&rdquo; means a function crossed the boundary.
          Move that piece, with its handler, into a <code>&apos;use client&apos;</code> file.
        </Callout>
      </Section>

      <Section id="static-export" title="Static export">
        <p>
          This site is a fully static export: every page, including these docs, is rendered to HTML at build time and
          served as files.
        </p>
        <CodeBlock code={NEXT_CONFIG} title="next.config.ts" label="Static export config" />
        <ul>
          <li>
            Dynamic routes list their pages with <code>generateStaticParams</code>; <code>dynamicParams = false</code>{' '}
            turns unknown slugs into the 404 page.
          </li>
          <li>
            Server code runs once, at build. The tables on these docs pages read <code>packages/react/src</code> and the
            token objects during the build, so they ship as plain HTML.
          </li>
          <li>
            The cache provider works the same: each page&apos;s HTML includes the styles it needs.
          </li>
          <li>
            Per-visitor state (color mode, saved choices) does not exist at build time. Read it in the browser, as in{' '}
            <A href="/docs/customization/dark-mode#no-flash">dark mode without a flash</A>.
          </li>
        </ul>
        <CodeBlock code={STATIC_PARAMS} title="app/docs/components/[slug]/page.tsx" label="Static params" />
      </Section>

      <Section id="hydration" title="Avoid hydration mismatches">
        <p>
          React hydrates by rendering the client tree once more and expecting the same result as the server HTML. Any
          value that differs between the two causes a mismatch.
        </p>
        <ul>
          <li>
            <strong>Browser-only values in render:</strong> <code>window</code>, <code>localStorage</code>,{' '}
            <code>matchMedia</code>. Read them in <code>useEffect</code>, or in <code>useLayoutEffect</code> when it must
            happen before paint.
          </li>
          <li>
            <strong>Time and randomness:</strong> <code>Date.now()</code>, <code>Math.random()</code>. Pass them from
            the server or compute them after mount. Use <code>React.useId()</code> for ids.
          </li>
          <li>
            <strong>
              <code>useMediaQuery</code> with <code>noSsr: true</code>
            </strong>{' '}
            reads the query during hydration, so it can disagree with the server HTML. Keep the default with server
            rendering; use <code>noSsr</code> in client-only apps.
          </li>
          <li>
            <strong>Theme by color mode:</strong> start from the same theme on both sides, then switch. The{' '}
            <A href="/docs/customization/dark-mode#how-this-site-does-it">dark mode guide</A> shows the inline-script
            pattern this site uses.
          </li>
        </ul>
        <CodeBlock code={HYDRATION} title="LastVisit.tsx" label="Read browser state after hydration" />
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/frameworks/nextjs', title: 'Next.js', note: 'The full setup for a new app.' },
            { href: '/docs/guides/routing', title: 'Routing and links', note: 'Next.js Link in Sorbet components.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
