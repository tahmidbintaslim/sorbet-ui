import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import LinkButton from '@/components/LinkButton';
import CodeBlock from '@/components/CodeBlock';
import Showcase from '@/components/Showcase';
import { SITE } from '@/lib/site';

const FEATURES = [
  {
    title: 'One variant API',
    body: 'solid, soft, outlined, ghost and plain on every component, with the same color and size props everywhere.',
  },
  {
    title: 'Still Material UI',
    body: 'Each component wraps its MUI v7 counterpart, so MUI props, the sx prop and your theme keep working.',
  },
  {
    title: 'Light and dark',
    body: 'lightTheme and darkTheme for the MUI ThemeProvider, built from shared design tokens.',
  },
  {
    title: 'Typed and tree-shakeable',
    body: 'Strict TypeScript with exported prop types, ESM and CJS builds, and no side effects.',
  },
];

const QUICK = `import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@sorbet-ui/theme';
import { Button } from '@sorbet-ui/react';

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Button variant="soft" color="primary">Hello</Button>
    </ThemeProvider>
  );
}`;

export default function Home() {
  return (
    <>
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: 6 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="h1" variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {SITE.tagline}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, fontWeight: 400 }}>
              {SITE.description}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }} flexWrap="wrap" useFlexGap>
              <LinkButton href="/docs" variant="contained" size="large">
                Get started
              </LinkButton>
              <LinkButton href="/docs/components" variant="outlined" size="large">
                Browse components
              </LinkButton>
            </Stack>
            <CodeBlock code="npm install @sorbet-ui/react @sorbet-ui/theme @mui/material @emotion/react @emotion/styled" label="Install command" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Showcase />
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Why Sorbet UI
        </Typography>
        <Grid container spacing={3}>
          {FEATURES.map((f) => (
            <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3, height: '100%' }}>
                <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography component="h2" variant="h4" sx={{ fontWeight: 700 }}>
          Up and running in a minute
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Wrap your app in a Material UI ThemeProvider with a Sorbet theme, then import components.
        </Typography>
        <CodeBlock code={QUICK} label="Quick start example" />
        <LinkButton href="/docs" variant="text">
          Full setup guide for Vite and Next.js
        </LinkButton>
      </Container>
    </>
  );
}
