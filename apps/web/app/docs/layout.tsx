import { Container, Grid } from '@mui/material';
import DocsNav from '@/components/DocsNav';
import DocsMobileNav from '@/components/DocsMobileNav';

// Desktop: sticky sidebar beside the content. Below md the sidebar lives in a
// drawer (DocsMobileNav) so the page content comes first.
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 0, md: 4 } }}>
      <Grid container spacing={4}>
        <Grid size={{ md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <DocsNav />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }} sx={{ minWidth: 0 }}>
          <DocsMobileNav />
          {children}
        </Grid>
      </Grid>
    </Container>
  );
}
