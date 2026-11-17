import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Variants, colors and sizes',
  description: 'The one shared API: five variants, seven colors and five sizes on every component.',
  path: '/docs/customization/variants',
});

export default function Page() {
  return (
    <GuidePage href='/docs/customization/variants' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
