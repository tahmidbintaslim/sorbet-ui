import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Overriding styles',
  description: 'Change one instance with sx, every instance with theme overrides, or build your own variant.',
  path: '/docs/customization/override-styles',
});

export default function Page() {
  return (
    <GuidePage href='/docs/customization/override-styles' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
