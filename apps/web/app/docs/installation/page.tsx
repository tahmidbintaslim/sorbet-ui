import type { Metadata } from 'next';
import { AlertTitle, Link } from '@mui/material';
import { Alert, Tabs } from '@sorbet-ui/react';
import { pageMeta } from '@/lib/seo';
import { docPage } from '@/lib/docs-nav';
import GuidePage, { H3, Section } from '@/components/docs/GuidePage';
import CodeBlock, { CommandLine } from '@/components/CodeBlock';
import { REGISTRY_URL, addCommand } from '@/lib/registry';
import { SITE } from '@/lib/site';
import { Step, Steps } from '../_start/Steps';
import LinkGrid from '../_start/LinkGrid';

const HREF = '/docs/installation';
const meta = docPage(HREF)!;

export const metadata: Metadata = pageMeta({ title: meta.title, description: meta.description, path: HREF });

const TOC = [
  { id: 'prerequisites', label: 'Prerequisites', depth: 2 },
  { id: 'build', label: 'Build the packages', depth: 2 },
  { id: 'setup', label: 'Set up your app', depth: 2 },
  { id: 'framework-guides', label: 'Framework guides', depth: 2 },
  { id: 'dark-mode', label: 'Dark mode', depth: 2 },
  { id: 'fonts', label: 'Load the Inter font', depth: 2 },
  { id: 'cli', label: 'Add blocks with the shadcn CLI', depth: 2 },
  { id: 'troubleshooting', label: 'Troubleshooting', depth: 2 },
  { id: 'peer-errors', label: 'Peer dependency errors', depth: 3 },
  { id: 'missing-module', label: 'Cannot find module', depth: 3 },
  { id: 'server-functions', label: 'Functions cannot be passed', depth: 3 },
  { id: 'styles-wrong', label: 'Styles missing or stale', depth: 3 },
  { id: 'next-steps', label: 'Next steps', depth: 2 },
] as const;

// Every command below was run end to end in a clean folder: clone, build, pack,
// install the tarballs into a new Vite app and a new Next.js app, and build both.
const BUILD_FROM_SOURCE = `git clone ${SITE.github}.git
cd sorbet-ui
pnpm install && pnpm build:packages
# Packs tokens, core, theme and react into sorbet-ui/tarballs/
pnpm --filter "./packages/*" pack --pack-destination "$PWD/tarballs"`;

// The one install command. Run it in your app, next to the sorbet-ui folder.
// @sorbet-ui/react depends on core and tokens, so all four tarballs are needed.
const PEERS = '@mui/material @mui/icons-material @mui/x-date-pickers @emotion/react @emotion/styled dayjs react react-dom';
const INSTALL = `npm install ../sorbet-ui/tarballs/sorbet-ui-*.tgz \\
  ${PEERS}`;
const INSTALL_NEXT = `npm install ../sorbet-ui/tarballs/sorbet-ui-*.tgz \\
  ${PEERS} @mui/material-nextjs`;

const VITE = `// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);`;

const VITE_APP = `// src/App.tsx
import { Button } from '@sorbet-ui/react';

export default function App() {
  return (
    <Button variant="solid" color="primary">
      Hello Sorbet
    </Button>
  );
}`;

const NEXT_PROVIDERS = `// app/providers.tsx
'use client';
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

const NEXT_LAYOUT = `// app/layout.tsx (a Server Component)
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Inter } from 'next/font/google';
import Providers from './providers';

// Many Sorbet components ask for Inter but do not load it; this loads it.
const inter = Inter({ subsets: ['latin'], display: 'swap' });

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

const NEXT_PAGE = `// app/page.tsx (a Server Component)
import { Button } from '@sorbet-ui/react';

export default function Page() {
  return (
    <Button variant="solid" color="primary">
      Hello Sorbet
    </Button>
  );
}`;

const FONT_VITE = `npm install @fontsource/inter

// src/main.tsx
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';`;

