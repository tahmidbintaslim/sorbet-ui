import type { Metadata } from 'next';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import BlockViewer from '@/components/BlockViewer';
import { blocksIn, categoriesWithBlocks, getCategory } from '@/lib/blocks';

export const dynamicParams = false;
export const generateStaticParams = () => categoriesWithBlocks().map((c) => ({ category: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const c = getCategory((await params).category);
  return { title: c ? `${c.title} blocks` : 'Blocks', description: c?.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const blocks = blocksIn(category);
  const all = categoriesWithBlocks();
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 } }}>
      <Link component={NextLink} href="/blocks" underline="hover" sx={{ fontSize: 14 }}>
        ← All blocks
      </Link>
      <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 36, md: 48 }, letterSpacing: '-0.035em', mt: 1 }}>
        {c.title}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: 18, mt: 1 }}>
        {c.description} {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}.
      </Typography>
      <Stack direction="row" component="nav" aria-label="Block categories" spacing={1} sx={{ mt: 3, overflowX: 'auto', pb: 1 }}>
        {all.map((x) => (
          <Box
            key={x.id}
            component={NextLink}
            href={`/blocks/${x.id}`}
            aria-current={x.id === category ? 'page' : undefined}
            sx={{ flexShrink: 0, px: 1.5, py: 0.75, borderRadius: 2, border: 1, borderColor: x.id === category ? 'primary.main' : 'divider', color: 'text.primary', textDecoration: 'none', fontSize: 14, fontWeight: 600, bgcolor: x.id === category ? 'action.selected' : 'transparent', '&:hover': { bgcolor: 'action.hover' } }}
          >
            {x.title}
          </Box>
        ))}
      </Stack>
      <Stack spacing={7} sx={{ mt: 5 }}>
        {blocks.map((b) => (
          <BlockViewer key={b.id} id={b.id} name={b.name} description={b.description} />
        ))}
      </Stack>
    </Container>
  );
}
