import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'AI and MCP',
  description: 'Give coding assistants the real props: the Storybook MCP server, llms.txt and the registry.',
  path: '/docs/guides/ai',
});

export default function Page() {
  return (
    <GuidePage href='/docs/guides/ai' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
