import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Typography and spacing',
  description: 'Type scale, font stack, spacing and corner radius, and how to change them.',
  path: '/docs/customization/typography',
});

export default function Page() {
  return (
    <GuidePage href='/docs/customization/typography' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
