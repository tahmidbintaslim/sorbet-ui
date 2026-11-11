import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Container } from '@mui/material';
import TemplateCards from '@/components/TemplateCards';
import { TEMPLATES } from '@/lib/templates';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';

export const metadata: Metadata = pageMeta({
  title: 'Templates',
  description: 'Free, MIT-licensed page templates built with Sorbet UI blocks.',
  path: '/templates',
});

export default function TemplatesPage() {
  return (
    <>
      <PageHeader bleed size="lg" flavor={SECTION_FLAVOR.templates} doodle="sundae" aside="ready to serve" title="Templates">
        {TEMPLATES.length} free page templates, MIT licensed. Each is a stack of blocks you can preview, then copy into your app.
      </PageHeader>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <TemplateCards />
      </Container>
    </>
  );
}
