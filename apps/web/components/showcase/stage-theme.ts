// The showcase stage has its own MUI theme, derived from the published Sorbet
// themes exactly the way the code line under the stage shows: one createTheme call
// that swaps the primary scale and the corner radius.
import { createTheme } from '@mui/material/styles';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';
import { colorPalette, colorScaleForMode } from '@sorbet-ui/tokens';
import type { Color } from '@/lib/site';

export type StageMode = 'light' | 'dark';
export type Density = 'compact' | 'comfortable';
export type StageSettings = { flavor: Color; radius: number; density: Density; mode: StageMode };

/** Accent choices: the six scoops plus neutral, by their shop names. */
export const FLAVORS: { id: Color; name: string }[] = [
  { id: 'danger', name: 'Raspberry' },
  { id: 'warning', name: 'Mango' },
  { id: 'success', name: 'Mint' },
  { id: 'primary', name: 'Sky' },
  { id: 'secondary', name: 'Violet' },
  { id: 'info', name: 'Cyan' },
  { id: 'neutral', name: 'Slate' },
];

export const DEFAULT_SETTINGS: Omit<StageSettings, 'mode'> = { flavor: 'danger', radius: 12, density: 'comfortable' };

const FONT = 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

/**
 * The stage theme. `palette.primary` is the flavor's token scale for the mode
 * (the same AA-checked main / contrastText pairs the Sorbet themes ship), so stock
 * MUI parts follow the accent; Sorbet components get the flavor as their `color`.
 */
export function stageTheme({ flavor, radius, mode }: StageSettings) {
  const scale = colorScaleForMode(flavor, mode === 'dark');
  return createTheme(mode === 'dark' ? darkTheme : lightTheme, {
    typography: { fontFamily: FONT },
    shape: { borderRadius: radius },
    palette: { primary: { main: scale.main, light: scale.light, dark: scale.dark, contrastText: scale.contrastText } },
    components: { MuiButton: { styleOverrides: { root: { textTransform: 'none' } } } },
  });
}

/** The source for the current settings: what a visitor would write to get this look. */
export function stageCode({ flavor, radius, density, mode }: StageSettings) {
  const base = mode === 'dark' ? 'darkTheme' : 'lightTheme';
  const scale = mode === 'dark' ? `darkModeColorPalette.${flavor}` : `colorPalette.${flavor}`;
  const size = density === 'compact' ? 'sm' : 'md';
  return [
    `const theme = createTheme(${base}, {`,
    `  palette: { primary: ${scale} },`,
    `  shape: { borderRadius: ${radius} },`,
    `});`,
    ``,
    `// Sorbet components take the same choices as props:`,
    `<Chip color="${flavor}" size="${size}" />`,
  ].join('\n');
}

/** Swatch fill for a flavor (decorative; the radio carries the name). */
export const swatch = (c: Color) => colorPalette[c][500];
