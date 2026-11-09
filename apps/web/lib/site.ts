// Site-wide constants and navigation.
export const SITE = {
  name: 'Sorbet UI',
  tagline: 'Make Material UI look modern, no rewrite',
  description:
    'A theme and component layer for Material UI v7 and v9. Wrap your app in one ThemeProvider and your existing MUI screens restyle, in light and dark.',
  github: 'https://github.com/tahmidbintaslim/sorbet-ui',
  storybook: 'https://sorbet-ui.vercel.app',
  npm: 'https://www.npmjs.com/package/@sorbet-ui/react',
} as const;

// localStorage key for the visitor's color mode (read before paint in app/layout.tsx).
export const COLOR_MODE_KEY = 'sorbet-color-mode';

export const VARIANTS = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
export const COLORS = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
] as const;
export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type Variant = (typeof VARIANTS)[number];
export type Color = (typeof COLORS)[number];
export type Size = (typeof SIZES)[number];
