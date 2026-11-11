import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Typography } from '@mui/material';
import CodeBlock from '@/components/CodeBlock';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';

export const metadata: Metadata = pageMeta({
  title: 'Theming',
  description: 'Light and dark themes, design tokens, and how to customize the Sorbet UI theme for Material UI.',
  path: '/docs/theming',
});

const MODE = `import { useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '@sorbet-ui/theme';

export function App() {
  const [dark, setDark] = useState(false);
  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      {/* ... */}
    </ThemeProvider>
  );
}`;

const TOKENS = `import { createTheme } from '@sorbet-ui/theme';
import { lightTheme } from '@sorbet-ui/theme';

// Extend the Sorbet theme like any MUI theme.
const theme = createTheme(lightTheme, {
  shape: { borderRadius: 12 },
});`;

export default function Theming() {
  return (
    <>
      <PageHeader flavor={SECTION_FLAVOR.theming} doodle="jar" aside="your recipe" title="Theming">
        <code>@sorbet-ui/theme</code> exports <code>lightTheme</code> and <code>darkTheme</code>,
        ordinary Material UI themes built from the <code>@sorbet-ui/tokens</code> design tokens.
      </PageHeader>

      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
        Light and dark
      </Typography>
      <CodeBlock code={MODE} label="Switching themes" />
      <Typography color="text.secondary">
        This site follows your OS setting until you use the toggle in the header, then remembers
        your choice.
      </Typography>

      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
        Customizing
      </Typography>
      <CodeBlock code={TOKENS} label="Extending the theme" />
    </>
  );
}
