import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Colors and tokens',
  description: 'The seven color roles, the palette scales and the design tokens behind them.',
  path: '/docs/customization/colors',
});

export default function Page() {
  return (
    <GuidePage href='/docs/customization/colors' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
