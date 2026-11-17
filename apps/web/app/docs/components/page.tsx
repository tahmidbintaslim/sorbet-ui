import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { CATALOG } from '@/lib/catalog';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';
import CatalogGrid from '@/components/docs/CatalogGrid';

export const metadata: Metadata = pageMeta({
  title: 'Components',
  description: `All ${CATALOG.length} Sorbet UI components, each with one variant, color and size API, in light and dark.`,
  path: '/docs/components',
});

export default function Components() {
  return (
    <>
      <PageHeader flavor={SECTION_FLAVOR.components} doodle="popsicle" aside="pick a flavor" title="Components">
        {CATALOG.length} components. Each page has a playground, live examples with their source, a props table and
        accessibility notes.
      </PageHeader>
      <CatalogGrid />
    </>
  );
}
