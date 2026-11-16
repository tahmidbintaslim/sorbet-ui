import type { Metadata } from 'next';
import * as React from 'react';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import { pageMeta } from '@/lib/seo';
import TemplateViewer from '@/components/TemplateViewer';
import PageHeader from '@/components/fun/PageHeader';
import { StickerBadge } from '@/components/fun/Decor';
import { TEMPLATE_COMPONENTS } from '@/components/templates-registry';
import { CATALOG } from '@/lib/catalog';
import { SECTION_FLAVOR } from '@/lib/sections';
import { scoop } from '@/lib/scoops';
import { TEMPLATES, getTemplate } from '@/lib/templates';
import { TEMPLATE_SOURCE } from '@/lib/templates-source';
import { touchRow } from '@/lib/touch';

export const dynamicParams = false;
export const generateStaticParams = () => TEMPLATES.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const t = getTemplate(slug);
  return pageMeta({ title: t ? `${t.name} template` : 'Template', description: t?.description, path: `/templates/${slug}` });
}

const flavor = SECTION_FLAVOR.templates;

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTemplate((await params).slug);
  if (!t) notFound();
  const files = TEMPLATE_SOURCE[t.slug];
  const lines = files.reduce((n, f) => n + f.source.split('\n').length, 0);
  const used = t.components.map((slug) => CATALOG.find((c) => c.slug === slug)).filter((c) => c !== undefined);
  return (
    <>
      <PageHeader
        bleed
        flavor={flavor}
        doodle="sundae"
        title={t.name}
        back={{ href: '/templates', label: 'All templates' }}
        badge={
          <StickerBadge c="success" size={52}>
            Free
          </StickerBadge>
        }
      >
        {t.description}
      </PageHeader>
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <TemplateViewer slug={t.slug} name={t.name} files={files} layout={t.layout}>
          {React.createElement(TEMPLATE_COMPONENTS[t.slug])}
        </TemplateViewer>
      </Container>
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'grid', gap: { xs: 5, md: 8 }, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' } }}>
          <Box component="section" aria-labelledby="included">
            <Typography id="included" component="h2" sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
              What is included
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, display: 'grid', gap: 1.5 }}>
              {t.features.map((f) => (
                <Box component="li" key={f} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box aria-hidden sx={{ mt: '7px', width: 10, height: 10, borderRadius: '50%', flexShrink: 0, bgcolor: scoop(flavor, 'fill') }} />
                  <Typography>{f}</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
              {files.length} files, {lines.toLocaleString('en-US')} lines. Responsive to its container, light and dark, keyboard accessible. All names and numbers are sample content.
            </Typography>
          </Box>
          <Box component="section" aria-labelledby="built-with">
            <Typography id="built-with" component="h2" sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
              Built with
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {used.length} Sorbet UI components on Material UI. Each links to its docs.
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {used.map((c) => (
                <li key={c.slug}>
                  <NextLink href={`/docs/components/${c.slug}`} style={{ textDecoration: 'none' }}>
                    <Box
                      component="span"
                      sx={{ ...touchRow, display: 'inline-flex', alignItems: 'center', px: 1.5, minHeight: 34, borderRadius: 999, fontSize: 14, fontWeight: 600, color: scoop(flavor, 'pill'), bgcolor: scoop(flavor, 'pastel'), '&:hover': { textDecoration: 'underline' } }}
                    >
                      {c.name}
                    </Box>
                  </NextLink>
                </li>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
              Also uses <code>@mui/material</code>, <code>@mui/icons-material</code> and <code>motion</code>. No chart or drag-and-drop library.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
