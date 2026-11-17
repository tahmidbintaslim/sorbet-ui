import type { Metadata } from 'next';
import { AlertTitle, Link } from '@mui/material';
import { Alert } from '@sorbet-ui/react';
import { pageMeta } from '@/lib/seo';
import { docPage } from '@/lib/docs-nav';
import GuidePage, { H3, Section } from '@/components/docs/GuidePage';
import CodeBlock from '@/components/CodeBlock';
import { Step, Steps } from '../../_start/Steps';

const HREF = '/docs/frameworks/react-router';
const meta = docPage(HREF)!;

export const metadata: Metadata = pageMeta({ title: meta.title, description: meta.description, path: HREF });

const TOC = [
  { id: 'before-you-start', label: 'Before you start', depth: 2 },
  { id: 'setup', label: 'Set up framework mode', depth: 2 },
  { id: 'create', label: 'Create the app', depth: 3 },
  { id: 'install', label: 'Install', depth: 3 },
  { id: 'providers', label: 'Add a provider', depth: 3 },
  { id: 'root', label: 'Wire up app/root.tsx', depth: 3 },
  { id: 'first-page', label: 'Build a first route', depth: 3 },
  { id: 'dark-mode', label: 'Dark mode', depth: 2 },
  { id: 'what-we-tested', label: 'What we tested', depth: 2 },
  { id: 'troubleshooting', label: 'Troubleshooting', depth: 2 },
  { id: 'dev-reload', label: 'The dev server reloads once', depth: 3 },
  { id: 'hydration', label: 'Hydration mismatch', depth: 3 },
] as const;

const CREATE = `npx create-react-router@latest my-app
cd my-app`;

const INSTALL = `npm install ../sorbet-ui/tarballs/sorbet-ui-*.tgz \\
  @mui/material @mui/icons-material @mui/x-date-pickers \\
  @emotion/react @emotion/styled dayjs react react-dom`;

const PROVIDERS = `import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const ROOT = `import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import Providers from './providers';
// Remove: import './app.css';

// ...links() stays as generated

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>{children}</Providers>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ...App and ErrorBoundary stay as generated`;

const HOME = `import type { Route } from './+types/home';
import { Alert, Button } from '@sorbet-ui/react';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'My app' }];
}

export default function Home() {
  return (
    <main style={{ padding: 32, display: 'grid', gap: 16, maxWidth: 480 }}>
      <Alert variant="soft" color="info">Welcome back.</Alert>
      <Button variant="solid" color="primary">Hello Sorbet</Button>
    </main>
  );
}`;

const DARK_PROVIDERS = `import * as React from 'react';
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

const DARK_ROOT = `import { darkTheme } from '@sorbet-ui/theme';

// Paints the dark page background before React loads.
const { background, text } = darkTheme.palette;
const DARK_BODY = \`@media (prefers-color-scheme: dark){html body{background-color:\${background.default};color:\${text.primary}}}\`;

// In Layout, after <Links />:
<style dangerouslySetInnerHTML={{ __html: DARK_BODY }} />`;

