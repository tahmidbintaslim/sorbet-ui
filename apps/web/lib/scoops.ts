// Sorbet scoops: the site's playful accents, every one a @sorbet-ui/tokens shade.
// Each role is a CSS variable set per mode (html[data-mode]), so colors are right
// from the first paint, before the MUI theme switches during hydration.
// The text pairs are checked in packages/tokens/src/contrast.test.ts ("site scoops").
import { colorPalette, DARK_INK } from '@sorbet-ui/tokens';

/** Scoop flavors in display order: raspberry, mango, mint, sky, violet, cyan. */
export const SCOOPS = ['danger', 'warning', 'success', 'primary', 'secondary', 'info'] as const;
export type Scoop = (typeof SCOOPS)[number];

/** The n-th scoop, cycling. */
export const scoopAt = (i: number): Scoop => SCOOPS[((i % SCOOPS.length) + SCOOPS.length) % SCOOPS.length];

type Role = 'ink' | 'pastel' | 'candy' | 'tint' | 'fill' | 'glow' | 'pill';

// light / dark values for each role.
const ROLES: Record<Role, (s: Scoop) => [string, string]> = {
  // Text in the scoop's color: 700 on light surfaces, 300 on the night page.
  ink: (s) => [colorPalette[s][700], colorPalette[s][300]],
  // Soft sticker / pill background that keeps `ink` readable.
  pastel: (s) => [colorPalette[s][100], colorPalette[s].alpha20],
  // Candy chip background; text on it is DARK_INK in both modes.
  candy: (s) => [colorPalette[s][200], colorPalette[s][300]],
  // Section wash.
  tint: (s) => [colorPalette[s][50], colorPalette[s].alpha8],
  // Illustration fills.
  fill: (s) => [colorPalette[s][300], colorPalette[s][400]],
  // Blurred background blobs.
  glow: (s) => [colorPalette[s][200], colorPalette[s][500]],
  // Text on `pastel` for nav pills: 800 on light, 200 on dark.
  pill: (s) => [colorPalette[s][800], colorPalette[s][200]],
};

/** CSS variable for a scoop role, e.g. scoop('danger', 'ink'). */
export const scoop = (s: Scoop, role: Role) => `var(--scoop-${s}-${role})`;

export const CANDY_TEXT = DARK_INK;

const vars = (mode: 0 | 1) =>
  Object.fromEntries(
    SCOOPS.flatMap((s) => (Object.keys(ROLES) as Role[]).map((r) => [`--scoop-${s}-${r}`, ROLES[r](s)[mode]])),
  );

/** Global styles: declare the variables for both modes. */
export const scoopVars = {
  ':root': vars(0),
  'html[data-mode="dark"]': vars(1),
};

/** Selector for dark-mode overrides inside sx (works before hydration). */
export const DARK = '[data-mode="dark"] &';

/** Turn infinite CSS loops off for visitors who ask for less motion. */
export const NO_MOTION = { '@media (prefers-reduced-motion: reduce)': { animation: 'none' } } as const;
