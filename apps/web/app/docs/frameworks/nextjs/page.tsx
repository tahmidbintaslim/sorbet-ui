import type { Metadata } from 'next';
import { AlertTitle, Link } from '@mui/material';
import { Alert } from '@sorbet-ui/react';
import { pageMeta } from '@/lib/seo';
import { docPage } from '@/lib/docs-nav';
import GuidePage, { H3, Section } from '@/components/docs/GuidePage';
import CodeBlock, { CommandLine } from '@/components/CodeBlock';
import { Step, Steps } from '../../_start/Steps';

const HREF = '/docs/frameworks/nextjs';
const meta = docPage(HREF)!;

export const metadata: Metadata = pageMeta({ title: meta.title, description: meta.description, path: HREF });

const TOC = [
  { id: 'before-you-start', label: 'Before you start', depth: 2 },
  { id: 'setup', label: 'Set up the App Router', depth: 2 },
  { id: 'create', label: 'Create the app', depth: 3 },
  { id: 'install', label: 'Install', depth: 3 },
  { id: 'providers', label: 'Add a client provider', depth: 3 },
  { id: 'layout', label: 'Wire up the root layout', depth: 3 },
  { id: 'first-page', label: 'Build a first page', depth: 3 },
  { id: 'dark-mode', label: 'Dark mode', depth: 2 },
  { id: 'pages-router', label: 'Pages Router', depth: 2 },
  { id: 'troubleshooting', label: 'Troubleshooting', depth: 2 },
  { id: 'functions-error', label: 'Functions cannot be passed', depth: 3 },
  { id: 'hydration', label: 'Hydration mismatch', depth: 3 },
  { id: 'style-flash', label: 'Wrong or missing styles', depth: 3 },
  { id: 'emotion-server', label: 'Cannot find @emotion/server', depth: 3 },
] as const;

const CREATE = 'npx create-next-app@latest my-app --ts --app --no-tailwind --no-eslint --no-src-dir --import-alias "@/*" --use-npm --yes';

const INSTALL = `cd my-app
npm install ../sorbet-ui/tarballs/sorbet-ui-*.tgz \\
  @mui/material @mui/icons-material @mui/x-date-pickers \\
  @emotion/react @emotion/styled dayjs react react-dom \\
  @mui/material-nextjs`;

const PROVIDERS = `'use client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const LAYOUT = `import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Inter } from 'next/font/google';
import Providers from './providers';

// Many Sorbet components ask for Inter but do not load it; this loads it.
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = { title: 'My app' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}`;

const PAGE = `import { Alert, Button, Card, Chip } from '@sorbet-ui/react';

export default function Page() {
  return (
    <main style={{ padding: 32, display: 'grid', gap: 16, maxWidth: 480 }}>
      <Alert variant="soft" color="info">
        Welcome back. You have 3 new messages.
      </Alert>
      <Card variant="outlined">
        <h1>Weekly summary</h1>
        <Chip variant="soft" color="success" label="On track" />
      </Card>
      <Button variant="solid" color="primary">
        Hello Sorbet
      </Button>
    </main>
  );
}`;

const DARK_PROVIDERS = `'use client';
import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '@sorbet-ui/theme';

