import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Forms',
  description: 'Labels, helper text, validation and submission with Sorbet form controls.',
  path: '/docs/guides/forms',
});

export default function Page() {
  return (
    <GuidePage href='/docs/guides/forms' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
