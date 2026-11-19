// Every written docs page (guides, not the generated component pages), in reading
// order. The sidebar, previous/next links, sitemap, "Edit this page" links and
// the search index (scripts/gen-docs.mjs) all read this list, so a new page is
// added here once. No runtime imports: gen-docs.mjs transpiles and loads it.

export type DocPage = {
  href: string;
  title: string;
  /** One line for meta descriptions, link cards and search. */
  description: string;
  /** Source file, relative to apps/web (for "Edit this page"). */
  file: string;
};

export type DocGroup = {
  title: string;
  /** Scoop flavor of the group's dot and the current-page pill. */
  flavor: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  pages: DocPage[];
};

const page = (href: string, title: string, description: string): DocPage => ({
  href,
  title,
  description,
  file: `app${href}/page.tsx`,
});

export const DOCS_NAV: DocGroup[] = [
  {
    title: 'Getting started',
    flavor: 'success',
    pages: [
      page('/docs', 'Introduction', 'What Sorbet UI is, who it is for, and how it fits on top of Material UI.'),
      page('/docs/installation', 'Installation', 'Install the packages, wrap your app in the theme, and render your first component.'),
      page('/docs/frameworks/nextjs', 'Next.js', 'Set up Sorbet UI in a Next.js App Router project, with server rendering and no style flash.'),
      page('/docs/frameworks/vite', 'Vite', 'Set up Sorbet UI in a Vite and React project.'),
      page('/docs/frameworks/react-router', 'React Router', 'Set up Sorbet UI in a React Router (framework mode) project.'),
      page('/docs/migrating-from-mui', 'Migrating from MUI', 'Adopt Sorbet in an existing Material UI app one screen at a time.'),
    ],
  },
  {
    title: 'Customization',
    flavor: 'warning',
    pages: [
      page('/docs/theming', 'Theming', 'The light and dark themes, and how to extend them like any MUI theme.'),
      page('/docs/customization/colors', 'Colors and tokens', 'The seven color roles, the palette scales and the design tokens behind them.'),
      page('/docs/customization/typography', 'Typography and spacing', 'Type scale, font stack, spacing and corner radius, and how to change them.'),
      page('/docs/customization/dark-mode', 'Dark mode', 'Follow the system setting, add a toggle, and avoid a flash of the wrong theme.'),
      page('/docs/customization/variants', 'Variants, colors and sizes', 'The one shared API: five variants, seven colors and five sizes on every component.'),
      page('/docs/customization/override-styles', 'Overriding styles', 'Change one instance with sx, every instance with theme overrides, or build your own variant.'),
    ],
  },
  {
    title: 'Guides',
    flavor: 'info',
    pages: [
      page('/docs/guides/forms', 'Forms', 'Labels, helper text, validation and submission with Sorbet form controls.'),
      page('/docs/guides/accessibility', 'Accessibility', 'What the components do for you, what is still your job, and how we test.'),
      page('/docs/guides/server-rendering', 'Server rendering', 'Server components, client boundaries and streaming with Sorbet UI.'),
      page('/docs/guides/routing', 'Routing and links', 'Render buttons and links with your router: Next.js Link, React Router and plain anchors.'),
      page('/docs/guides/ai', 'AI and MCP', 'Give coding assistants the real props: the Storybook MCP server, llms.txt and the registry.'),
    ],
  },
  {
    title: 'Resources',
    flavor: 'danger',
    pages: [
      page('/docs/faq', 'FAQ', 'Short answers to the questions people ask most.'),
      page('/docs/changelog', 'Changelog', 'What changed in each release.'),
      page('/docs/contributing', 'Contributing', 'Report a bug, propose a component, or send a pull request.'),
      page('/docs/brand', 'Brand assets', 'The Sorbet UI name, logo and colors, and how to use them.'),
    ],
  },
];

export const DOC_PAGES: DocPage[] = DOCS_NAV.flatMap((g) => g.pages);

export function docPage(href: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.href === href);
}

/** Previous and next written pages in reading order. */
export function docNeighbors(href: string): { prev?: DocPage; next?: DocPage } {
  const i = DOC_PAGES.findIndex((p) => p.href === href);
  return i < 0 ? {} : { prev: DOC_PAGES[i - 1], next: DOC_PAGES[i + 1] };
}
