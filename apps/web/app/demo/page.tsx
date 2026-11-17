import type { Metadata } from 'next';
import { Box, Container, Typography } from '@mui/material';
import { pageMeta } from '@/lib/seo';
import DemoApp from '@/components/demo/DemoApp';
import DemoHub from '@/components/DemoHub';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';

export const metadata: Metadata = pageMeta({
  title: 'Demos',
  description: 'Working apps built with Sorbet UI: Acme Admin live on the page, plus an analytics dashboard, inbox, kanban board, settings and a storefront to open full screen. Sample data.',
  path: '/demo',
});

const ACME = 'acme-admin';

export default function DemoPage() {
  return (
    <>
      <PageHeader bleed size="lg" flavor={SECTION_FLAVOR.demo} doodle="popsicle" aside="taste test" title="Demos">
        Working apps built with Sorbet UI, all with sample data. Try Acme Admin right on this page, or open any of the apps full screen.
      </PageHeader>
      <Container maxWidth="lg">
        <DemoHub demoId={ACME} />
      </Container>
      <Box component="section" aria-labelledby={`${ACME}-title`} id={ACME} sx={{ mt: { xs: 6, md: 9 }, scrollMarginTop: 72 }}>
        <Container maxWidth="lg" sx={{ mb: 2.5 }}>
          <Typography id={`${ACME}-title`} component="h2" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 32 }, letterSpacing: '-0.02em' }}>
            Acme Admin demo
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
            A whole dashboard on this page: create an order, filter the table, change the settings. The section you are on is kept in the address bar.
          </Typography>
        </Container>
        <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
          <DemoApp />
        </Box>
      </Box>
    </>
  );
}
