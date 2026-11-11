import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { AlertTitle, Box, Link, Typography } from '@mui/material';
import { Alert, Tabs } from '@sorbet-ui/react';
import CodeBlock, { CommandLine } from '@/components/CodeBlock';
import { REGISTRY_URL, addCommand } from '@/lib/registry';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';

export const metadata: Metadata = pageMeta({
  title: 'Getting started',
  description: 'Install Sorbet UI, wrap your app in its theme, and your existing Material UI screens restyle. Vite and Next.js.',
  path: '/docs',
});

const REPO = 'https://github.com/tahmidbintaslim/sorbet-ui';

// Every command below was run end to end in a clean folder: clone, build, pack,
// install the tarballs into a new Vite app and a new Next.js app, and build both.
const BUILD_FROM_SOURCE = `git clone ${REPO}.git
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

const DARK = `// app/providers.tsx (or wrap your Vite app the same way)
'use client';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from '@sorbet-ui/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
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

const h2 = { fontWeight: 700, mt: 5, scrollMarginTop: 90 } as const;
const h3 = { fontWeight: 700, fontSize: 17, mt: 3 } as const;

function Step({ children }: { children: React.ReactNode }) {
  return (
    <Typography component="h3" sx={h3}>
      {children}
    </Typography>
  );
}

function SeeResult({ where }: { where: string }) {
  return (
    <>
      <Step>What you should see</Step>
      <Typography color="text.secondary" component="div">
        <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
          <li>
            At {where}: a blue <strong>Hello Sorbet</strong> button with white text and rounded
            corners, in the top left of an otherwise empty page.
          </li>
          <li>
            No default browser margin around the page. That is <code>CssBaseline</code> at work.
          </li>
          <li>
            If the button looks like a plain grey browser button, the theme provider is missing or
            the tarballs did not install; check the terminal for errors.
          </li>
        </ul>
      </Typography>
    </>
  );
}

