import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Vite',
  description: 'Set up Sorbet UI in a Vite and React project.',
  path: '/docs/frameworks/vite',
});

export default function Page() {
  return (
    <GuidePage href='/docs/frameworks/vite' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
