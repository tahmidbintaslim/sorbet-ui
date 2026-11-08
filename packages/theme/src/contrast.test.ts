import { getContrastRatio } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';
import { darkTheme, lightTheme } from './theme';

// Stock MUI components (Button contained/outlined/text, Chip, Alert, links) paint with
// these palette pairs, so they must reach WCAG AA (4.5:1) for the "wrap your existing
// MUI app" promise to hold in both themes.
const COLORS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

describe.each([
  ['lightTheme', lightTheme],
  ['darkTheme', darkTheme],
] as const)('%s palette', (_name, theme) => {
  it.each(COLORS)('%s: contrastText on main reaches 4.5:1', (key) => {
    const { main, contrastText } = theme.palette[key];
    expect(getContrastRatio(contrastText, main)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(COLORS)('%s: main as text on the page and on paper reaches 4.5:1', (key) => {
    const { main } = theme.palette[key];
    expect(getContrastRatio(main, theme.palette.background.default)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(main, theme.palette.background.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it('body and secondary text reach 4.5:1 on the page and on paper', () => {
    for (const text of [theme.palette.text.primary, theme.palette.text.secondary]) {
      expect(getContrastRatio(text, theme.palette.background.default)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(text, theme.palette.background.paper)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
