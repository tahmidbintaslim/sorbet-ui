// Block categories, in display order. Blocks themselves are discovered from
// blocks/<category>/*.tsx by scripts/gen-blocks.mjs (see lib/blocks-meta.ts).
import { BLOCKS } from './blocks-meta';

export type CategoryGroup = 'Marketing' | 'Application';
export const CATEGORIES: { id: string; title: string; group: CategoryGroup; description: string }[] = [
  { id: 'navbar', title: 'Navbars', group: 'Marketing', description: 'Site headers with links and actions.' },
  { id: 'hero', title: 'Heroes', group: 'Marketing', description: 'First screens that say what you do.' },
  { id: 'features', title: 'Features', group: 'Marketing', description: 'Grids, tabs and lists of what you offer.' },
  { id: 'stats', title: 'Stats', group: 'Marketing', description: 'Numbers and progress at a glance.' },
  { id: 'pricing', title: 'Pricing', group: 'Marketing', description: 'Plans, toggles and comparison tables.' },
  { id: 'testimonials', title: 'Testimonials', group: 'Marketing', description: 'Quotes and reviews (sample content).' },
  { id: 'team', title: 'Team', group: 'Marketing', description: 'People, roles and links.' },
  { id: 'blog', title: 'Blog', group: 'Marketing', description: 'Post lists and article cards.' },
  { id: 'faq', title: 'FAQ', group: 'Marketing', description: 'Questions and answers.' },
  { id: 'contact', title: 'Contact', group: 'Marketing', description: 'Forms and ways to get in touch.' },
  { id: 'cta', title: 'Calls to action', group: 'Marketing', description: 'Banners and sign-up prompts.' },
  { id: 'footer', title: 'Footers', group: 'Marketing', description: 'Link columns, newsletters and legal.' },
  { id: 'auth', title: 'Authentication', group: 'Application', description: 'Sign in, sign up and password reset.' },
  { id: 'dashboard', title: 'Dashboard', group: 'Application', description: 'Stat cards, tables, feeds and layouts.' },
  { id: 'settings', title: 'Settings', group: 'Application', description: 'Profile, preferences and billing forms.' },
  { id: 'ecommerce', title: 'E-commerce', group: 'Application', description: 'Product cards and carts.' },
  { id: 'onboarding', title: 'Onboarding', group: 'Application', description: 'Steps, checklists and changelogs.' },
  { id: 'status', title: 'Status pages', group: 'Application', description: '404, maintenance and empty states.' },
];

export const blocksIn = (category: string) => BLOCKS.filter((b) => b.category === category);
export const categoriesWithBlocks = () => CATEGORIES.filter((c) => blocksIn(c.id).length > 0);
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
export { BLOCKS };
