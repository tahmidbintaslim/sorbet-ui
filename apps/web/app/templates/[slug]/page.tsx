import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import TemplatePreview from '@/components/TemplatePreview';
import TemplateHeader from '@/components/TemplateHeader';
import { TEMPLATES, getTemplate, templateSource } from '@/lib/templates';

export const dynamicParams = false;
export const generateStaticParams = () => TEMPLATES.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const t = getTemplate(slug);
  return pageMeta({ title: t ? `${t.name} template` : 'Template', description: t?.description, path: `/templates/${slug}` });
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTemplate((await params).slug);
  if (!t) notFound();
  return (
    <>
      <TemplateHeader name={t.name} description={t.description} source={templateSource(t)} blocks={t.blocks} />
      <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <TemplatePreview blocks={t.blocks} />
      </Box>
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          End of the {t.name} preview. All content is sample content.
        </Typography>
      </Container>
    </>
  );
}
