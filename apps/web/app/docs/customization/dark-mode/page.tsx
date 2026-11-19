import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import ExampleViewer from '@/components/docs/ExampleViewer';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, NextLinks, Steps } from '../../_shared/parts';
import A from '../../_shared/A';
import { DarkModePreview } from '../demos';
import { COLOR_MODE_KEY } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Dark mode',
  description: 'Follow the system setting, add a toggle, and avoid a flash of the wrong theme.',
  path: '/docs/customization/dark-mode',
});

const toc: TocItem[] = [
  { id: 'pick-a-theme', label: 'Pick a theme by mode', depth: 2 },
  { id: 'try-it', label: 'Try it', depth: 3 },
  { id: 'follow-system', label: 'Follow the system setting', depth: 2 },
  { id: 'toggle', label: 'A toggle that remembers', depth: 2 },
  { id: 'no-flash', label: 'Avoid a flash of the wrong theme', depth: 2 },
  { id: 'how-this-site-does-it', label: 'How this site does it', depth: 3 },
  { id: 'check-components', label: 'Check each component in dark mode', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const PICK = `import { ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';

<ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>{children}</ThemeProvider>`;

const PREVIEW_SOURCE = `'use client';
import * as React from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';
import { Alert, Button, Switch, TextField } from '@sorbet-ui/react';

export default function DarkModePreview() {
  const [dark, setDark] = React.useState(false);
  return (
    <>
      <Switch label="Dark preview" checked={dark} onChange={(_e, v) => setDark(v)} />
      {/* A nested ThemeProvider themes only what is inside it. */}
      <ThemeProvider theme={dark ? darkTheme : lightTheme}>
        <Box sx={{ p: 3, bgcolor: 'background.default', color: 'text.primary' }}>
          <TextField label="Email" type="email" size="sm" fullWidth />
          <Alert color="info" size="sm">Invites expire after 7 days.</Alert>
          <Button size="sm">Send invite</Button>
        </Box>
      </ThemeProvider>
    </>
  );
}`;

const SYSTEM = `'use client';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  // noSsr reads the media query on the first client render instead of after it.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  return (
    <ThemeProvider theme={prefersDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}`;

const TOGGLE = `'use client';
import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';

type Mode = 'light' | 'dark';
const KEY = 'color-mode';
const ColorMode = React.createContext({ mode: 'light' as Mode, toggle: () => {} });
export const useColorMode = () => React.useContext(ColorMode);

// localStorage throws in some private windows and when site data is blocked.
function readStored(): Mode | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // Start light so the server render and the first client render match.
  const [mode, setMode] = React.useState<Mode>('light');

  React.useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    setMode(readStored() ?? (mq.matches ? 'dark' : 'light'));
    // Follow OS changes until the visitor picks a mode.
    const onChange = (e: MediaQueryListEvent) => {
      if (!readStored()) setMode(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = React.useCallback(() => {
    setMode((m) => {
      const next = m === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* the choice just won't persist */
      }
      return next;
    });
  }, []);

  return (
    <ColorMode.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorMode.Provider>
  );
}`;

const TOGGLE_BUTTON = `'use client';
import { Button } from '@sorbet-ui/react';
import { useColorMode } from './providers';

export function ThemeToggle() {
  const { mode, toggle } = useColorMode();
  const next = mode === 'light' ? 'dark' : 'light';
  return (
    <Button variant="ghost" color="neutral" size="sm" onClick={toggle} aria-label={\`Switch to \${next} theme\`}>
      {mode === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
}`;

const INIT = `// app/layout.tsx (simplified from this site)
const KEY = '${COLOR_MODE_KEY}';

// Runs before first paint: saved choice, else the OS setting.
const INIT_MODE = \`try{var m=localStorage.getItem('\${KEY}');
if(m!=='light'&&m!=='dark')m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
var d=document.documentElement;d.dataset.mode=m;d.style.colorScheme=m}catch(e){}\`;

// Paints the dark page color until the theme takes over.
const PRE_HYDRATION_CSS = \`html[data-mode="dark"] body{background-color:#0f172a;color:#f8fafc}\`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_MODE }} />
        <style dangerouslySetInnerHTML={{ __html: PRE_HYDRATION_CSS }} />
      </head>
      <body>{/* providers and children */}</body>
    </html>
  );
}`;

const ADOPT = `// components/ColorMode.tsx (excerpt)
// useLayoutEffect runs after hydration but before the browser paints.
const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const [mode, setMode] = React.useState<Mode>('light');
useIsoLayoutEffect(() => {
  const marked = document.documentElement.dataset.mode; // set by the inline script
  setMode(marked === 'dark' || marked === 'light' ? marked : (readStored() ?? 'light'));
}, []);`;

const OWN = `'use client';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colorScaleForMode, textColorsForMode } from '@sorbet-ui/tokens';

export function Callout({ children }: { children: React.ReactNode }) {
  const isDark = useTheme().palette.mode === 'dark';
  const scale = colorScaleForMode('info', isDark);
  return (
    <Box sx={{ bgcolor: isDark ? scale.alpha20 : scale.alpha12, color: textColorsForMode(isDark).primary }}>
      {children}
    </Box>
  );
}`;

export default function Page() {
  return (
    <GuidePage href="/docs/customization/dark-mode" toc={toc} doodle="jar" aside="after hours">
      <p>
        Sorbet ships two themes, <code>lightTheme</code> and <code>darkTheme</code>. Dark mode is choosing the right
        one: from the operating system, from a toggle the visitor used last time, and early enough that the page never
        shows the wrong one first.
      </p>

      <Section id="pick-a-theme" title="Pick a theme by mode">
        <CodeBlock code={PICK} label="Pick a theme" />
        <p>
          Sorbet components (see the exceptions <A href="#check-components">below</A>) read <code>theme.palette.mode</code> and switch to their dark color scales on their own;
          you do not pass anything else.
        </p>
        <H3 id="try-it">Try it</H3>
        <ExampleViewer id="dark-mode-preview" title="Light and dark preview" description="The same components under lightTheme and darkTheme. Only this preview switches, not the page." source={PREVIEW_SOURCE} file="DarkModePreview.tsx">
          <DarkModePreview />
        </ExampleViewer>
      </Section>

      <Section id="follow-system" title="Follow the system setting">
        <p>
          The simplest dark mode: follow <code>prefers-color-scheme</code>. With <code>noSsr</code>, MUI&apos;s{' '}
          <code>useMediaQuery</code> reads the setting on the first client render, so a client-rendered app (Vite)
          starts in the right theme.
        </p>
        <CodeBlock code={SYSTEM} title="providers.tsx" label="Follow the system setting" />
        <p>
          This is the same logic as the registry&apos;s <code>SorbetProvider</code> with <code>mode=&quot;system&quot;</code>{' '}
          (<A href="/docs/guides/ai#registry">AI and the registry</A>). With server rendering, the server cannot know
          the setting, so read on.
        </p>
      </Section>

      <Section id="toggle" title="A toggle that remembers">
        <p>
          Keep the mode in state, start from the saved choice or the OS setting, and save the choice when the visitor
          toggles. Until they toggle, keep following the OS.
        </p>
        <CodeBlock code={TOGGLE} title="app/providers.tsx" label="Color mode provider with a remembered toggle" />
        <CodeBlock code={TOGGLE_BUTTON} title="ThemeToggle.tsx" label="Theme toggle button" />
        <p>
          The button says what it will do, so its accessible name changes with the mode. Every storage call is in a{' '}
          <code>try</code>: storage can throw, and the toggle should still work for this visit.
        </p>
      </Section>

      <Section id="no-flash" title="Avoid a flash of the wrong theme">
        <p>
          A server-rendered or static page is built without knowing the visitor&apos;s mode. If you pick the theme in
          React, a dark-mode visitor sees the light page until JavaScript runs. Fix it in two parts:
        </p>
        <Steps>
          <li>
            <strong>Before first paint,</strong> a small inline script in <code>&lt;head&gt;</code> reads the saved choice
            (or the OS setting) and marks <code>&lt;html&gt;</code>. A matching CSS rule paints the dark background.
          </li>
          <li>
            <strong>During hydration,</strong> the provider renders light (to match the server HTML), then adopts the
            marked mode in a layout effect, which runs before the browser paints the hydrated page.
          </li>
        </Steps>

        <H3 id="how-this-site-does-it">How this site does it</H3>
        <p>
          This site is a static export, so it uses exactly this. <code>app/layout.tsx</code> holds the script and the
          CSS; <code>components/ColorMode.tsx</code> holds the provider. The storage key is{' '}
          <code>{COLOR_MODE_KEY}</code> (<code>COLOR_MODE_KEY</code> in <code>lib/site.ts</code>), shared by both.
        </p>
        <CodeBlock code={INIT} title="app/layout.tsx" label="Inline color mode script" />
        <CodeBlock code={ADOPT} title="components/ColorMode.tsx" label="Adopt the marked mode before paint" />
        <ul>
          <li>
            <code>suppressHydrationWarning</code> on <code>&lt;html&gt;</code> is needed because the script changes its
            attributes before React hydrates. It applies to that element only, not its children.
          </li>
          <li>
            The script sets <code>color-scheme</code> too, so scrollbars and form controls match from the first frame.
          </li>
          <li>
            The two dark colors in the CSS are the dark page and text tokens (<code>backgrounds.dark.default</code>,{' '}
            <code>textColors.dark.primary</code>); the real layout imports them from <code>@sorbet-ui/tokens</code>.
          </li>
        </ul>
        <Callout title="Using this in your app">
          Keep the storage key and the values (<code>&apos;light&apos;</code> / <code>&apos;dark&apos;</code>) identical in
          the script and the provider, and make the provider read the mark the script left on <code>&lt;html&gt;</code>.
        </Callout>
      </Section>

      <Section id="check-components" title="Check each component in dark mode">
        <p>
          Most Sorbet components pick their colors with{' '}
          <code>colorScaleForMode(color, theme.palette.mode === &apos;dark&apos;)</code>, because the light-theme shades
          are too dark to read on the dark page. (<code>Progress</code>, <code>Rating</code> and <code>Slider</code> use
          the same shades in both modes.) Do the same in your own components:
        </p>
        <CodeBlock code={OWN} title="Callout.tsx" label="A mode-aware component" />
        <p>Then check it in both modes:</p>
        <ul>
          <li>
            <strong>Storybook:</strong> set the Backgrounds toolbar to dark and the story renders with{' '}
            <code>darkTheme</code>.
          </li>
          <li>
            <strong>Unit tests:</strong> <code>packages/react/src/dark-mode.test.tsx</code> renders components in both
            modes and checks they use the scale for that mode.
          </li>
          <li>
            <strong>End to end:</strong> the site&apos;s Playwright suite runs axe on every docs page with{' '}
            <code>colorScheme: &apos;light&apos;</code> and <code>&apos;dark&apos;</code>.
          </li>
        </ul>
        <p>
          Watch for colors that do not come from the theme or the tokens: a hard-coded <code>#fff</code> card or a gray
          border looks fine in light mode and breaks in dark mode.
        </p>
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/guides/server-rendering', title: 'Server rendering', note: 'The provider in the App Router.' },
            { href: '/docs/customization/colors', title: 'Colors and tokens', note: 'The light and dark scales.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