export default function GettingStarted() {
  return (
    <>
      <PageHeader flavor={SECTION_FLAVOR.docs} doodle="cone" aside="start here!" title="Getting started">
        Sorbet UI wraps Material UI v7 or v9. Install the packages and their peer dependencies, wrap
        your app in a Sorbet theme, and render a component.
      </PageHeader>

      <Alert color="info" variant="soft" data-testid="prerelease-notice">
        <AlertTitle>Pre-release: not on npm yet</AlertTitle>
        Version 0.1.0 of the <code>@sorbet-ui/*</code> packages is not published to npm yet, so{' '}
        <code>npm install @sorbet-ui/react</code> fails with a 404 today. Until it is, build the
        packages from source and install the tarballs, as shown below.
      </Alert>

      <Typography component="h2" id="prerequisites" variant="h5" sx={h2}>
        Prerequisites
      </Typography>
      <Typography color="text.secondary" component="div">
        <ul style={{ paddingLeft: 20 }}>
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
      </Typography>

      <Typography component="h2" id="build" variant="h5" sx={h2}>
        Build the packages
      </Typography>
      <Typography color="text.secondary">
        Clone the repository next to your app, build it, and pack the four packages into tarballs
        (macOS, Linux, or WSL / Git Bash on Windows):
      </Typography>
      <CodeBlock code={BUILD_FROM_SOURCE} title="Terminal" label="Build Sorbet UI from source" />
      <Typography variant="body2" color="text.secondary">
        <code>@sorbet-ui/react</code> depends on <code>@sorbet-ui/core</code> and{' '}
        <code>@sorbet-ui/tokens</code>, so install all four tarballs. Installing only theme and
        react fails with <code>404 &apos;@sorbet-ui/core@0.1.0&apos; is not in this registry</code>.
      </Typography>

      <Typography component="h2" id="setup" variant="h5" sx={h2}>
        Set up your app
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Pick your framework. The commands assume your app folder sits next to{' '}
        <code>sorbet-ui</code>.
      </Typography>
      <Tabs
        variant="soft"
        aria-label="Framework"
        defaultValue="vite"
        tabs={[
          {
            id: 'vite',
            label: 'Vite',
            content: (
              <Box>
                <Step>1. Install</Step>
                <CodeBlock code={INSTALL} title="Terminal" label="Install command for Vite" />
                <Step>2. Wrap your app in the theme</Step>
                <CodeBlock code={VITE} title="src/main.tsx" label="Vite: wrap the app in the Sorbet theme" />
                <Step>3. Render a Button</Step>
                <CodeBlock code={VITE_APP} title="src/App.tsx" label="Vite: render a Button" />
                <SeeResult where="http://localhost:5173 (npm run dev)" />
              </Box>
            ),
          },
          {
            id: 'next',
            label: 'Next.js',
            content: (
              <Box>
                <Step>1. Install</Step>
                <CodeBlock code={INSTALL_NEXT} title="Terminal" label="Install command for Next.js" />
                <Step>2. Wrap your app in the theme</Step>
                <Typography color="text.secondary">
                  A theme contains functions, so it cannot be passed from a Server Component. Put{' '}
                  <code>ThemeProvider</code> in a <code>&apos;use client&apos;</code> file:
                </Typography>
                <CodeBlock code={NEXT_PROVIDERS} title="app/providers.tsx" label="Next.js providers" />
                <Typography color="text.secondary">
                  Then use it in the root layout, inside <code>AppRouterCacheProvider</code> so
                  styles are in the server HTML. On Next.js 15, import from{' '}
                  <code>@mui/material-nextjs/v15-appRouter</code>.
                </Typography>
                <CodeBlock code={NEXT_LAYOUT} title="app/layout.tsx" label="Next.js root layout" />
                <Step>3. Render a Button</Step>
                <Typography color="text.secondary">
                  Sorbet components ship with a <code>&quot;use client&quot;</code> banner, so a
                  Server Component can import them directly.
                </Typography>
                <CodeBlock code={NEXT_PAGE} title="app/page.tsx" label="Next.js: render a Button" />
                <SeeResult where="http://localhost:3000 (npm run dev)" />
              </Box>
            ),
          },
        ]}
      />

      <Typography component="h2" id="troubleshooting" variant="h5" sx={h2}>
        Troubleshooting
      </Typography>
      <Typography component="h3" sx={h3}>
        npm ERR! ERESOLVE or peer dependency errors
      </Typography>
      <Typography color="text.secondary">
        A peer does not match. The usual causes: React 18 with <code>@sorbet-ui/react</code> (it
        needs React 19), Material UI older than 7.3.5, or <code>@mui/material</code> and{' '}
        <code>@mui/icons-material</code> on different majors. Upgrade the package npm names in the
        error rather than passing <code>--legacy-peer-deps</code>, which only hides the mismatch.
        A <code>404</code> for <code>@sorbet-ui/core</code> or <code>@sorbet-ui/tokens</code> means
        not all four tarballs were installed.
      </Typography>
      <Typography component="h3" sx={h3}>
        Next.js: &ldquo;Functions cannot be passed directly to Client Components&rdquo;
      </Typography>
      <Typography color="text.secondary">
        The theme was passed to <code>ThemeProvider</code> from a Server Component (usually{' '}
        <code>app/layout.tsx</code>). Move the provider into <code>app/providers.tsx</code> with{' '}
        <code>&apos;use client&apos;</code> at the top, as in the Next.js tab above.
      </Typography>
      <Typography component="h3" sx={h3}>
        Next.js: the page flashes unstyled, then snaps into place
      </Typography>
      <Typography color="text.secondary">
        Without <code>AppRouterCacheProvider</code>, Emotion only adds styles in the browser, so the
        server HTML arrives unstyled. Install <code>@mui/material-nextjs</code> and wrap{' '}
        <code>&lt;Providers&gt;</code> with it in <code>app/layout.tsx</code>.
      </Typography>
      <Typography component="h3" sx={h3}>
        Text uses the system font, not Inter
      </Typography>
      <Typography color="text.secondary">
        The theme&apos;s body text uses your system font. Most components (TextField, Select, Chip,
        Alert, Tabs, Table and others) ask for Inter first but do not load it, so without Inter
        they fall back to the system font and nothing breaks. To get Inter, load it: in Next.js
        with <code>next/font/google</code> as in the layout above, in Vite with Fontsource:
      </Typography>
      <CodeBlock code={FONT_VITE} title="Load Inter in Vite" label="Load the Inter font in Vite" />

      <Typography component="h2" id="next-steps" variant="h5" sx={h2}>
        Next steps
      </Typography>
      <Typography color="text.secondary" component="div">
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <Link href="/docs/theming">
              Theming
            </Link>
            : light and dark themes and how to extend them.
          </li>
          <li>
            <Link href="/docs/components">
              Components
            </Link>
            : every component with live examples and props.
          </li>
          <li>
            <Link href="/blocks">
              Blocks
            </Link>
            : ready-made page sections to copy.
          </li>
          <li>
            <Link href="/demo">
              Demo
            </Link>
            : a working admin dashboard built only from Sorbet UI.
          </li>
        </ul>
      </Typography>
      <Typography component="h3" sx={h3}>
        Dark mode
      </Typography>
      <Typography color="text.secondary">
        Swap <code>lightTheme</code> for <code>darkTheme</code>. This provider follows the operating
        system setting:
      </Typography>
      <CodeBlock code={DARK} title="Dark mode" label="Switch between lightTheme and darkTheme" />

      <Typography component="h2" id="cli" variant="h5" sx={h2}>
        Add blocks with the shadcn CLI
      </Typography>
      <Alert color="warning" variant="soft" sx={{ my: 2 }}>
        Until 0.1.0 is on npm, the CLI cannot install a block&apos;s <code>@sorbet-ui/*</code>{' '}
        dependencies, so these commands fail. For now, install the tarballs as above and copy a
        block&apos;s source from the Code tab on the{' '}
        <Link href="/blocks" color="inherit">
          blocks page
        </Link>
        .
      </Alert>
      <Typography color="text.secondary">
        Once published, every block on the blocks page installs with one command. The CLI copies the
        block into <code>components/sorbet/</code>, adds a <code>SorbetProvider</code> theme wrapper,
        and installs the npm packages it imports. No Tailwind needed. If your project has no{' '}
        <code>components.json</code> yet, add this one at the root:
      </Typography>
      <CodeBlock code={COMPONENTS_JSON} title="components.json" label="components.json for an MUI app" />
      <Typography color="text.secondary">Then add any block by URL, or by its short name:</Typography>
      <CommandLine command={addCommand('hero-centered')} label="Add a block by URL" />
      <CommandLine command="npx shadcn@latest add @sorbet/hero-centered" label="Add a block by short name" mt={1.5} />
      <CodeBlock code={PROVIDER_USE} title="App.tsx" label="Using an installed block" />
      <Typography variant="body2" color="text.secondary">
        The <code>@/</code> alias must point at your source folder (for example <code>src/</code>) in{' '}
        <code>tsconfig.json</code> and your bundler. In the Next.js App Router, place{' '}
        <code>SorbetProvider</code> inside <code>AppRouterCacheProvider</code>, as in the layout
        above. The full list is at <a href={`${REGISTRY_URL}/registry.json`}>registry.json</a>.
      </Typography>

      <Typography component="h2" variant="h5" sx={h2}>
        The variant, color and size API
      </Typography>
      <Typography color="text.secondary">
        Every component takes the same three props. Variants: <code>solid</code>,{' '}
        <code>soft</code>, <code>outlined</code>, <code>ghost</code>, <code>plain</code>. Colors:{' '}
        <code>primary</code>, <code>secondary</code>, <code>success</code>, <code>warning</code>,{' '}
        <code>danger</code>, <code>info</code>, <code>neutral</code>. Sizes: <code>xs</code> to{' '}
        <code>xl</code>.
      </Typography>
    </>
  );
}
