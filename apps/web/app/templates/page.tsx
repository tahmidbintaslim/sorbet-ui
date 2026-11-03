import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';
import TemplateCards from '@/components/TemplateCards';
import { TEMPLATES } from '@/lib/templates';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Free, MIT-licensed page templates built with Sorbet UI blocks.',
};

export default function TemplatesPage() {
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 } }}>
      <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 40, md: 56 }, letterSpacing: '-0.04em' }}>
        Templates
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: 18, mt: 1.5, maxWidth: 680 }}>
        {TEMPLATES.length} free page templates, MIT licensed. Each is a stack of blocks you can preview, then copy into your app.
      </Typography>
      <TemplateCards />
    </Container>
  );
}
