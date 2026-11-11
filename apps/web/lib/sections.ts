// One flavor per top-level section, used by the nav pill, the page header band
// and the accents on that section's pages.
import type { Scoop } from './scoops';

export const SECTION_FLAVOR = {
  docs: 'success', // mint
  components: 'primary', // sky
  theming: 'warning', // mango
  blocks: 'danger', // raspberry
  templates: 'secondary', // violet
  demo: 'info', // cyan
} as const satisfies Record<string, Scoop>;

export type Section = keyof typeof SECTION_FLAVOR;

/** Section a pathname belongs to, if any (the home page and 404 have none). */
export function sectionOf(pathname: string): Section | undefined {
  if (pathname.startsWith('/docs/components')) return 'components';
  if (pathname.startsWith('/docs/theming')) return 'theming';
  if (pathname.startsWith('/docs')) return 'docs';
  if (pathname.startsWith('/blocks')) return 'blocks';
  if (pathname.startsWith('/templates')) return 'templates';
  if (pathname.startsWith('/demo')) return 'demo';
  return undefined;
}

export const flavorOf = (pathname: string): Scoop | undefined => {
  const s = sectionOf(pathname);
  return s && SECTION_FLAVOR[s];
};
