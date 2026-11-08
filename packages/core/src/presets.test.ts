// Every text / background pair the variant presets return must reach WCAG AA (4.5:1)
// in its resting, hover and pressed state, on the page and on paper, in both modes.
// Translucent tints are flattened onto the surface first.
import { backgrounds } from '@sorbet-ui/tokens';
import { describe, expect, it } from 'vitest';
import { getVariantCss, getVariantStyles } from './presets';
import type { SorbetColor, SorbetVariant } from './types';

const VARIANTS: SorbetVariant[] = ['solid', 'soft', 'outlined', 'ghost', 'plain'];
const COLORS: SorbetColor[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'];
const STATES = [
  ['backgroundColor', 'color'],
  ['hoverBackgroundColor', 'hoverColor'],
  ['activeBackgroundColor', 'activeColor'],
] as const;

type RGB = [number, number, number];
const hexToRgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;

/** Resolves a hex, rgba() or 'transparent' value painted over `under`. */
function paint(value: string, under: RGB): RGB {
  if (value === 'transparent') return under;
  if (value.startsWith('#')) return hexToRgb(value);
  const m = value.match(/^rgba?\(([^)]+)\)$/);
  if (!m) throw new Error(`unsupported color ${value}`);
  const [r, g, b, a = 1] = m[1].split(',').map(Number);
  return [r, g, b].map((c, i) => c * a + under[i] * (1 - a)) as RGB;
}

const luminance = (rgb: RGB) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe.each([false, true])('getVariantStyles (dark: %s)', (isDark) => {
  const mode = isDark ? backgrounds.dark : backgrounds.light;
  const surfaces = [...new Set([mode.default, mode.paper])];
  describe.each(VARIANTS)('%s', (variant) => {
    it.each(COLORS)('%s: text reaches 4.5:1 at rest, on hover and when pressed', (color) => {
      const styles = getVariantStyles(variant, color, isDark);
      for (const surface of surfaces) {
        for (const [bgKey, fgKey] of STATES) {
          const bg = paint(styles[bgKey], hexToRgb(surface));
          const ratio = contrast(paint(styles[fgKey], bg), bg);
          expect(ratio, `${fgKey} on ${bgKey} over ${surface}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });
  });
});

it('getVariantCss uses the same colors as getVariantStyles', () => {
  const styles = getVariantStyles('ghost', 'danger', true);
  const css = getVariantCss('ghost', 'danger', true);
  expect(css.color).toBe(styles.color);
  expect(css['&:hover:not(:disabled)'].color).toBe(styles.hoverColor);
  expect(css['&:active:not(:disabled)'].backgroundColor).toBe(styles.activeBackgroundColor);
});
