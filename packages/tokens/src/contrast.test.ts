import { describe, expect, it } from 'vitest';

import {
  backgrounds,
  colorPalette,
  colorScaleForMode,
  darkModeColorPalette,
  DARK_INK,
  textColors,
  textColorsForMode,
  type ColorScale,
  type SemanticColor,
  solidActiveShade,
} from './colors';
import { sorbetPalette } from './palette';

// WCAG 2.x relative luminance and contrast ratio.
// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
type Rgb = [number, number, number];

const WHITE = '#ffffff';
/** WCAG 2.1 AA minimum for normal-size text (1.4.3). */
const AA_TEXT = 4.5;

function parseColor(value: string): { rgb: Rgb; alpha: number } {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = hex[1];
    return {
      rgb: [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)) as Rgb,
      alpha: 1,
    };
  }
  const rgba = value.match(/^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)$/);
  if (rgba) {
    return {
      rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])],
      alpha: Number(rgba[4]),
    };
  }
  throw new Error(`Unsupported color format: ${value}`);
}

/** Composites a possibly translucent color over an opaque backdrop. */
function flatten(value: string, backdrop: Rgb): Rgb {
  const { rgb, alpha } = parseColor(value);
  return rgb.map((c, i) => c * alpha + backdrop[i] * (1 - alpha)) as Rgb;
}

function luminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast of text on a background, both composited over the page color. */
function contrast(foreground: string, background: string, page = WHITE): number {
  const bg = flatten(background, parseColor(page).rgb);
  const fg = flatten(foreground, bg);
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const semanticColors = Object.keys(colorPalette) as SemanticColor[];

describe('contrast helper', () => {
  it('matches known WCAG values', () => {
    expect(contrast('#000000', WHITE)).toBeCloseTo(21, 5);
    expect(contrast('#ffffff', WHITE)).toBeCloseTo(1, 5);
    // The audited failure this suite guards against: white on the old primary main.
    expect(contrast('#ffffff', '#0ea5e9')).toBeCloseTo(2.77, 2);
  });
});

// These pairs cover the light theme (white page). No single shade reaches 4.5:1 on
// both white and near-black, so dark mode uses its own scale (tested below).
describe.each(semanticColors)('%s tokens on a white page (WCAG AA text)', (name) => {
  const scale: ColorScale = colorPalette[name];

  it('solid: contrastText on main', () => {
    expect(contrast(scale.contrastText, scale.main)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('solid hover: contrastText on dark', () => {
    expect(contrast(scale.contrastText, scale.dark)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('outlined, plain and link: main on white', () => {
    expect(contrast(scale.main, WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('outlined and ghost hover: dark on the alpha8 tint', () => {
    expect(contrast(scale.dark, scale.alpha8)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('outlined and link hover: dark on white', () => {
    expect(contrast(scale.dark, WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('soft: dark on the alpha12 tint, and on the alpha20 hover tint', () => {
    expect(contrast(scale.dark, scale.alpha12)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(scale.dark, scale.alpha20)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

// Dark mode. Components switch to darkModeColorPalette through colorScaleForMode.
// Known gaps, not asserted here: solid fills (white on most 500 shades is below
// 4.5:1), neutral `main` as text (3.75:1 on the page), and `main` as text on the
// lighter paper surface for secondary, danger and neutral.
const DARK_PAGE = backgrounds.dark.default;
const DARK_PAPER = backgrounds.dark.paper;

describe('colorScaleForMode', () => {
  it.each(semanticColors)('returns the light-theme scale for %s outside dark mode', (name) => {
    expect(colorScaleForMode(name, false)).toBe(colorPalette[name]);
  });

  it.each(semanticColors)('returns the dark-mode scale for %s in dark mode', (name) => {
    expect(colorScaleForMode(name, true)).toBe(darkModeColorPalette[name]);
  });
});

describe('textColorsForMode', () => {
  it('returns the light text colors outside dark mode and the dark ones in dark mode', () => {
    expect(textColorsForMode(false)).toBe(textColors.light);
    expect(textColorsForMode(true)).toBe(textColors.dark);
  });

  // Checkbox, Radio and Switch labels use `primary`; unselected ToggleButton text and
  // the Slider min/max labels use `secondary`.
  it.each(['primary', 'secondary'] as const)(
    'dark %s text reaches 4.5:1 on the dark page and on paper',
    (role) => {
      const color = textColorsForMode(true)[role];
      expect(contrast(color, DARK_PAGE, DARK_PAGE)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(color, DARK_PAPER, DARK_PAPER)).toBeGreaterThanOrEqual(AA_TEXT);
    }
  );
});

describe.each(semanticColors)('%s tokens on a dark page', (name) => {
  const scale: ColorScale = darkModeColorPalette[name];

  it('outlined borders and icons: main reaches 3:1 on the page and on paper', () => {
    expect(contrast(scale.main, DARK_PAGE, DARK_PAGE)).toBeGreaterThanOrEqual(3);
    expect(contrast(scale.main, DARK_PAPER, DARK_PAPER)).toBeGreaterThanOrEqual(3);
  });

  it('soft: light on the alpha20 tint', () => {
    expect(contrast(scale.light, scale.alpha20, DARK_PAGE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('solid: contrastText on main', () => {
    expect(contrast(scale.contrastText, scale.main)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('solid hover: contrastText on dark', () => {
    expect(contrast(scale.contrastText, scale.dark)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('solid active: contrastText on the pressed shade', () => {
    expect(contrast(scale.contrastText, solidActiveShade(scale))).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('outlined and ghost hover: dark on the alpha8 tint, on the page and on paper', () => {
    expect(contrast(scale.dark, scale.alpha8, DARK_PAGE)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(scale.dark, scale.alpha8, DARK_PAPER)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('is lighter than the light-theme main, so text on dark surfaces gains contrast', () => {
    expect(contrast(scale.main, DARK_PAGE, DARK_PAGE)).toBeGreaterThanOrEqual(
      contrast(colorPalette[name].main, DARK_PAGE, DARK_PAGE)
    );
  });
});

// Outlined, dash, plain and link variants use `main` as text on the page and on cards.
describe.each(semanticColors)('%s main as text on dark surfaces (WCAG AA text)', (name) => {
  it('reaches 4.5:1 on the page and on paper', () => {
    expect(contrast(darkModeColorPalette[name].main, DARK_PAGE, DARK_PAGE)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(darkModeColorPalette[name].main, DARK_PAPER, DARK_PAPER)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

// darkTheme in @sorbet-ui/theme sets MUI's primary, success, warning and error `main`
// to these 500 shades.
describe.each(['primary', 'success', 'warning', 'danger'] as const)(
  'MUI dark theme palette %s on the dark default background',
  (name) => {
    it('500 shade reaches 4.5:1', () => {
      const page = sorbetPalette.neutral[900];
      expect(contrast(sorbetPalette[name][500], page, page)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
);

// sorbetPalette feeds the MUI theme (lightTheme/darkTheme), where MUI uses `main` as
// text for outlined and text buttons, links and focused labels.
describe.each(Object.keys(sorbetPalette) as (keyof typeof sorbetPalette)[])(
  'MUI theme palette %s on a white page',
  (name) => {
    it('main on white', () => {
      expect(contrast(sorbetPalette[name].main, WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
);

// lightTheme in @sorbet-ui/theme uses neutral 600 for secondary text. It must stay readable on
// cards tinted with any soft color (alpha12 of the 500 shade over white).
describe.each(semanticColors)('secondary text on the %s soft tint (light)', (name) => {
  it('reaches 4.5:1', () => {
    expect(contrast(sorbetPalette.neutral[600], colorPalette[name].alpha12, WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

// ---------------------------------------------------------------------------
// Accordion, Menu and Stepper (packages/react). These components put colored text
// on translucent tints, sometimes stacked (a hovered item on a tinted menu), so the
// helper below composites each layer in order over the surface.
// ---------------------------------------------------------------------------

/** Contrast of text over translucent layers stacked bottom-first on a surface. */
function contrastOnLayers(foreground: string, layers: string[], surface: string): number {
  let backdrop = parseColor(surface).rgb;
  for (const layer of layers) backdrop = flatten(layer, backdrop);
  const fg = flatten(foreground, backdrop);
  const [hi, lo] = [luminance(fg), luminance(backdrop)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const DARK_SURFACES = { page: DARK_PAGE, paper: DARK_PAPER } as const;

describe.each(semanticColors)('%s accordion, menu and stepper pairs (light)', (name) => {
  const scale = colorPalette[name];
  const neutral = colorPalette.neutral;

  // Outlined and ghost Accordion summaries and outlined Menu items: the hover and
  // expanded/selected tint under `dark` text.
  it('dark on the alpha8 tint', () => {
    expect(contrast(scale.dark, scale.alpha8)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  // Soft Menu: a hovered or selected item adds a second alpha12 layer on the tinted paper.
  it('dark and body text on an alpha12 item over the alpha12 paper', () => {
    expect(contrastOnLayers(scale.dark, [scale.alpha12, scale.alpha12], WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(
      contrastOnLayers(textColors.light.primary, [scale.alpha12, scale.alpha12], WHITE)
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });

  // Soft Accordion details: body text on the tinted panel.
  it('body text on the alpha12 tint', () => {
    expect(contrast(textColors.light.primary, scale.alpha12)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  // Ghost Menu: a selected item that is also hovered sits on neutral 100.
  it('dark on the neutral 100 hover', () => {
    expect(contrast(scale.dark, neutral[100])).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

describe.each(semanticColors)('%s accordion, menu and stepper pairs (dark)', (name) => {
  const scale = darkModeColorPalette[name];
  const neutral = colorPalette.neutral;

  describe.each(Object.entries(DARK_SURFACES))('on the %s', (_surface, surface) => {
    // Outlined and ghost Accordion summaries and outlined Menu items.
    it('light on the alpha12 tint', () => {
      expect(contrast(scale.light, scale.alpha12, surface)).toBeGreaterThanOrEqual(AA_TEXT);
    });

    // Soft Accordion, soft Menu and soft Stepper indicators sit on cards as well as the page.
    it('light, body and secondary text on the alpha20 tint', () => {
      expect(contrast(scale.light, scale.alpha20, surface)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(textColors.dark.primary, scale.alpha20, surface)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(textColors.dark.secondary, scale.alpha20, surface)).toBeGreaterThanOrEqual(AA_TEXT);
    });

    // Soft Menu: a hovered or selected item adds a second alpha20 layer.
    it('light and body text on an alpha20 item over the alpha20 paper', () => {
      expect(contrastOnLayers(scale.light, [scale.alpha20, scale.alpha20], surface)).toBeGreaterThanOrEqual(
        AA_TEXT
      );
      expect(
        contrastOnLayers(textColors.dark.primary, [scale.alpha20, scale.alpha20], surface)
      ).toBeGreaterThanOrEqual(AA_TEXT);
    });

    // Outlined, ghost and plain Accordion summaries use `light` as text on the surface.
    it('light on the surface', () => {
      expect(contrast(scale.light, surface, surface)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  });

  // Ghost Menu: a selected item that is also hovered sits on neutral 700.
  it('light on the neutral 700 hover', () => {
    expect(contrast(scale.light, neutral[700])).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

// Site scoops (apps/web/lib/scoops.ts): the website's per-scoop accents.
// ink = 700 (light) / 300 (dark), pill = 800 / 200, pastel = 100 / alpha20,
// candy = 200 / 300 under DARK_INK, tint = 50 / alpha8, glow blobs = 200 / 500.
describe('site scoops', () => {
  const SCOOPS = ['danger', 'warning', 'success', 'primary', 'secondary', 'info'] as const;
  const AA_LARGE = 3;
  const DARK_PAGE = backgrounds.dark.default;
  const toHex = (rgb: Rgb) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
  const rgba = (hex: string, a: number) => {
    const [r, g, b] = parseColor(hex).rgb;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  // Opaque color of a translucent layer over a backdrop.
  const over = (value: string, backdrop: string) => toHex(flatten(value, parseColor(backdrop).rgb));
  const lightTints = SCOOPS.map((s) => colorPalette[s][50]);
  const darkTints = SCOOPS.map((s) => over(colorPalette[s].alpha8, DARK_PAGE));

  describe.each(SCOOPS)('%s', (name) => {
    const s = colorPalette[name];

    it('light: ink on white, on every scoop tint and on its pastel sticker', () => {
      for (const bg of [WHITE, ...lightTints, s[100]]) expect(contrast(s[700], bg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it('light: pill text on its pastel', () => {
      expect(contrast(s[800], s[100])).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it('light: hero ink stays large-text readable over any glow blob (200 at 70%) on the hero tints', () => {
      for (const tint of lightTints)
        for (const g of SCOOPS) expect(contrast(s[700], rgba(colorPalette[g][200], 0.7), tint)).toBeGreaterThanOrEqual(AA_LARGE);
    });
    it('both: dark ink on the candy chip', () => {
      expect(contrast(DARK_INK, s[200])).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(DARK_INK, s[300])).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it('dark: ink on the page, on every scoop tint and on its pastel sticker', () => {
      for (const bg of [DARK_PAGE, ...darkTints, over(s.alpha20, DARK_PAGE)]) expect(contrast(s[300], bg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it('dark: pill text on its pastel', () => {
      expect(contrast(s[200], over(s.alpha20, DARK_PAGE))).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it('dark: hero ink over any glow blob (500 at 28%) on the hero tints', () => {
      for (const tint of darkTints)
        for (const g of SCOOPS) expect(contrast(s[300], rgba(colorPalette[g][500], 0.28), tint)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  });

  it('secondary text on every scoop tint, both modes', () => {
    for (const bg of lightTints) expect(contrast(textColors.light.secondary, bg)).toBeGreaterThanOrEqual(AA_TEXT);
    for (const bg of darkTints) expect(contrast(textColors.dark.secondary, bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  // Section pages: header bands, drawers, menu cards and sticker badges.
  const DARK_PAPER = backgrounds.dark.paper;
  const darkPaperTints = SCOOPS.map((s) => over(colorPalette[s].alpha8, DARK_PAPER));

  it('page header band: title text on every scoop tint, both modes', () => {
    for (const bg of lightTints) expect(contrast(textColors.light.primary, bg)).toBeGreaterThanOrEqual(AA_TEXT);
    for (const bg of darkTints) expect(contrast(textColors.dark.primary, bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('dark: text on a scoop tint over a paper surface (demo sidebar note)', () => {
    for (const bg of darkPaperTints) {
      expect(contrast(textColors.dark.primary, bg)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(textColors.dark.secondary, bg)).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  describe.each(SCOOPS)('%s on section pages', (name) => {
    const s = colorPalette[name];

    it('dark: current-page pill and sticker ink on their pastel over a paper surface (drawers, menu cards)', () => {
      const pastel = over(s.alpha20, DARK_PAPER);
      expect(contrast(s[200], pastel)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(s[300], pastel)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it('dark: sticker ink on its pastel over any header band tint', () => {
      for (const tint of darkTints) expect(contrast(s[300], over(s.alpha20, tint))).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it('dark: ink on a scoop tint over a paper surface', () => {
      for (const bg of darkPaperTints) expect(contrast(s[300], bg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  });
});

// Neutral fills for inactive Stepper indicators and disabled Accordion summaries.
describe('neutral indicator fills', () => {
  const n = colorPalette.neutral;
  it.each([
    ['neutral 700 on neutral 200 (solid, light)', n[700], n[200]],
    ['neutral 600 on neutral 100 (soft and disabled, light)', n[600], n[100]],
    ['neutral 200 on neutral 700 (solid, soft and disabled, dark)', n[200], n[700]],
  ])('%s reaches 4.5:1', (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
