import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Accessibility',
  description: 'What the components do for you, what is still your job, and how we test.',
  path: '/docs/guides/accessibility',
});

export default function Page() {
  return (
    <GuidePage href='/docs/guides/accessibility' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
