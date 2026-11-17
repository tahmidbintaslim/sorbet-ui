import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';
import { pageMeta } from '@/lib/seo';
import PageHeader from '@/components/fun/PageHeader';

// DRAFT: placeholder written by the docs-hub scaffold. Replace before merging.
export const metadata: Metadata = pageMeta({
  title: 'Support',
  description: 'Get help with Sorbet UI: docs, FAQ, GitHub issues and discussions, and security reports.',
  path: '/support',
});

export default function Support() {
  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <PageHeader flavor="success" doodle="sundae" title="Support">
        Get help with Sorbet UI.
      </PageHeader>
      <Typography>Draft.</Typography>
    </Container>
  );
}
