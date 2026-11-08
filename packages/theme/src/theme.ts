import { createTheme, ThemeOptions } from '@mui/material/styles';
import { colorScaleForMode, radiusScale, sorbetPalette, type SemanticColor } from '@sorbet-ui/tokens';
import { sorbetComponents } from './components';

// MUI palette entries come from the same AA-tested token scales the Sorbet components
// use (colorScaleForMode), so stock MUI Buttons, Chips and links get the same contrast
// guarantees. MUI's `secondary` maps to Sorbet's neutral scale; `error` to danger.
const PALETTE_KEYS: Record<'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info', SemanticColor> = {
  primary: 'primary',
  secondary: 'neutral',
  success: 'success',
  warning: 'warning',
  error: 'danger',
  info: 'info',
};

function semanticPalette(isDark: boolean) {
  return Object.fromEntries(
    Object.entries(PALETTE_KEYS).map(([key, color]) => {
      const scale = colorScaleForMode(color, isDark);
      return [key, { main: scale.main, dark: scale.dark, light: scale.light, contrastText: scale.contrastText }];
    })
  ) as Record<keyof typeof PALETTE_KEYS, { main: string; dark: string; light: string; contrastText: string }>;
}

const themeOptions: ThemeOptions = {
  palette: {
    ...semanticPalette(false),
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
    ...semanticPalette(true),
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
