import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Migrating from MUI',
  description: 'Adopt Sorbet in an existing Material UI app one screen at a time.',
  path: '/docs/migrating-from-mui',
});

export default function Page() {
  return (
    <GuidePage href='/docs/migrating-from-mui' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
