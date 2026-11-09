import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { Container, Stack, Typography } from '@mui/material';
import * as React from 'react';
import BlockViewer from '@/components/BlockViewer';
import { BLOCK_COMPONENTS } from '@/components/blocks-registry';
import { BLOCK_SOURCE } from '@/lib/blocks-source';
import BlockCategoryNav, { BackToBlocks } from '@/components/BlockCategoryNav';
import { blocksIn, categoriesWithBlocks, getCategory } from '@/lib/blocks';

export const dynamicParams = false;
export const generateStaticParams = () => categoriesWithBlocks().map((c) => ({ category: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const id = (await params).category;
  const c = getCategory(id);
  return pageMeta({ title: c ? `${c.title} blocks` : 'Blocks', description: c?.description, path: `/blocks/${id}` });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const blocks = blocksIn(category);
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 } }}>
      <BackToBlocks />
      <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 36, md: 48 }, letterSpacing: '-0.035em', mt: 1 }}>
        {c.title}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: 18, mt: 1 }}>
        {c.description} {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}.
      </Typography>
      <BlockCategoryNav current={category} />
      <Stack spacing={7} sx={{ mt: 5 }}>
        {blocks.map((b) => (
          <BlockViewer key={b.id} id={b.id} name={b.name} description={b.description} source={BLOCK_SOURCE[b.id]}>
            {React.createElement(BLOCK_COMPONENTS[b.id])}
          </BlockViewer>
        ))}
      </Stack>
    </Container>
  );
}
