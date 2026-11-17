import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import GuidePage from '@/components/docs/GuidePage';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Routing and links',
  description: 'Render buttons and links with your router: Next.js Link, React Router and plain anchors.',
  path: '/docs/guides/routing',
});

export default function Page() {
  return (
    <GuidePage href='/docs/guides/routing' toc={[]}>
      <p>Draft.</p>
    </GuidePage>
  );
}