export default function ReactRouterGuide() {
  return (
    <GuidePage href={HREF} toc={[...TOC]} doodle="cone" aside="framework mode">
      <Section id="before-you-start" title="Before you start">
        <p>
          You need Node.js 20.19 or newer and the Sorbet UI tarballs. Sorbet UI is not on npm yet, so
          follow <Link href="/docs/installation#build">Build the packages</Link> first. The commands
          below assume a <code>sorbet-ui</code> folder next to your app.
        </p>
        <p>
          This guide covers React Router in <strong>framework mode</strong>, the default of{' '}
          <code>create-react-router</code>, with server rendering on. If you use React Router as a
          library inside a Vite app (declarative or data mode), follow the{' '}
          <Link href="/docs/frameworks/vite">Vite guide</Link> and put your router inside{' '}
          <code>ThemeProvider</code>; we have only tested framework mode.
        </p>
      </Section>

      <Section id="setup" title="Set up framework mode">
        <Steps>
          <Step id="create" title="Create the app">
            <CodeBlock code={CREATE} title="Terminal" label="Create a React Router app" />
            <p>
              Accept the prompts to install dependencies. The template ships with Tailwind in{' '}
              <code>app/app.css</code>; this guide stops importing that file so{' '}
              <code>CssBaseline</code> alone sets the base styles. We have not tested Sorbet with
              Tailwind&apos;s base styles loaded.
            </p>
          </Step>
          <Step id="install" title="Install">
            <CodeBlock code={INSTALL} title="Terminal" label="Install Sorbet UI in React Router" />
          </Step>
          <Step id="providers" title="Add a provider">
            <p>
              Framework mode has no Server Components by default, so the provider is an ordinary
              component file:
            </p>
            <CodeBlock code={PROVIDERS} title="app/providers.tsx" label="React Router: providers" />
          </Step>
          <Step id="root" title="Wire up app/root.tsx">
            <p>
              Wrap <code>children</code> in <code>Layout</code>, so routes and the error boundary
              both get the theme. Remove the <code>app.css</code> import.
            </p>
            <CodeBlock code={ROOT} title="app/root.tsx" label="React Router: root layout" />
          </Step>
          <Step id="first-page" title="Build a first route">
            <CodeBlock code={HOME} title="app/routes/home.tsx" label="React Router: first route" />
            <p>
              Run <code>npm run dev</code> and open the URL it prints (http://localhost:5173 by
              default). You should see an info alert and a blue button.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="dark-mode" title="Dark mode">
        <p>
          The same approach as Next.js works here, because both render on the server first. Replace{' '}
          <code>app/providers.tsx</code> so the first render is light and a layout effect switches
          to the system setting:
        </p>
        <CodeBlock code={DARK_PROVIDERS} title="app/providers.tsx" label="React Router: providers that follow the system theme" />
        <p>Then paint the dark page background before React loads:</p>
        <CodeBlock code={DARK_ROOT} title="app/root.tsx" label="React Router: dark background before hydration" />
        <p>
          The page background is right from the first frame. Components switch to dark when React
          hydrates.
        </p>
      </Section>

      <Section id="what-we-tested" title="What we tested">
        <p>On a new app made with <code>create-react-router</code>, with the files above:</p>
        <ul>
          <li>
            <code>npm run typecheck</code> and <code>npm run build</code> pass.
          </li>
          <li>
            The production server (<code>npm run start</code>) sends styled HTML: Emotion writes its
            style tags inline in the server response, so the page looks right before JavaScript
            runs. No extra cache setup is needed.
          </li>
          <li>
            In <code>npm run dev</code> and in production, the page hydrates with no console errors
            or hydration warnings, in light and dark.
          </li>
        </ul>
        <Alert variant="soft" color="neutral">
          <AlertTitle>Not covered yet</AlertTitle>
          Streaming with a custom <code>entry.server.tsx</code>, SPA mode (<code>ssr: false</code>) and
          prerendering have not been tested with Sorbet UI.
        </Alert>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <H3 id="dev-reload">The dev server reloads once on first start</H3>
        <p>
          On the first <code>npm run dev</code>, Vite discovers MUI and Sorbet, pre-bundles them, and
          reloads the page. The console may show <code>504 (Outdated Optimize Dep)</code> and a failed
          dynamic import once. Reload the page; later starts use the cache.
        </p>
        <H3 id="hydration">Hydration mismatch warnings</H3>
        <p>
          A common cause is reading the color mode during render (<code>localStorage</code>,{' '}
          <code>window.matchMedia</code>, or <code>useMediaQuery</code> with <code>noSsr</code>),
          which the server cannot do. Render light first and switch in an effect, as in the
          dark-mode providers above. For peer dependency errors, see{' '}
          <Link href="/docs/installation#troubleshooting">Installation troubleshooting</Link>.
        </p>
      </Section>
    </GuidePage>
  );
}
