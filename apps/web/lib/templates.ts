// Free templates: full pages assembled from blocks. Each has a live preview at
// /templates/<slug> and the page source shown on the template page.
import { BLOCKS } from './blocks-source';

export type Template = { slug: string; name: string; description: string; blocks: string[]; tags: string[] };

export const TEMPLATES: Template[] = [
  {
    slug: 'saas-landing',
    name: 'SaaS landing',
    description: 'A full marketing page: hero, bento features, stats, pricing with a billing toggle, testimonials, FAQ and footer.',
    tags: ['Marketing', 'Pricing'],
    blocks: ['NavbarWithMenu', 'HeroGradient', 'FeatureBento', 'StatsRow', 'PricingTiers', 'TestimonialGrid', 'FaqAccordion', 'CtaCentered', 'FooterColumns'],
  },
  {
    slug: 'product-launch',
    name: 'Product launch',
    description: 'A waitlist page for a new product: minimal hero with email capture, three steps, a featured quote and a newsletter footer.',
    tags: ['Marketing', 'Waitlist'],
    blocks: ['NavbarCentered', 'HeroMinimal', 'FeatureSteps', 'FeatureList', 'TestimonialFeatured', 'CtaNewsletter', 'FooterNewsletter'],
  },
  {
    slug: 'developer-tool',
    name: 'Developer tool',
    description: 'For APIs and SDKs: code-first hero, feature grid, comparison table, changelog and a simple footer.',
    tags: ['Marketing', 'Docs'],
    blocks: ['NavbarSimple', 'HeroCode', 'FeatureGrid', 'PricingCompare', 'Changelog', 'CtaSplit', 'FooterSimple'],
  },
  {
    slug: 'store',
    name: 'Online store',
    description: 'A small shop: product grid, cart summary, ratings and a contact section.',
    tags: ['E-commerce'],
    blocks: ['NavbarSimple', 'ProductGrid', 'CartSummary', 'TestimonialRating', 'ContactCards', 'FooterColumns'],
  },
  {
    slug: 'auth',
    name: 'Auth pages',
    description: 'Sign in, sign up and password reset, with validation and success states.',
    tags: ['Application'],
    blocks: ['AuthSignIn', 'AuthSignUp', 'AuthReset'],
  },
  {
    slug: 'workspace',
    name: 'Workspace app',
    description: 'App screens: shell with sidebar, KPI cards, orders table, tasks, settings and an empty state.',
    tags: ['Application', 'Dashboard'],
    blocks: ['DashboardShell', 'DashboardStats', 'DashboardTable', 'DashboardTasks', 'SettingsProfile', 'EmptyState'],
  },
];

export const getTemplate = (slug: string) => TEMPLATES.find((t) => t.slug === slug);

/** The page file a developer would paste: imports each block and stacks them. */
export function templateSource(t: Template): string {
  const meta = t.blocks.map((id) => BLOCKS.find((b) => b.id === id)!);
  return [
    `// app/page.tsx: ${t.name} template. Copy each block from /blocks into ./blocks.`,
    ...meta.map((b) => `import ${b.id} from './blocks/${b.category}/${b.id}';`),
    '',
    'export default function Page() {',
    '  return (',
    '    <>',
    ...meta.map((b) => `      <${b.id} />`),
    '    </>',
    '  );',
    '}',
  ].join('\n');
}
