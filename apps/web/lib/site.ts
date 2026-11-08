// Site-wide constants and navigation.
export const SITE = {
  name: 'Sorbet UI',
  tagline: 'Material UI, but softer',
  description:
    'React components on Material UI v7 or v9 with one variant, color and size API, plus light and dark themes.',
  github: 'https://github.com/tahmidbintaslim/sorbet-ui',
  storybook: 'https://sorbet-ui.vercel.app',
  npm: 'https://www.npmjs.com/package/@sorbet-ui/react',
} as const;

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
