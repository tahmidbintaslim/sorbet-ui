// Free templates: complete, working pages and apps. Each lives in
// templates/<slug>/ as plain source (an index.tsx plus a data file or two), has a
// live preview at /templates/<slug>, a chrome-less one at /templates/<slug>/preview,
// and its real files on the Code tab (see scripts/gen-templates.mjs).
// This module is metadata only, so it is safe in client code, the sitemap and tests.

export type TemplateType = 'Application' | 'Marketing' | 'E-commerce';

export type Template = {
  slug: string;
  name: string;
  /** One line for cards and meta descriptions. */
  description: string;
  type: TemplateType;
  tags: string[];
  /** What you get, shown on the template page. */
  features: string[];
  /** Slugs from lib/catalog.ts: the Sorbet components the template uses. */
  components: string[];
  /** App templates fill their frame; page templates scroll inside it. */
  layout: 'app' | 'page';
};

export const TEMPLATES: Template[] = [
  {
    slug: 'analytics-dashboard',
    name: 'Analytics dashboard',
    description: 'A store analytics app: KPI cards, a revenue chart with a hover tooltip, a sortable orders table and a customer list.',
    type: 'Application',
    tags: ['Dashboard', 'Charts', 'Tables'],
    layout: 'app',
    features: [
      'Sidebar navigation that becomes a drawer on narrow screens',
      'KPI cards with trends, tied to a 7 / 30 / 90 day range switch',
      'Hand-written SVG area chart with crosshair, tooltip and keyboard support',
      'Sortable, filterable orders table with pagination and an order dialog',
      'New order form with validation, toasts and an activity feed',
    ],
    components: ['button', 'card', 'chip', 'tabs', 'table', 'pagination', 'dialog', 'drawer', 'text-field', 'select', 'avatar-badge', 'progress', 'snackbar', 'skeleton'],
  },
  {
    slug: 'inbox',
    name: 'Inbox',
    description: 'A three-pane mail client: folders, a searchable message list with unread state, and a reading pane with replies.',
    type: 'Application',
    tags: ['Mail', 'Three-pane', 'Search'],
    layout: 'app',
    features: [
      'Folders with live unread counts, labels and a compose dialog',
      'Search plus All / Unread / Starred filters, with an empty state',
      'Reading pane with star, archive, delete and mark-unread actions',
      'Reply box that appends to the thread and confirms with a toast',
      'Collapses to list, then detail, when the container is phone sized',
    ],
    components: ['button', 'chip', 'avatar-badge', 'text-field', 'dialog', 'drawer', 'tooltip', 'snackbar', 'tabs'],
  },
  {
    slug: 'kanban',
    name: 'Kanban board',
    description: 'A project board with draggable cards, keyboard moves, a card dialog with assignee, labels and a checklist.',
    type: 'Application',
    tags: ['Project', 'Drag and drop', 'Dialogs'],
    layout: 'app',
    features: [
      'Four columns with counts and work-in-progress limits',
      'Drag cards between columns with motion/react, or use the move buttons',
      'Card dialog: title, description, assignee, labels, due date and checklist',
      'Add a card inline in any column; filter the board by person',
      'Moves are announced to screen readers through a live region',
    ],
    components: ['button', 'card', 'chip', 'avatar-badge', 'dialog', 'text-field', 'select', 'checkbox', 'progress', 'tooltip', 'menu', 'snackbar'],
  },
  {
    slug: 'storefront',
    name: 'Storefront',
    description: 'A small online shop: product grid with filters and sorting, quick view, a cart drawer with totals and a checkout stepper.',
    type: 'E-commerce',
    tags: ['Shop', 'Cart', 'Checkout'],
    layout: 'page',
    features: [
      'Product grid with category, price and in-stock filters, and four sort orders',
      'Quick view dialog with color and quantity pickers',
      'Cart drawer with quantity steppers, free-shipping progress and totals',
      'Three-step checkout with validation and an order confirmation',
      'Products are drawn in SVG, so there are no image files to host',
    ],
    components: ['button', 'card', 'chip', 'select', 'checkbox', 'slider', 'rating', 'dialog', 'drawer', 'stepper', 'text-field', 'radio', 'avatar-badge', 'progress', 'alert', 'snackbar'],
  },
  {
    slug: 'saas-landing',
    name: 'SaaS landing',
    description: 'A marketing site for a software product: hero with a product shot, feature bento, pricing toggle, testimonials and FAQ.',
    type: 'Marketing',
    tags: ['Landing page', 'Pricing', 'FAQ'],
    layout: 'page',
    features: [
      'Sticky navigation with a menu drawer on narrow screens',
      'Hero with an email capture form and a product mock built from components',
      'Feature bento with small live illustrations',
      'Pricing with a monthly / yearly toggle and a highlighted plan',
      'Testimonials, FAQ accordion, closing call to action and footer',
    ],
    components: ['button', 'card', 'chip', 'text-field', 'switch', 'accordion', 'avatar-badge', 'drawer', 'alert', 'rating'],
  },
  {
    slug: 'settings',
    name: 'Account settings',
    description: 'Workspace settings with tabs for profile, notifications, billing and team, plus an invite dialog and a danger zone.',
    type: 'Application',
    tags: ['Settings', 'Billing', 'Team'],
    layout: 'app',
    features: [
      'Profile form with validation, unsaved-changes bar, Save and Cancel',
      'Notification matrix with per-channel switches and a digest picker',
      'Billing: plan cards, usage meters, payment method and an invoice table',
      'Team table with role menus, pending invites and an invite dialog',
      'Danger zone with a type-to-confirm delete dialog',
    ],
    components: ['button', 'card', 'chip', 'tabs', 'text-field', 'select', 'switch', 'table', 'dialog', 'avatar-badge', 'progress', 'alert', 'menu', 'snackbar', 'radio'],
  },
  {
    slug: 'product-launch',
    name: 'Product launch',
    description: 'A waitlist page assembled from seven blocks: minimal hero with email capture, three steps, a featured quote and a newsletter footer.',
    type: 'Marketing',
    tags: ['Waitlist', 'Blocks'],
    layout: 'page',
    features: [
      'Seven blocks stacked into one page: swap any of them for another from /blocks',
      'Email capture with validation in the hero, the call to action and the footer',
      'Numbered steps, a feature list and a featured testimonial',
      'Every block ships as its own file on the Code tab',
    ],
    components: ['button', 'text-field', 'card', 'chip', 'avatar-badge', 'alert', 'checkbox'],
  },
  {
    slug: 'developer-tool',
    name: 'Developer tool',
    description: 'A page for an API or SDK, assembled from seven blocks: code-first hero, feature grid, plan comparison table, changelog and footer.',
    type: 'Marketing',
    tags: ['API', 'Blocks'],
    layout: 'page',
    features: [
      'Code-first hero with runtime chips and a code sample',
      'Feature grid and a plan comparison table',
      'Changelog with version chips and a split call to action',
      'Every block ships as its own file on the Code tab',
    ],
    components: ['button', 'chip', 'card', 'table', 'alert'],
  },
];

export const TEMPLATE_TYPES: TemplateType[] = ['Application', 'Marketing', 'E-commerce'];

export const getTemplate = (slug: string) => TEMPLATES.find((t) => t.slug === slug);
