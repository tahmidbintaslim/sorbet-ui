import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Contributing',
  description: 'Report a bug, propose a component, or send a pull request.',
  path: '/docs/contributing',
});

export default function Page() {
  return (
    <GuidePage href='/docs/contributing' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
