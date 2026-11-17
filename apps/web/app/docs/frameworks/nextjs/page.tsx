import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Next.js',
  description: 'Set up Sorbet UI in a Next.js App Router project, with server rendering and no style flash.',
  path: '/docs/frameworks/nextjs',
});

export default function Page() {
  return (
    <GuidePage href='/docs/frameworks/nextjs' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
