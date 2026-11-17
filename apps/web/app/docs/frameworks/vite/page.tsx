import type { Metadata } from 'next';
import { Link } from '@mui/material';
import { pageMeta } from '@/lib/seo';
import { docPage } from '@/lib/docs-nav';
import GuidePage, { H3, Section } from '@/components/docs/GuidePage';
import CodeBlock from '@/components/CodeBlock';
import { Step, Steps } from '../../_start/Steps';

const HREF = '/docs/frameworks/vite';
const meta = docPage(HREF)!;

export const metadata: Metadata = pageMeta({ title: meta.title, description: meta.description, path: HREF });

const TOC = [
  { id: 'before-you-start', label: 'Before you start', depth: 2 },
  { id: 'setup', label: 'Set up Vite', depth: 2 },
  { id: 'create', label: 'Create the app', depth: 3 },
  { id: 'install', label: 'Install', depth: 3 },
  { id: 'provider', label: 'Wrap the app in the theme', depth: 3 },
  { id: 'first-page', label: 'Build a first page', depth: 3 },
  { id: 'dark-mode', label: 'Dark mode', depth: 2 },
  { id: 'fonts', label: 'Load the Inter font', depth: 2 },
  { id: 'troubleshooting', label: 'Troubleshooting', depth: 2 },
  { id: 'chunk-warning', label: 'Chunks larger than 500 kB', depth: 3 },
  { id: 'unstyled', label: 'Plain grey buttons', depth: 3 },
] as const;

const CREATE = `npm create vite@latest my-app -- --template react-ts
cd my-app
npm install`;

const INSTALL = `npm install ../sorbet-ui/tarballs/sorbet-ui-*.tgz \\
  @mui/material @mui/icons-material @mui/x-date-pickers \\
  @emotion/react @emotion/styled dayjs react react-dom`;

const MAIN = `import { StrictMode } from 'react';
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

const APP = `import { Button as MuiButton, TextField as MuiTextField, Stack } from '@mui/material';
import { Alert, Button, Chip, TextField } from '@sorbet-ui/react';

export default function App() {
  return (
    <Stack spacing={2} sx={{ p: 4, maxWidth: 420 }}>
      {/* Sorbet components */}
      <Alert variant="soft" color="success">Changes saved</Alert>
      <TextField variant="outlined" label="Email" />
      <Button variant="solid" color="primary">Hello Sorbet</Button>
      <Chip variant="soft" color="info" label="New" />

      {/* Stock Material UI, restyled by the theme */}
      <MuiButton variant="contained">Stock MUI button</MuiButton>
      <MuiTextField label="Stock MUI field" />
    </Stack>
  );
}`;

const DARK = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from '@sorbet-ui/theme';
import App from './App';

function Root() {
  // Follow the operating system setting. noSsr reads it on the first render,
  // which is safe here because Vite does not render on a server.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  return (
    <ThemeProvider theme={prefersDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);`;

const FONT = `npm install @fontsource/inter

// src/main.tsx
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';`;

const CHUNKS = `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1500 },
});`;

export default function ViteGuide() {
  return (
    <GuidePage href={HREF} toc={[...TOC]} doodle="cone" aside="quick scoop">
      <Section id="before-you-start" title="Before you start">
        <p>
          You need Node.js 20.19 or newer and the Sorbet UI tarballs. Sorbet UI is not on npm yet, so
          follow <Link href="/docs/installation#build">Build the packages</Link> first. The commands
          below assume a <code>sorbet-ui</code> folder next to your app.
        </p>
        <p>
          Vite renders in the browser only, so there is no server setup: one provider in{' '}
          <code>src/main.tsx</code> is all it takes. We ran this guide on a new Vite app; the
          template&apos;s <code>npm run build</code> (strict <code>tsc</code>, then{' '}
          <code>vite build</code>) passes, and the page renders without console errors in light and
          dark.
        </p>
      </Section>

      <Section id="setup" title="Set up Vite">
        <Steps>
          <Step id="create" title="Create the app">
            <CodeBlock code={CREATE} title="Terminal" label="Create a Vite React app" />
            <p>
              Delete <code>src/index.css</code> and <code>src/App.css</code>.{' '}
              <code>CssBaseline</code> takes over the base styles, and the files below replace the
              ones that import them.
            </p>
          </Step>
          <Step id="install" title="Install">
            <CodeBlock code={INSTALL} title="Terminal" label="Install Sorbet UI in Vite" />
          </Step>
          <Step id="provider" title="Wrap the app in the theme">
            <p>
              Replace <code>src/main.tsx</code>. <code>ThemeProvider</code> hands the theme to every
              component below it; <code>CssBaseline</code> resets browser styles and sets the page
              background.
            </p>
            <CodeBlock code={MAIN} title="src/main.tsx" label="Vite: main.tsx with the Sorbet theme" />
          </Step>
          <Step id="first-page" title="Build a first page">
            <p>
              This page mixes Sorbet components with stock Material UI ones. Both get the Sorbet look
              from the same theme.
            </p>
            <CodeBlock code={APP} title="src/App.tsx" label="Vite: first page" />
            <p>
              Run <code>npm run dev</code> and open http://localhost:5173. The stock MUI button has
              rounded corners and a sentence-case label instead of Material&apos;s uppercase text.
            </p>
          </Step>
        </Steps>
      </Section>

      <Section id="dark-mode" title="Dark mode">
        <p>
          Pick <code>darkTheme</code> when the operating system prefers dark. Replace{' '}
          <code>src/main.tsx</code> with:
        </p>
        <CodeBlock code={DARK} title="src/main.tsx" label="Vite: follow the system color scheme" />
        <p>
          The theme follows the system setting live: change it while the page is open and the page switches. For a toggle
          that remembers the visitor&apos;s choice, see{' '}
          <Link href="/docs/customization/dark-mode">Dark mode</Link>.
        </p>
      </Section>

      <Section id="fonts" title="Load the Inter font">
        <p>
          Most Sorbet components ask for Inter first and fall back to the system font. To get Inter,
          load it with Fontsource:
        </p>
        <CodeBlock code={FONT} title="Load Inter" label="Vite: load the Inter font" />
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <H3 id="chunk-warning">(!) Some chunks are larger than 500 kB after minification</H3>
        <p>
          A warning, not an error: the build still succeeds. MUI and Sorbet land in one bundle in a
          single-page app. Split large routes with <code>import()</code>, or raise the limit:
        </p>
        <CodeBlock code={CHUNKS} title="vite.config.ts" label="Vite: raise the chunk size warning limit" />
        <H3 id="unstyled">Buttons look like plain grey browser buttons</H3>
        <p>
          The theme provider is missing, or the tarballs did not install. Check that{' '}
          <code>ThemeProvider</code> wraps <code>&lt;App /&gt;</code> and that{' '}
          <code>npm ls @sorbet-ui/react</code> lists the package. For peer dependency errors, see{' '}
          <Link href="/docs/installation#troubleshooting">Installation troubleshooting</Link>.
        </p>
      </Section>
    </GuidePage>
  );
}
