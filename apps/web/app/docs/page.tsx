import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Introduction',
  description: 'What Sorbet UI is, who it is for, and how it fits on top of Material UI.',
  path: '/docs',
});

export default function Page() {
  return (
    <GuidePage href='/docs' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
