import type { Metadata } from 'next';
import { Typography } from '@mui/material';
import CodeBlock from '@/components/CodeBlock';

export const metadata: Metadata = { title: 'Getting started' };

const INSTALL = `npm install @sorbet-ui/react @sorbet-ui/theme \\
  @mui/material @mui/icons-material @mui/x-date-pickers \\
  @emotion/react @emotion/styled dayjs react react-dom`;

const VITE = `// src/main.tsx
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';
import { Button } from '@sorbet-ui/react';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <Button variant="solid">Click</Button>
  </ThemeProvider>,
);`;

const NEXT_PROVIDERS = `// app/Providers.tsx
'use client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { lightTheme } from '@sorbet-ui/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}`;

const NEXT_PAGE = `// app/page.tsx (a Server Component)
import { Button } from '@sorbet-ui/react';

export default function Page() {
  return <Button variant="soft">Works in a Server Component</Button>;
}`;

export default function GettingStarted() {
  return (
    <>
      <Typography component="h1" variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Getting started
      </Typography>
      <Typography color="text.secondary">
        Sorbet UI wraps Material UI v7. Install the packages and peer dependencies, then wrap your
        app in a Sorbet theme.
      </Typography>

      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
        Install
      </Typography>
      <CodeBlock code={INSTALL} title="Terminal" label="Install command" />
      <Typography variant="body2" color="text.secondary">
        <code>@sorbet-ui/react</code> needs React 19. <code>@sorbet-ui/core</code> and{' '}
        <code>@sorbet-ui/tokens</code> install automatically.
      </Typography>

      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
        Vite
      </Typography>
      <CodeBlock code={VITE} label="Vite setup" />

      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
        Next.js App Router
      </Typography>
      <Typography color="text.secondary">
        A theme object contains functions, so it cannot be passed from a Server Component into{' '}
        <code>ThemeProvider</code>. Put the provider in a <code>&apos;use client&apos;</code>{' '}
        file and wrap your layout with it. Sorbet components ship with a{' '}
        <code>&quot;use client&quot;</code> banner, so you can import them directly from Server
        Components.
      </Typography>
      <CodeBlock code={NEXT_PROVIDERS} label="Next.js providers" />
      <CodeBlock code={NEXT_PAGE} label="Next.js page" />

      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
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
