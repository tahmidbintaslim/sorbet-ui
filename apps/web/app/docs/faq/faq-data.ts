// FAQ content, shared by /docs/faq (accordion + FAQPage JSON-LD) and /support (top 5).
// Plain text only, so the same answer feeds the page and the structured data.
// Every answer is checked against the repo: CHANGELOG.md, LICENSE, SECURITY.md and
// the packages' peerDependencies. Update the answer when those change.

export type FaqLink = { href: string; label: string };
export type FaqItem = { id: string; q: string; a: string; links?: FaqLink[] };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

const GITHUB = 'https://github.com/tahmidbintaslim/sorbet-ui';

export const FAQ: FaqGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        id: 'what-is-sorbet',
        q: 'What is Sorbet UI?',
        a: 'A theme and component layer for Material UI. @sorbet-ui/theme gives you a light and a dark MUI theme, and @sorbet-ui/react adds 30 components that share one variant, color and size API. Everything renders through MUI, so your existing code keeps working.',
        links: [
          { href: '/docs', label: 'Introduction' },
          { href: '/docs/components', label: 'Components' },
        ],
      },
      {
        id: 'npm',
        q: 'Can I install it from npm?',
        a: 'Not yet. 0.1.0 is the first planned release and nothing has been published to npm. Until then, clone the repo, build the packages and install the packed tarballs into your app. The installation guide has the exact commands.',
        links: [{ href: '/docs/installation', label: 'Installation' }],
      },
      {
        id: 'keep-mui-code',
        q: 'Do I have to rewrite my MUI screens?',
        a: 'No. Wrap your app in the Sorbet ThemeProvider and stock @mui/material components (buttons, inputs, cards, chips, tabs, tables, dialogs, menus, tooltips and app bars) pick up the new look with no code changes. Switch to Sorbet components one screen at a time when you want the shared variant API.',
        links: [{ href: '/docs/migrating-from-mui', label: 'Migrating from MUI' }],
      },
      {
        id: 'packages',
        q: 'Which packages are there?',
        a: 'Four: @sorbet-ui/react (the components), @sorbet-ui/theme (lightTheme and darkTheme), @sorbet-ui/tokens (colors, spacing, type and motion) and @sorbet-ui/core (shared types, variant presets and accessibility helpers). The components depend on core and tokens, so install all four.',
        links: [{ href: '/docs/customization/colors', label: 'Colors and tokens' }],
      },
    ],
  },
  {
    id: 'compatibility',
    title: 'Compatibility',
    items: [
      {
        id: 'mui-versions',
        q: 'Which Material UI versions are supported?',
        a: 'Material UI v7 (7.3.5 or later) and v9, with MUI X Date Pickers v8 or v9. Material UI, MUI X Date Pickers, Emotion and dayjs are peer dependencies, so you choose the versions.',
        links: [{ href: '/docs/installation', label: 'Installation' }],
      },
      {
        id: 'react-versions',
        q: 'Which React versions are supported?',
        a: '@sorbet-ui/react needs React 19. @sorbet-ui/theme on its own accepts React 18 or 19, so a React 18 app can use the theme to restyle its MUI components.',
      },
      {
        id: 'ssr',
        q: 'Does it work with Next.js and server rendering?',
        a: 'Yes. @sorbet-ui/react ships with a "use client" directive, so you can import components from Server Components. Put the ThemeProvider in a client component and wrap the app in the Emotion cache provider from @mui/material-nextjs so styles are rendered on the server in order.',
        links: [
          { href: '/docs/frameworks/nextjs', label: 'Next.js' },
          { href: '/docs/guides/server-rendering', label: 'Server rendering' },
        ],
      },
      {
        id: 'frameworks',
        q: 'Can I use it with Vite or React Router?',
        a: 'Yes. Sorbet UI is React and Material UI, so it runs wherever MUI runs. There are setup guides for Vite, Next.js and React Router.',
        links: [
          { href: '/docs/frameworks/vite', label: 'Vite' },
          { href: '/docs/frameworks/react-router', label: 'React Router' },
        ],
      },
    ],
  },
  {
    id: 'theming',
    title: 'Theming',
    items: [
      {
        id: 'dark-mode',
        q: 'How do I turn on dark mode?',
        a: 'Pass darkTheme instead of lightTheme to the MUI ThemeProvider. To follow the system setting, pick the theme with useMediaQuery("(prefers-color-scheme: dark)"). Components read the mode from the theme and switch to their dark-mode shades.',
        links: [{ href: '/docs/customization/dark-mode', label: 'Dark mode' }],
      },
      {
        id: 'brand-colors',
        q: 'Can I change the colors, fonts or corner radius?',
        a: 'Yes. lightTheme and darkTheme are regular MUI themes built with createTheme, so you extend them the same way: createTheme(lightTheme, { ...your changes }). Keep text pairs at 4.5:1 contrast when you change colors.',
        links: [
          { href: '/docs/theming', label: 'Theming' },
          { href: '/docs/customization/typography', label: 'Typography and spacing' },
        ],
      },
      {
        id: 'variant-api',
        q: 'What do variant, color and size do?',
        a: 'Every component takes the same three props. variant is solid, soft, outlined, ghost or plain (Button also has dash and link). color is primary, secondary, success, warning, danger, info or neutral. size goes from xs to xl.',
        links: [{ href: '/docs/customization/variants', label: 'Variants, colors and sizes' }],
      },
      {
        id: 'override',
        q: 'How do I override a style?',
        a: 'Use the sx prop for one instance, theme component overrides for every instance, or wrap a component with styled() to make your own variant. It is the same toolbox as plain MUI.',
        links: [{ href: '/docs/customization/override-styles', label: 'Overriding styles' }],
      },
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    items: [
      {
        id: 'a11y',
        q: 'Is Sorbet UI accessible?',
        a: 'Every token, theme palette and variant preset text pair is unit tested for WCAG AA contrast (4.5:1), and axe runs on every Storybook story and every site page in light and dark. Screen reader testing has not been done yet; it is listed as a known issue in the changelog.',
        links: [
          { href: '/docs/guides/accessibility', label: 'Accessibility' },
          { href: '/docs/changelog', label: 'Changelog' },
        ],
      },
      {
        id: 'a11y-your-job',
        q: 'What is still my job?',
        a: 'Give every form control a label, every icon-only button an accessible name, and keep your own colors at AA contrast. The components wire up roles, focus and ARIA attributes, but they cannot invent text for you.',
        links: [{ href: '/docs/guides/forms', label: 'Forms' }],
      },
    ],
  },
  {
    id: 'project',
    title: 'Project',
    items: [
      {
        id: 'license',
        q: 'What is the license?',
        a: 'MIT. You can use Sorbet UI in personal and commercial projects. Keep the copyright notice from the LICENSE file.',
        links: [{ href: `${GITHUB}/blob/main/LICENSE`, label: 'LICENSE' }],
      },
      {
        id: 'production',
        q: 'Is it ready for production?',
        a: 'It is a pre-release: 0.1.0 has not been published, and one person maintains it. The components are tested (unit tests, Storybook interaction tests and axe), but expect changes before the first release and pin the commit you build from.',
        links: [{ href: '/docs/changelog', label: 'Changelog' }],
      },
      {
        id: 'get-help',
        q: 'Where do I ask a question or report a bug?',
        a: 'Open a GitHub issue. There are templates for bug reports and feature requests; for a question, open a blank issue. The support page links straight to each one.',
        links: [{ href: '/support', label: 'Support' }],
      },
      {
        id: 'security',
        q: 'How do I report a security problem?',
        a: 'Privately, not in a public issue: open the repository Security tab and choose "Report a vulnerability". That creates a private advisory only you and the maintainer can see.',
        links: [{ href: `${GITHUB}/security/advisories/new`, label: 'Report a vulnerability' }],
      },
      {
        id: 'ai',
        q: 'Can AI coding assistants use the docs?',
        a: 'Yes. The site publishes /llms.txt, a plain list of every docs page and component. When you run Storybook locally, its MCP server at http://localhost:6006/mcp gives assistants the real props and stories.',
        links: [{ href: '/docs/guides/ai', label: 'AI and MCP' }],
      },
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = FAQ.flatMap((g) => g.items);

/** The questions /support shows first. */
export const TOP_FAQ_IDS = ['npm', 'mui-versions', 'keep-mui-code', 'ssr', 'dark-mode'];