// useLayoutEffect warns on the server; it only matters in the browser.
const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export default function Providers({ children }: { children: React.ReactNode }) {
  // Server HTML and the first client render both use light, so hydration matches.
  // Then switch to the system setting before the browser paints.
  const [dark, setDark] = React.useState(false);
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const DARK_LAYOUT = `import { darkTheme } from '@sorbet-ui/theme';
// ...the other imports from the layout above

// Paints the dark page background before React loads, so dark-mode visitors
// do not see a white page first.
const { background, text } = darkTheme.palette;
const DARK_BODY = \`@media (prefers-color-scheme: dark){html body{background-color:\${background.default};color:\${text.primary}}}\`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: DARK_BODY }} />
      </head>
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}`;

const PAGES_INSTALL = 'npm install @mui/material-nextjs @emotion/server';

const PAGES_APP = `import type { AppProps } from 'next/app';
import { AppCacheProvider } from '@mui/material-nextjs/v16-pagesRouter';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <AppCacheProvider {...props}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppCacheProvider>
  );
}`;

const PAGES_DOCUMENT = `import { Html, Head, Main, NextScript, type DocumentProps, type DocumentContext } from 'next/document';
import {
  DocumentHeadTags,
  documentGetInitialProps,
  type DocumentHeadTagsProps,
} from '@mui/material-nextjs/v16-pagesRouter';

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => documentGetInitialProps(ctx);`;

export default function NextjsGuide() {
  return (
    <GuidePage href={HREF} toc={[...TOC]} doodle="cone" aside="app router">
      <Section id="before-you-start" title="Before you start">
        <p>
          You need Node.js 20.19 or newer and the Sorbet UI tarballs. Sorbet UI is not on npm yet, so
          follow <Link href="/docs/installation#build">Build the packages</Link> first. The commands
          below assume a <code>sorbet-ui</code> folder next to your app.
        </p>
        <p>
          This guide was run end to end on a new App Router app: <code>next build</code> prerenders
          the page, the server HTML is fully styled, and <code>next dev</code> logs no hydration
          warnings in light or dark mode.
        </p>
      </Section>

      <Section id="setup" title="Set up the App Router">
        <Steps>
          <Step id="create" title="Create the app">
            <CommandLine command={CREATE} label="Create a Next.js app" />
            <p>
              Delete <code>app/globals.css</code> and <code>app/page.module.css</code>.{' '}
              <code>CssBaseline</code> takes over the base styles, and the files below replace the
              ones that import them.
            </p>
          </Step>
          <Step id="install" title="Install">
            <p>
              The four Sorbet tarballs, their peers, and <code>@mui/material-nextjs</code>, which
              collects Emotion styles into the server HTML.
            </p>
            <CodeBlock code={INSTALL} title="Terminal" label="Install Sorbet UI in Next.js" />
          </Step>
          <Step id="providers" title="Add a client provider">
            <p>
              A theme holds functions, and functions cannot cross from a Server Component to a Client
              Component. Create the provider in a <code>&apos;use client&apos;</code> file:
            </p>
            <CodeBlock code={PROVIDERS} title="app/providers.tsx" label="Next.js: client providers" />
          </Step>
          <Step id="layout" title="Wire up the root layout">
            <p>
              The layout stays a Server Component. <code>AppRouterCacheProvider</code> goes outside
              your providers. On Next.js 15, import it from{' '}
              <code>@mui/material-nextjs/v15-appRouter</code>.
            </p>
            <CodeBlock code={LAYOUT} title="app/layout.tsx" label="Next.js: root layout" />
          </Step>
          <Step id="first-page" title="Build a first page">
            <p>
              <code>@sorbet-ui/react</code> starts with a <code>&quot;use client&quot;</code>{' '}
              directive, so a Server Component page can import and render it. Only your own
              components that use state or event handlers need <code>&apos;use client&apos;</code>.
            </p>
            <CodeBlock code={PAGE} title="app/page.tsx" label="Next.js: first page" />
            <p>
              Run <code>npm run dev</code> and open http://localhost:3000. You should see an info
              alert, an outlined card with a green chip, and a blue button.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="dark-mode" title="Dark mode">
        <p>
          To follow the operating system setting, replace <code>app/providers.tsx</code> with this
          version. The first render is always light, so the server HTML and the first client render
          match. A layout effect then switches to the system setting before the browser paints.
        </p>
        <CodeBlock code={DARK_PROVIDERS} title="app/providers.tsx" label="Next.js: providers that follow the system theme" />
        <p>
          The server cannot know the visitor&apos;s setting, so the server HTML is light. Add one
          style tag to the layout so the page background is dark from the first frame:
        </p>
        <CodeBlock code={DARK_LAYOUT} title="app/layout.tsx" label="Next.js: dark background before hydration" />
        <p>
          With this, the page background is right before any JavaScript runs. The components
          themselves switch to dark when React hydrates, so on a slow connection a dark-mode visitor
          can see light components for a moment. For a toggle that remembers the visitor&apos;s
          choice, see <Link href="/docs/customization/dark-mode">Dark mode</Link>.
        </p>
      </Section>

      <Section id="pages-router" title="Pages Router">
        <p>
          The Pages Router uses <code>AppCacheProvider</code> in <code>_app</code> and{' '}
          <code>DocumentHeadTags</code> in <code>_document</code>. It also needs{' '}
          <code>@emotion/server</code>, which the App Router does not:
        </p>
        <CommandLine command={PAGES_INSTALL} label="Install for the Pages Router" />
        <CodeBlock code={PAGES_APP} title="pages/_app.tsx" label="Pages Router: _app" />
        <CodeBlock code={PAGES_DOCUMENT} title="pages/_document.tsx" label="Pages Router: _document" />
        <p>
          Pages under <code>pages/</code> can then import Sorbet components directly. We checked
          that this builds and prerenders with styles in the server HTML, in the light theme.
        </p>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <H3 id="functions-error">Functions cannot be passed directly to Client Components</H3>
        <p>
          A theme was passed to <code>ThemeProvider</code> from a Server Component, usually{' '}
          <code>app/layout.tsx</code>. Move <code>ThemeProvider</code> into{' '}
          <code>app/providers.tsx</code> with <code>&apos;use client&apos;</code> at the top. The
          same goes for anything else you pass to a client component: plain data crosses the
          boundary, functions and components do not.
        </p>
        <H3 id="hydration">Hydration mismatch warnings</H3>
        <p>
          The server and the first client render produced different HTML. With themes, a common cause
          is reading the color mode during render: <code>localStorage</code>,{' '}
          <code>window.matchMedia</code>, or <code>useMediaQuery</code> with{' '}
          <code>noSsr</code>. Render light first and switch in an effect, as in the dark-mode
          providers above.
        </p>
        <H3 id="style-flash">Wrong, missing or out-of-order styles</H3>
        <p>
          Check that <code>AppRouterCacheProvider</code> wraps <code>&lt;Providers&gt;</code> in{' '}
          <code>app/layout.tsx</code>, and that its import path matches your Next.js major (
          <code>v16-appRouter</code>, <code>v15-appRouter</code>). Then check that only one copy
          of MUI and Emotion is installed: <code>npm ls @mui/material @emotion/react</code>.
        </p>
        <H3 id="emotion-server">Pages Router: Cannot find package &apos;@emotion/server&apos;</H3>
        <p>
          <code>next build</code> fails while prerendering with this error when{' '}
          <code>_document</code> uses <code>@mui/material-nextjs</code> without{' '}
          <code>@emotion/server</code>. Install it.
        </p>
        <Alert variant="soft" color="neutral" sx={{ mt: 3 }}>
          <AlertTitle>Still stuck?</AlertTitle>
          The general <Link href="/docs/installation#troubleshooting" color="inherit" sx={{ fontWeight: 600 }}>installation troubleshooting</Link>{' '}
          covers peer dependency and missing-module errors.
        </Alert>
      </Section>
    </GuidePage>
  );
}
