import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Grid, Link } from '@mui/material';
import CatalogCard from '@/components/CatalogCard';
import { CATALOG } from '@/lib/catalog';
import { SITE } from '@/lib/site';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';

export const metadata: Metadata = pageMeta({
  title: 'Components',
  description: 'All 30 Sorbet UI components, each with one variant, color and size API, in light and dark.',
  path: '/docs/components',
});

export default function Components() {
  return (
    <>
      <PageHeader flavor={SECTION_FLAVOR.components} doodle="popsicle" aside="pick a flavor" title="Components">
        Each page has a live preview with variant, color and size pickers and matching source.
        Autocomplete, DatePicker, Dialog, Drawer, Menu, Popover and Snackbar are in{' '}
        <Link href={SITE.storybook} rel="noopener">
          Storybook
        </Link>
        .
      </PageHeader>
      <Grid container spacing={2}>
        {CATALOG.map((d) => (
          <Grid key={d.slug} size={{ xs: 12, sm: 6 }}>
            <CatalogCard href={`/docs/components/${d.slug}`} name={d.name} description={d.description} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
