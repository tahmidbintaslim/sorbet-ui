import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Changelog',
  description: 'What changed in each release.',
  path: '/docs/changelog',
});

export default function Page() {
  return (
    <GuidePage href='/docs/changelog' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
