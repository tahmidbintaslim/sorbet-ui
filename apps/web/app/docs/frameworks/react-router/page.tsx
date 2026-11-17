import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'React Router',
  description: 'Set up Sorbet UI in a React Router (framework mode) project.',
  path: '/docs/frameworks/react-router',
});

export default function Page() {
  return (
    <GuidePage href='/docs/frameworks/react-router' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
