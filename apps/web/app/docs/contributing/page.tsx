import type { Metadata } from 'next';
import { Box, Link } from '@mui/material';
import { pageMeta } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { scoop } from '@/lib/scoops';
import GuidePage, { H3, Section } from '@/components/docs/GuidePage';
import DocLinkCard from '@/components/docs/DocLinkCard';
import CodeBlock from '@/components/CodeBlock';

export const metadata: Metadata = pageMeta({
  title: 'Contributing',
  description: 'Set up the Sorbet UI repo, add or fix a component, pass the tests and accessibility checks, and open a pull request.',
  path: '/docs/contributing',
});

const GH = SITE.github;

const SETUP = `# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/sorbet-ui.git
cd sorbet-ui
git remote add upstream ${GH}.git

corepack enable          # once; picks up the pinned pnpm
pnpm install
pnpm build:packages      # tokens, theme, core and react (tsup)`;

const DEV = `pnpm storybook:dev       # Storybook on http://localhost:6006
pnpm web:dev             # this site on http://localhost:3000
pnpm dev                 # both at once`;

const NEW_COMPONENT = `packages/react/src/MyComponent.tsx          # the component
packages/react/src/MyComponent.test.tsx     # unit tests (Vitest + Testing Library)
packages/react/src/MyComponent.stories.tsx  # stories with play functions
packages/react/src/index.ts                 # export it`;

const CHECKS = `pnpm lint && pnpm type-check && pnpm test:ci    # packages
pnpm test:storybook:ci                           # every story in Chromium, with axe
pnpm --filter web build && pnpm --filter web test:e2e   # site + axe, light and dark`;

const BRANCH = `git checkout -b feat/toggle-sizes
git commit -m "feat(toggle-button-group): add xl size"`;

const REPO_MAP: [string, string][] = [
  ['packages/tokens', 'Design tokens: colors, spacing, type and motion. src/contrast.test.ts checks WCAG AA for every color pair.'],
  ['packages/core', 'Shared types, variant presets and accessibility helpers.'],
  ['packages/theme', 'lightTheme and darkTheme for the MUI ThemeProvider.'],
  ['packages/react', 'The components: src/<Name>.tsx, .stories.tsx and .test.tsx side by side.'],
  ['apps/docs', 'Storybook 10, with the MCP addon.'],
  ['apps/web', 'This site (Next.js): docs, blocks, templates and the demo.'],
];

const SCRIPTS: [string, string][] = [
  ['pnpm build:packages', 'Build the four packages. Run it before tests, Storybook or the site.'],
  ['pnpm test', 'Unit tests in watch mode.'],
  ['pnpm test:ci', 'Unit tests once, as CI runs them.'],
  ['pnpm test:storybook:ci', 'Every story as a browser test in headless Chromium, each checked with axe.'],
  ['pnpm lint', 'ESLint across the workspace.'],
  ['pnpm type-check', 'TypeScript across the workspace.'],
  ['pnpm build', 'Packages, Storybook and the site.'],
  ['pnpm web:e2e', 'Playwright tests for the site (build it first).'],
];

const tableSx = {
  width: '100%',
  borderCollapse: 'collapse',
  my: 2,
  fontSize: 14,
  '& th, & td': { textAlign: 'left', verticalAlign: 'top', py: 1.25, px: 1.5, borderBottom: 1, borderColor: 'divider' },
  '& th': { color: 'text.primary', fontWeight: 700 },
  '& td': { color: 'text.secondary', lineHeight: 1.6 },
  '& td:first-of-type': { whiteSpace: { sm: 'nowrap' } },
} as const;

