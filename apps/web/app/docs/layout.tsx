import { Container, Grid } from '@mui/material';
import DocsNav from '@/components/DocsNav';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <DocsNav />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }} sx={{ minWidth: 0 }}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
}
