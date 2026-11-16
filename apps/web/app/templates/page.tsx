import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Container } from '@mui/material';
import TemplateCards from '@/components/TemplateCards';
import { TEMPLATES } from '@/lib/templates';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';

export const metadata: Metadata = pageMeta({
  title: 'Templates',
  description: 'Free, MIT-licensed app and page templates built with Sorbet UI: dashboard, inbox, kanban, storefront, landing page and settings.',
  path: '/templates',
});

export default function TemplatesPage() {
  return (
    <>
      <PageHeader bleed size="lg" flavor={SECTION_FLAVOR.templates} doodle="sundae" aside="ready to serve" title="Templates">
        {TEMPLATES.length} complete, working apps and pages. Free and MIT licensed. Try each one live, resize it, then copy its source.
      </PageHeader>
      <Container maxWidth="lg">
        <TemplateCards />
      </Container>
    </>
  );
}
