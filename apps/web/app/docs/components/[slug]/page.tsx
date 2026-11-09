import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import CodeBlock from '@/components/CodeBlock';
import { CATALOG, getEntry } from '@/lib/catalog';
import Playground from '@/components/Playground';

type Params = Promise<{ slug: string }>;

// Static export: every component page is generated at build time.
export const dynamicParams = false;
export const generateStaticParams = () => CATALOG.map((d) => ({ slug: d.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = (await params).slug;
  const demo = getEntry(slug);
  return pageMeta({ title: demo?.name, description: demo?.description, path: `/docs/components/${slug}` });
}

export default async function ComponentPage({ params }: { params: Params }) {
  const { slug } = await params;
  const demo = getEntry(slug);
  if (!demo) notFound();

  return (
    <>
      <Typography component="h1" variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        {demo.name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {demo.description}
      </Typography>
      <Playground slug={demo.slug} />
      <Typography component="h2" variant="h6" sx={{ fontWeight: 700, mt: 4 }}>
        Import
      </Typography>
      <CodeBlock
        code={`import { ${demo.imports.join(', ')} } from '@sorbet-ui/react';`}
        label="Import statement"
      />
    </>
  );
}