const DARK = `import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from '@sorbet-ui/theme';

function Root({ children }: { children: React.ReactNode }) {
  // Follow the operating system setting.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <ThemeProvider theme={prefersDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

// shadcn needs a components.json. MUI apps do not use Tailwind, so the tailwind
// fields stay empty. The "registries" entry enables the short @sorbet/<name> form.
const COMPONENTS_JSON = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": { "config": "", "css": "", "baseColor": "neutral", "cssVariables": false },
  "aliases": { "components": "@/components", "utils": "@/lib/utils" },
  "registries": { "@sorbet": "${REGISTRY_URL}/{name}.json" }
}`;

const PROVIDER_USE = `import SorbetProvider from '@/components/sorbet/SorbetProvider';
import HeroCentered from '@/components/sorbet/HeroCentered';

export default function App() {
  return (
    <SorbetProvider mode="system">
      <HeroCentered />
    </SorbetProvider>
  );
}`;

function SeeResult({ where }: { where: string }) {
  return (
    <Step title="Check the result">
      <p>Start the dev server and open {where}. You should see:</p>
      <ul>
        <li>
          A blue <strong>Hello Sorbet</strong> button with white text and rounded corners, top left
          on an otherwise empty page.
        </li>
        <li>No default browser margin around the page. That is <code>CssBaseline</code> at work.</li>
        <li>
          If the button looks like a plain grey browser button, the theme provider is missing or the
          tarballs did not install. Check the terminal for errors.
        </li>
      </ul>
    </Step>
  );
}

const FRAMEWORKS = [
  { href: '/docs/frameworks/nextjs', title: 'Next.js', note: 'App Router with server rendering, a client provider and dark mode.' },
  { href: '/docs/frameworks/vite', title: 'Vite', note: 'A single-page React app: one file to wrap, nothing else to configure.' },
  { href: '/docs/frameworks/react-router', title: 'React Router', note: 'Framework mode with server rendering, wired in app/root.tsx.' },
  { href: '/docs/migrating-from-mui', title: 'Existing MUI app', note: 'Swap the theme first, then adopt components one screen at a time.' },
];

