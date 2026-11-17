// /llms.txt (https://llmstxt.org): a Markdown map of the docs for language models,
// generated at build time from the docs nav and the component catalog.
import { DOCS_NAV } from '@/lib/docs-nav';
import { CATALOG, GROUPS } from '@/lib/catalog';
import { SITE_URL } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

const link = (title: string, href: string, description: string) =>
  `- [${title}](${href.startsWith('http') ? href : `${SITE_URL}${href}`}): ${description}`;

export function GET() {
  const lines: string[] = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    'Packages: `@sorbet-ui/react` (30 components), `@sorbet-ui/theme` (`lightTheme`, `darkTheme`), `@sorbet-ui/tokens` and `@sorbet-ui/core`. Version 0.1.0 is a pre-release and is not on npm yet; the installation page shows how to install from source.',
    '',
    'Every component takes the same props: `variant` (solid, soft, outlined, ghost, plain; Button also dash and link), `color` (primary, secondary, success, warning, danger, info, neutral) and `size` (xs, sm, md, lg, xl). Peer dependencies: Material UI v7 or v9, MUI X Date Pickers v8 or v9, Emotion, dayjs and React 19.',
    '',
  ];

  for (const group of DOCS_NAV) {
    lines.push(`## ${group.title}`, '');
    for (const p of group.pages) lines.push(link(p.title, p.href, p.description));
    lines.push('');
  }

  for (const g of GROUPS) {
    const entries = CATALOG.filter((c) => c.group === g);
    if (!entries.length) continue;
    lines.push(`## Components: ${g}`, '');
    for (const c of entries) lines.push(link(c.name, `/docs/components/${c.slug}`, c.description));
    lines.push('');
  }

  lines.push(
    '## Optional',
    '',
    link('Blocks', '/blocks', 'Copy-paste page sections built with Sorbet UI, also published as shadcn registry items under /r/.'),
    link('Templates', '/templates', 'Full app templates built with Sorbet UI.'),
    link('Storybook', SITE.storybook, 'Every component with live controls and its stories.'),
    link('Source code', SITE.github, 'The GitHub repository: packages, docs site and Storybook.'),
    link('Support', '/support', 'Where to get help, report a bug or report a security problem.'),
    '',
  );

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
