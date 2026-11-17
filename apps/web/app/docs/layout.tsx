import { Box, Container } from '@mui/material';
import DocsNav from '@/components/DocsNav';
import DocsMobileNav from '@/components/DocsMobileNav';

// Desktop: sticky sidebar beside the content. Below md the sidebar lives in a
// drawer (DocsMobileNav) so the page content comes first. Component pages add
// their own "On this page" column on the right at lg+.
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 0, md: 4 } }}>
      <Box sx={{ display: 'flex', gap: { md: 4, lg: 5 }, alignItems: 'flex-start' }}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, width: 216, flexShrink: 0, alignSelf: 'stretch' }}>
          <DocsNav />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DocsMobileNav />
          {children}
        </Box>
      </Box>
    </Container>
  );
}