export default function Installation() {
  return (
    <GuidePage href={HREF} toc={[...TOC]} doodle="cone" aside="first scoop">
      <Alert color="info" variant="soft" data-testid="prerelease-notice">
        <AlertTitle>Pre-release: not on npm yet</AlertTitle>
        Version 0.1.0 of the <code>@sorbet-ui/*</code> packages is not published to npm yet, so{' '}
        <code>npm install @sorbet-ui/react</code> fails with a 404 today. Until it is, build the
        packages from source and install the tarballs, as shown below.
      </Alert>

      <Section id="prerequisites" title="Prerequisites">
        <ul>
          <li>
            <strong>Node.js 20.19 or newer</strong> (current Vite and Next.js need it) and{' '}
            <strong>pnpm 10</strong> to build from source (<code>corepack enable</code> provides it).
          </li>
          <li>
            <strong>React 19</strong> for the components (<code>@sorbet-ui/react</code>). The theme
            alone (<code>@sorbet-ui/theme</code>) works with React 18 or 19.
          </li>
          <li>
            <strong>Material UI 7.3.5 or newer, or 9</strong> (<code>@mui/material</code> and{' '}
            <code>@mui/icons-material</code> on the same major), <code>@mui/x-date-pickers</code> 8
            or 9, Emotion 11 and <code>dayjs</code>.
          </li>
        </ul>
      </Section>

      <Section id="build" title="Build the packages">
        <p>
          Clone the repository next to your app, build it, and pack the four packages into tarballs
          (macOS, Linux, or WSL / Git Bash on Windows):
        </p>
        <CodeBlock code={BUILD_FROM_SOURCE} title="Terminal" label="Build Sorbet UI from source" />
        <p>
          <code>@sorbet-ui/react</code> depends on <code>@sorbet-ui/core</code> and{' '}
          <code>@sorbet-ui/tokens</code>, so install all four tarballs. Installing only theme and
          react fails with <code>404 &apos;@sorbet-ui/core@0.1.0&apos; is not in this registry</code>.
        </p>
      </Section>

      <Section id="setup" title="Set up your app">
        <p>
          Three steps: install, wrap your app in the theme, render a component. Pick your framework.
          The commands assume your app folder sits next to <code>sorbet-ui</code>.
        </p>
        <Tabs
          variant="soft"
          aria-label="Framework"
          defaultValue="vite"
          tabs={[
            {
              id: 'vite',
              label: 'Vite',
              content: (
                <Steps>
                  <Step title="Install">
                    <CodeBlock code={INSTALL} title="Terminal" label="Install command for Vite" />
                  </Step>
                  <Step title="Wrap your app in the theme">
                    <p>
                      <code>ThemeProvider</code> hands the Sorbet theme to every component below it.{' '}
                      <code>CssBaseline</code> resets browser styles and sets the page background.
                    </p>
                    <CodeBlock code={VITE} title="src/main.tsx" label="Vite: wrap the app in the Sorbet theme" />
                  </Step>
                  <Step title="Render a component">
                    <CodeBlock code={VITE_APP} title="src/App.tsx" label="Vite: render a Button" />
                  </Step>
                  <SeeResult where="http://localhost:5173 (npm run dev)" />
                </Steps>
              ),
            },
            {
              id: 'next',
              label: 'Next.js',
              content: (
                <Steps>
                  <Step title="Install">
                    <p>
                      Next.js also needs <code>@mui/material-nextjs</code>, which puts the styles in
                      the server HTML.
                    </p>
                    <CodeBlock code={INSTALL_NEXT} title="Terminal" label="Install command for Next.js" />
                  </Step>
                  <Step title="Wrap your app in the theme">
                    <p>
                      A theme contains functions, so it cannot be passed from a Server Component. Put{' '}
                      <code>ThemeProvider</code> in a <code>&apos;use client&apos;</code> file:
                    </p>
                    <CodeBlock code={NEXT_PROVIDERS} title="app/providers.tsx" label="Next.js providers" />
                    <p>
                      Then use it in the root layout, inside <code>AppRouterCacheProvider</code>. On
                      Next.js 15, import from <code>@mui/material-nextjs/v15-appRouter</code>.
                    </p>
                    <CodeBlock code={NEXT_LAYOUT} title="app/layout.tsx" label="Next.js root layout" />
                  </Step>
                  <Step title="Render a component">
                    <p>
                      <code>@sorbet-ui/react</code> ships with a <code>&quot;use client&quot;</code>{' '}
                      banner, so a Server Component can import it directly.
                    </p>
                    <CodeBlock code={NEXT_PAGE} title="app/page.tsx" label="Next.js: render a Button" />
                  </Step>
                  <SeeResult where="http://localhost:3000 (npm run dev)" />
                </Steps>
              ),
            },
          ]}
        />
      </Section>

      <Section id="framework-guides" title="Framework guides">
        <p>Each guide starts from a new app and covers dark mode and common errors.</p>
        <LinkGrid items={FRAMEWORKS} testId="framework-links" />
      </Section>

      <Section id="dark-mode" title="Dark mode">
        <p>
          Swap <code>lightTheme</code> for <code>darkTheme</code>. This root follows the operating
          system setting. In Next.js, keep it in your <code>&apos;use client&apos;</code> providers
          file; the <Link href="/docs/frameworks/nextjs#dark-mode">Next.js guide</Link> shows how to
          avoid a white flash for dark-mode visitors.
        </p>
        <CodeBlock code={DARK} title="Root.tsx" label="Switch between lightTheme and darkTheme" />
      </Section>

      <Section id="fonts" title="Load the Inter font">
        <p>
          The theme&apos;s body text uses your system font. Most components (TextField, Select, Chip,
          Alert, Tabs, Table and others) ask for Inter first but do not load it, so without Inter
          they fall back to the system font and nothing breaks. To get Inter, load it: in Next.js
          with <code>next/font/google</code> as in the layout above, in Vite with Fontsource:
        </p>
        <CodeBlock code={FONT_VITE} title="Load Inter in Vite" label="Load the Inter font in Vite" />
      </Section>

      <Section id="cli" title="Add blocks with the shadcn CLI">
        <Alert color="warning" variant="soft" sx={{ my: 2 }}>
          Until 0.1.0 is on npm, the CLI cannot install a block&apos;s <code>@sorbet-ui/*</code>{' '}
          dependencies, so these commands fail. For now, install the tarballs as above and copy a
          block&apos;s source from the Code tab on the{' '}
          <Link href="/blocks" color="inherit" sx={{ fontWeight: 600 }}>
            blocks page
          </Link>
          .
        </Alert>
        <p>
          This site publishes a <Link href="https://ui.shadcn.com/docs/registry" rel="noopener">shadcn registry</Link>.
          It has one item per block plus a <code>theme</code> item. When you add a block, the CLI:
        </p>
        <ul>
          <li>
            Copies the block to <code>components/sorbet/&lt;Name&gt;.tsx</code>.
          </li>
          <li>
            Adds the <code>theme</code> item, which copies a <code>SorbetProvider</code> wrapper to{' '}
            <code>components/sorbet/SorbetProvider.tsx</code>. It takes{' '}
            <code>mode=&quot;light&quot; | &quot;dark&quot; | &quot;system&quot;</code>.
          </li>
          <li>Installs the npm packages the files import. No Tailwind is needed.</li>
        </ul>
        <p>
          If your project has no <code>components.json</code> yet, add this one at the root:
        </p>
        <CodeBlock code={COMPONENTS_JSON} title="components.json" label="components.json for an MUI app" />
        <p>Then add any block by URL, or by its short name:</p>
        <CommandLine command={addCommand('hero-centered')} label="Add a block by URL" />
        <CommandLine command="npx shadcn@latest add @sorbet/hero-centered" label="Add a block by short name" mt={1.5} />
        <CodeBlock code={PROVIDER_USE} title="App.tsx" label="Using an installed block" />
        <p>
          The <code>@/</code> alias must point at your source folder (for example <code>src/</code>)
          in <code>tsconfig.json</code> and your bundler. In the Next.js App Router, place{' '}
          <code>SorbetProvider</code> inside <code>AppRouterCacheProvider</code>, as in the layout
          above. The full list is at <Link href={`${REGISTRY_URL}/registry.json`}>registry.json</Link>.
        </p>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <H3 id="peer-errors">npm ERR! ERESOLVE or peer dependency errors</H3>
        <p>
          A peer does not match. The usual causes: React 18 with <code>@sorbet-ui/react</code> (it
          needs React 19), Material UI older than 7.3.5, or <code>@mui/material</code> and{' '}
          <code>@mui/icons-material</code> on different majors. Upgrade the packages npm names in the
          error rather than passing <code>--legacy-peer-deps</code>, which only hides the mismatch. A{' '}
          <code>404</code> for <code>@sorbet-ui/core</code> or <code>@sorbet-ui/tokens</code> means
          not all four tarballs were installed.
        </p>
        <H3 id="missing-module">Cannot find module &apos;@mui/x-date-pickers&apos;</H3>
        <p>
          The same goes for <code>dayjs</code> and <code>@mui/icons-material</code>. Install every
          peer in the install command, even if you do not use DatePicker or Rating.
        </p>
        <H3 id="server-functions">Next.js: Functions cannot be passed directly to Client Components</H3>
        <p>
          The theme was passed to <code>ThemeProvider</code> from a Server Component (usually{' '}
          <code>app/layout.tsx</code>). Move the provider into <code>app/providers.tsx</code> with{' '}
          <code>&apos;use client&apos;</code> at the top, as in the Next.js tab above.
        </p>
        <H3 id="styles-wrong">Styles missing, duplicated or stale</H3>
        <p>
          Check that only one copy of MUI and Emotion is installed (<code>npm ls @mui/material</code>
          ). In Next.js, check that <code>AppRouterCacheProvider</code> wraps your providers, so
          Emotion collects the styles into the document head in order.
        </p>
      </Section>

      <Section id="next-steps" title="Next steps">
        <ul>
          <li>
            <Link href="/docs">Introduction</Link>: the variant, color and size API in one page.
          </li>
          <li>
            <Link href="/docs/theming">Theming</Link>: the light and dark themes and how to extend
            them.
          </li>
          <li>
            <Link href="/docs/components">Components</Link>: every component with live examples and
            props.
          </li>
          <li>
            <Link href="/demo">Demo</Link>: a working admin dashboard built only from Sorbet UI.
          </li>
        </ul>
      </Section>
    </GuidePage>
  );
}
