import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Brand assets',
  description: 'The Sorbet UI name, logo and colors, and how to use them.',
  path: '/docs/brand',
});

export default function Page() {
  return (
    <GuidePage href='/docs/brand' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
