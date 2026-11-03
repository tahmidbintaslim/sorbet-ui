# @sorbet-ui/theme

Light and dark Material UI v7 themes built from the Sorbet UI design tokens. Use them with any MUI app, with or without `@sorbet-ui/react`.

```bash
npm i @sorbet-ui/theme @mui/material @emotion/react @emotion/styled
```

```tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '@sorbet-ui/theme';

<ThemeProvider theme={prefersDark ? darkTheme : lightTheme}>
  <CssBaseline />
  <App />
</ThemeProvider>;
```

Extend a theme with MUI's `createTheme(lightTheme, { ... })`. Importing the package also adds the Sorbet variants (`soft`, `ghost`, `plain`, ...) to MUI's TypeScript types.

Docs: https://sorbet-ui-web-tahmid-bin-taslim-rafis-projects.vercel.app/docs/theming · Source: https://github.com/tahmidbintaslim/sorbet-ui · MIT licensed.
