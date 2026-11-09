import type { Metadata } from 'next';
import { Grid, Link, Typography } from '@mui/material';
import CatalogCard from '@/components/CatalogCard';
import { CATALOG } from '@/lib/catalog';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Components' };

export default function Components() {
  return (
    <>
      <Typography component="h1" variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Components
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Each page has a live preview with variant, color and size pickers and matching source.
        Autocomplete, DatePicker, Dialog, Drawer, Menu, Popover and Snackbar are in{' '}
        <Link href={SITE.storybook} rel="noopener">
          Storybook
        </Link>
        .
      </Typography>
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
