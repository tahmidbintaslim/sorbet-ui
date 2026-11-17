import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'FAQ',
  description: 'Short answers to the questions people ask most.',
  path: '/docs/faq',
});

export default function Page() {
  return (
    <GuidePage href='/docs/faq' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
