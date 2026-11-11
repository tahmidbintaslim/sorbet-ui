import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Container } from '@mui/material';
import BlocksIndex from '@/components/BlocksIndex';
import { BLOCKS, categoriesWithBlocks } from '@/lib/blocks';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';

export const metadata: Metadata = pageMeta({
  title: 'Blocks',
  description: 'Copy-paste page sections built with Sorbet UI: heroes, pricing, dashboards, auth and more.',
  path: '/blocks',
});

export default function BlocksPage() {
  return (
    <>
      <PageHeader bleed size="lg" flavor={SECTION_FLAVOR.blocks} doodle="waffle" aside="copy & paste" title="Blocks">
        {BLOCKS.length} page sections in {categoriesWithBlocks().length} categories, built only with Sorbet UI and Material UI.
        Open a block&apos;s Code tab and paste it into your app. All copy, names and numbers are sample content.
      </PageHeader>
      <Container maxWidth="lg">
        <BlocksIndex />
      </Container>
    </>
  );
}
