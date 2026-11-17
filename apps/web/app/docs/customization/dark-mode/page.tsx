import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Dark mode',
  description: 'Follow the system setting, add a toggle, and avoid a flash of the wrong theme.',
  path: '/docs/customization/dark-mode',
});

export default function Page() {
  return (
    <GuidePage href='/docs/customization/dark-mode' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
