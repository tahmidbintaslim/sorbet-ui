import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Server rendering',
  description: 'Server components, client boundaries and streaming with Sorbet UI.',
  path: '/docs/guides/server-rendering',
});

export default function Page() {
  return (
    <GuidePage href='/docs/guides/server-rendering' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
