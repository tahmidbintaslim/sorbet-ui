import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Link } from '@mui/material';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, DocTable, NextLinks, Steps } from '../../_shared/parts';
import A from '../../_shared/A';
import { BLOCKS } from '@/lib/blocks-meta';
import { REGISTRY_URL, addCommand, registryName } from '@/lib/registry';
import { SITE } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'AI and MCP',
  description: 'Give coding assistants the real props: the Storybook MCP server, llms.txt and the registry.',
  path: '/docs/guides/ai',
});

const toc: TocItem[] = [
  { id: 'why', label: 'Why give agents the source', depth: 2 },
  { id: 'storybook-mcp', label: 'The Storybook MCP server', depth: 2 },
  { id: 'connect', label: 'Connect your assistant', depth: 3 },
  { id: 'tools', label: 'Tools', depth: 3 },
  { id: 'workflow', label: 'A good workflow', depth: 3 },
  { id: 'agents-md', label: 'AGENTS.md', depth: 2 },
  { id: 'registry', label: 'The shadcn registry', depth: 2 },
  { id: 'llms-txt', label: 'llms.txt', depth: 2 },
  { id: 'prompts', label: 'Prompts that work', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

// Read from the repository at build time, so the page shows the real config.
const MCP_JSON = readFileSync(join(process.cwd(), '../../.mcp.json'), 'utf8').trim();

const START = `pnpm install
pnpm storybook:dev   # Storybook on http://localhost:6006, MCP at /mcp`;

const CLAUDE_ADD = `claude mcp add --transport http storybook http://localhost:6006/mcp`;

const PROMPTS = `Build a settings form with Sorbet UI. Before writing code, use the Storybook
MCP docs tools to look up TextField, Select, Switch and Button. Use only props
that exist. Every control needs a visible label. When done, run test-run on the
stories you touched and fix any accessibility findings.`;

export default function Page() {
  const example = registryName(BLOCKS[0].id);

  return (
    <GuidePage href="/docs/guides/ai" toc={toc} doodle="cone" aside="robots welcome">
      <p>
        Coding assistants write better UI code when they read the real component API instead of guessing it. Sorbet
        gives them four sources: a Storybook MCP server, an <code>AGENTS.md</code> file, a shadcn registry of blocks,
        and <code>llms.txt</code>.
      </p>

      <Section id="why" title="Why give agents the source">
        <p>
          Sorbet changes MUI&apos;s API in small ways that a model trained on MUI will get wrong: <code>variant</code>{' '}
          takes <code>solid</code>, <code>soft</code>, <code>outlined</code>, <code>ghost</code> or <code>plain</code>,{' '}
          <code>color</code> takes <code>danger</code> instead of <code>error</code>, and sizes run from{' '}
          <code>xs</code> to <code>xl</code>. An agent that reads the stories first gets these right.
        </p>
      </Section>

      <Section id="storybook-mcp" title="The Storybook MCP server">
        <p>
          The Storybook in <code>apps/docs</code> runs <code>@storybook/addon-mcp</code>. While Storybook is running, it
          serves an MCP server with each component&apos;s props, stories and usage, built from the component manifest.
        </p>
        <H3 id="connect">Connect your assistant</H3>
        <Steps>
          <li>
            <strong>Start Storybook</strong> from the repository root:
            <CodeBlock code={START} title="Terminal" label="Start Storybook" />
          </li>
          <li>
            <strong>Point your assistant at</strong> <code>http://localhost:6006/mcp</code> (HTTP transport). The
            repository already registers it for Claude Code in <code>.mcp.json</code>:
            <CodeBlock code={MCP_JSON} title=".mcp.json" label="MCP config" />
            Outside the repository, or with another name, add it yourself:
            <CodeBlock code={CLAUDE_ADD} title="Terminal" label="Add the server to Claude Code" />
          </li>
        </Steps>
        <p>Other MCP clients take the same URL; how you register it depends on the client.</p>

        <H3 id="tools">Tools</H3>
        <DocTable
          label="Storybook MCP tools"
          head={['Tool', 'What it does']}
          rows={[
            ['docs-list', 'Lists the components and docs entries, with the ids the other tools take.'],
            ['docs-show', 'Shows the documentation for one component or docs entry: its props and stories.'],
            ['docs-show-story', 'Shows the documentation for one story, by its story id.'],
            ['test-run', 'Runs story tests, including the axe accessibility checks.'],
          ]}
        />
        <p>
          These are the tools <code>AGENTS.md</code> asks agents to use. The addon also has a <code>dev</code> toolset
          (for example <code>stories-preview</code> and <code>get-storybook-story-instructions</code>) for agents that
          write stories.
        </p>

        <H3 id="workflow">A good workflow</H3>
        <ol>
          <li>
            <code>docs-list</code> to find the component, then <code>docs-show</code> for its props. Never guess props.
          </li>
          <li>Reuse an existing component or pattern before writing a new one.</li>
          <li>
            After changing a component or story, <code>test-run</code> it and fix every accessibility finding. Without
            MCP, <code>pnpm test:storybook:ci</code> runs the same tests.
          </li>
        </ol>
      </Section>

      <Section id="agents-md" title="AGENTS.md">
        <p>
          <Link href={`${SITE.github}/blob/main/AGENTS.md`} rel="noopener" sx={{ fontWeight: 600 }}>
            AGENTS.md
          </Link>{' '}
          at the repository root is the brief for coding agents working on Sorbet itself. <code>CLAUDE.md</code> imports
          it, so Claude Code reads it automatically; other agents that read <code>AGENTS.md</code> get the same rules.
          It covers:
        </p>
        <ul>
          <li>The monorepo map: which package holds tokens, the theme, the components, Storybook and this site.</li>
          <li>Use the Storybook MCP server first, and the workflow above.</li>
          <li>
            The rules: the variant, color and size values; colors only from <code>@sorbet-ui/tokens</code>, with a
            contrast test for any new pair; an accessible name for every interactive element; reduced motion.
          </li>
          <li>The checks to run before a pull request.</li>
        </ul>
        <p>
          For your own app, write a short <code>AGENTS.md</code> that says you use Sorbet UI, links to these docs, and
          lists your own rules.
        </p>
      </Section>

      <Section id="registry" title="The shadcn registry">
        <p>
          Every block on the <A href="/blocks">blocks page</A> is also a shadcn registry item, so a CLI (or an agent)
          can copy its source into your project. Items are served at <code>{REGISTRY_URL}/&lt;name&gt;.json</code>; the
          name is the block id in kebab case. The index is <code>{REGISTRY_URL}/registry.json</code>.
        </p>
        <CodeBlock code={addCommand(example)} title="Terminal" label="Add a block" />
        <ul>
          <li>
            Each block item depends on the <code>theme</code> item, which installs a <code>SorbetProvider</code> (light,
            dark or system mode) at <code>components/sorbet/SorbetProvider.tsx</code>, plus the npm packages the block
            imports.
          </li>
          <li>
            Blocks are self-contained: they import only npm packages, so the copied file works on its own.
          </li>
          <li>
            Your project needs a <code>components.json</code>; the{' '}
            <A href="/docs/installation">installation page</A> has one for MUI apps.
          </li>
        </ul>
        <Callout tone="warning" title="Not on npm yet">
          The <code>@sorbet-ui/*</code> packages a block depends on are not published yet; install them from source as
          the installation page shows.
        </Callout>
      </Section>

      <Section id="llms-txt" title="llms.txt">
        <p>
          <Link href="/llms.txt" sx={{ fontWeight: 600 }}>
            /llms.txt
          </Link>{' '}
          is a plain-text map of these docs for language models, following the llms.txt convention. Give its URL to an
          assistant that can fetch web pages, or paste it into a chat, when you want answers grounded in these docs.
        </p>
      </Section>

      <Section id="prompts" title="Prompts that work">
        <CodeBlock code={PROMPTS} title="Prompt" label="An example prompt" />
        <ul>
          <li>Name the components you expect, so the agent looks them up.</li>
          <li>Ask for props from the docs tools, not from memory.</li>
          <li>Ask it to run the tests and fix accessibility findings before it reports back.</li>
          <li>Review the result in light and dark mode yourself.</li>
        </ul>
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/blocks', title: 'Blocks', note: 'Ready-made sections, each in the registry.' },
            { href: '/docs/guides/accessibility', title: 'Accessibility', note: 'What test-run checks for.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
