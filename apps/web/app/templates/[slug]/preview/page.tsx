// Chrome-less, full-screen route for one template: no site header or footer.
import type { Metadata } from 'next';
import * as React from 'react';
import { notFound } from 'next/navigation';
import { pageMeta } from '@/lib/seo';
import TemplateFullscreen from '@/components/TemplateFullscreen';
import { TEMPLATE_COMPONENTS } from '@/components/templates-registry';
import { TEMPLATES, getTemplate } from '@/lib/templates';

export const dynamicParams = false;
export const generateStaticParams = () => TEMPLATES.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const t = getTemplate(slug);
  return pageMeta({ title: t ? `${t.name} template, full screen` : 'Template', description: t?.description, path: `/templates/${slug}/preview` });
}

export default async function TemplatePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTemplate((await params).slug);
  if (!t) notFound();
  return (
    <TemplateFullscreen slug={t.slug} name={t.name} layout={t.layout}>
      {React.createElement(TEMPLATE_COMPONENTS[t.slug])}
    </TemplateFullscreen>
  );
}
