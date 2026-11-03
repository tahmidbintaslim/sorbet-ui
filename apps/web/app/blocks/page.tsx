import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';
import BlocksIndex from '@/components/BlocksIndex';
import { BLOCKS, categoriesWithBlocks } from '@/lib/blocks';

export const metadata: Metadata = {
  title: 'Blocks',
  description: 'Copy-paste page sections built with Sorbet UI: heroes, pricing, dashboards, auth and more.',
};

export default function BlocksPage() {
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 } }}>
      <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 40, md: 56 }, letterSpacing: '-0.04em' }}>
        Blocks
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: 18, mt: 1.5, maxWidth: 680 }}>
        {BLOCKS.length} page sections in {categoriesWithBlocks().length} categories, built only with Sorbet UI and Material UI.
        Open a block&apos;s Code tab and paste it into your app. All copy, names and numbers are sample content.
      </Typography>
      <BlocksIndex />
    </Container>
  );
}
