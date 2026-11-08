import { createTheme, ThemeOptions } from '@mui/material/styles';
import { DARK_INK, radiusScale, sorbetPalette } from '@sorbet-ui/tokens';
import { sorbetComponents } from './components';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: sorbetPalette.primary.main,
      dark: sorbetPalette.primary.dark,
      light: sorbetPalette.primary.light,
    },
    secondary: {
      main: sorbetPalette.neutral.main,
    },
    success: {
      main: sorbetPalette.success.main,
    },
    warning: {
      main: sorbetPalette.warning.main,
    },
    error: {
      main: sorbetPalette.danger.main,
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: sorbetPalette.neutral[900],
      // gray-600: 7.6:1 on white and 6.7:1+ on the soft color tints (gray-500 dips below 4.5:1 there).
      secondary: sorbetPalette.neutral[600],
    },
  },
  shape: {
    borderRadius: radiusScale.md,
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  // Restyle stock @mui/material components, so an existing MUI app changes look
  // by wrapping it in this theme, with no other code changes.
  components: sorbetComponents,
};

export const lightTheme = createTheme(themeOptions);

// The light-theme `main` shades are too dark to read as text on dark surfaces (MUI
// uses `main` for outlined and text buttons, links and focused labels), so dark
// mode uses the lighter 500 shades.
export const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    ...themeOptions.palette,
    mode: 'dark',
    // Dark ink on the bright 500 fills: white on them is below 4.5:1.
    primary: {
      main: sorbetPalette.primary[500],
      dark: sorbetPalette.primary[400],
      light: sorbetPalette.primary.light,
      contrastText: DARK_INK,
    },
    success: {
      main: sorbetPalette.success[500],
      contrastText: DARK_INK,
    },
    warning: {
      main: sorbetPalette.warning[500],
      contrastText: DARK_INK,
    },
    error: {
      main: sorbetPalette.danger[500],
      contrastText: DARK_INK,
    },
    background: {
      default: sorbetPalette.neutral[900],
      paper: sorbetPalette.neutral[800],
    },
    text: {
      primary: sorbetPalette.neutral[50],
      secondary: sorbetPalette.neutral[400],
    },
  },
});

export { createTheme };