function Table({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box component="table" sx={tableSx}>
        <thead>
          <tr>
            <th scope="col">{head[0]}</th>
            <th scope="col">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <td>
                <code>{a}</code>
              </td>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}

export default function Page() {
  return (
    <GuidePage
      href="/docs/contributing"
      doodle="waffle"
      aside="pull up a stool"
      toc={[
        { id: 'ways-to-help', label: 'Ways to help', depth: 2 },
        { id: 'setup', label: 'Set up the repo', depth: 2 },
        { id: 'repo-map', label: 'Repo map', depth: 2 },
        { id: 'scripts', label: 'Scripts', depth: 2 },
        { id: 'add-a-component', label: 'Add a component', depth: 2 },
        { id: 'quality-bar', label: 'Tests and accessibility', depth: 2 },
        { id: 'commits-and-prs', label: 'Commits and pull requests', depth: 2 },
        { id: 'conduct', label: 'Code of conduct', depth: 2 },
      ]}
    >
      <p>
        Thanks for helping. Bug reports, tests, docs and new components are all welcome. This page is the short version; the full guide is{' '}
        <Link href={`${GH}/blob/main/CONTRIBUTING.md`} rel="noopener">
          CONTRIBUTING.md
        </Link>{' '}
        on GitHub.
      </p>

      <Section id="ways-to-help" title="Ways to help">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
          <DocLinkCard href={`${GH}/issues/new?template=bug_report.md`} title="Report a bug" note="Steps, expected and actual behavior, and a minimal example." />
          <DocLinkCard href={`${GH}/issues/new?template=feature_request.md`} title="Request a feature" note="The problem it solves and how you would use it." />
          <DocLinkCard href={`${GH}/labels/good%20first%20issue`} title="Pick a good first issue" note="Small, well-scoped tasks labeled for newcomers." />
          <DocLinkCard href="/docs" title="Improve the docs" note='Every docs page has an "Edit this page on GitHub" link.' />
        </Box>
      </Section>

      <Section id="setup" title="Set up the repo">
        <p>
          You need Node.js 22 (see <code>.nvmrc</code>), the pnpm version pinned in <code>packageManager</code>, and Git. Workspace packages import each other from their{' '}
          <code>dist/</code> builds, so build them once before anything else.
        </p>
        <CodeBlock code={SETUP} title="Terminal" label="Set up commands" />
        <H3 id="run-it">Run it</H3>
        <CodeBlock code={DEV} title="Terminal" label="Dev server commands" />
        <p>
          With Storybook running, its MCP server is at <code>http://localhost:6006/mcp</code>. If you use a coding assistant, let it look up props and stories there instead of guessing.
        </p>
      </Section>

      <Section id="repo-map" title="Repo map">
        <p>A pnpm and Turborepo monorepo.</p>
        <Table head={['Path', 'What lives there']} rows={REPO_MAP} />
      </Section>

      <Section id="scripts" title="Scripts">
        <p>Run these from the repo root.</p>
        <Table head={['Command', 'What it does']} rows={SCRIPTS} />
      </Section>

      <Section id="add-a-component" title="Add a component">
        <p>Start from Button: it is the reference for structure, props and tests. A new component is four files.</p>
        <CodeBlock code={NEW_COMPONENT} title="packages/react/src" label="New component files" />
        <H3 id="component-rules">The rules</H3>
        <ul>
          <li>
            Take the shared props: <code>variant</code> (<code>solid | soft | outlined | ghost | plain</code>), <code>color</code> (
            <code>primary | secondary | success | warning | danger | info | neutral</code>) and <code>size</code> (<code>xs</code> to <code>xl</code>).
          </li>
          <li>
            Take colors from <code>@sorbet-ui/tokens</code> with <code>colorScaleForMode(color, isDark)</code>. Never hardcode a color, and never read{' '}
            <code>colors.&lt;name&gt;.main</code> directly: those are light-theme shades.
          </li>
          <li>
            Add a case to <code>packages/react/src/dark-mode.test.tsx</code> when a component reads <code>main</code> or <code>dark</code> in a new place, and a test in{' '}
            <code>packages/tokens/src/contrast.test.ts</code> for any new color pair.
          </li>
          <li>Give every interactive element an accessible name and every form control a label.</li>
          <li>
            Respect <code>prefers-reduced-motion</code> for any animation.
          </li>
          <li>
            Use <code>forwardRef</code>, set <code>displayName</code>, and export the props interface.
          </li>
        </ul>
        <H3 id="site-blocks">Adding a block to this site</H3>
        <p>
          Blocks live in <code>apps/web/blocks/&lt;category&gt;/</code>. Start the file with <code>&apos;use client&apos;;</code> and a{' '}
          <code>{'// @block {"name","description"}'}</code> line, then run <code>node apps/web/scripts/gen-blocks.mjs</code>. Blocks are also published as shadcn registry items,
          so keep them self-contained (npm imports only) and use fictional sample content.
        </p>
      </Section>

      <Section id="quality-bar" title="Tests and accessibility">
        <p>
          CI runs lint, type-check, unit tests (against both Material UI v9 and v7), the Storybook tests and the site&apos;s Playwright tests. Run the same checks before you open a pull
          request:
        </p>
        <CodeBlock code={CHECKS} title="Terminal" label="Checks before a pull request" />
        <ul>
          <li>Unit tests use Testing Library and test behavior: query by role or label, not by class name.</li>
          <li>
            Every story runs through axe (WCAG 2.0 and 2.1, A and AA). Any violation fails the build. The Dark Mode stories render with darkTheme.
          </li>
          <li>Add a story for each key state, with a play function for interactions.</li>
        </ul>
      </Section>

      <Section id="commits-and-prs" title="Commits and pull requests">
        <p>
          Name branches by type (<code>feat/</code>, <code>fix/</code>, <code>docs/</code>, <code>refactor/</code>, <code>test/</code>, <code>chore/</code>…) and write commits in the{' '}
          <Link href="https://www.conventionalcommits.org/" rel="noopener">
            Conventional Commits
          </Link>{' '}
          format, in the imperative mood.
        </p>
        <CodeBlock code={BRANCH} title="Terminal" label="Branch and commit example" />
        <ul>
          <li>Rebase on the latest <code>main</code> and run the checks above.</li>
          <li>Fill in the pull request template: what changed, which issue it fixes, how you tested it, and screenshots for UI changes.</li>
          <li>A maintainer reviews it, every check must pass, and it is squash-merged into <code>main</code>.</li>
          <li>
            Your change ships in the next release. The maintainer versions packages with Changesets and publishes by creating a GitHub release; a merge never publishes on its own.
            See the <Link href="/docs/changelog">changelog</Link>.
          </li>
        </ul>
      </Section>

      <Section id="conduct" title="Code of conduct">
        <p>
          Sorbet UI follows the{' '}
          <Link href={`${GH}/blob/main/CODE_OF_CONDUCT.md`} rel="noopener">
            Contributor Covenant
          </Link>
          . Be kind, assume good intent and keep feedback about the code. Report security problems privately, as described in{' '}
          <Link href={`${GH}/blob/main/SECURITY.md`} rel="noopener">
            SECURITY.md
          </Link>
          , never in a public issue.
        </p>
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: 3,
            bgcolor: scoop('warning', 'tint'),
            border: 1,
            borderColor: scoop('warning', 'fill'),
            color: 'text.secondary',
          }}
        >
          By contributing, you agree that your work is licensed under the project&apos;s{' '}
          <Link href={`${GH}/blob/main/LICENSE`} rel="noopener">
            MIT License
          </Link>
          .
        </Box>
      </Section>
    </GuidePage>
  );
}
