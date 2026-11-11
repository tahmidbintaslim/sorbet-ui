'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Collapse, Container, Link, Typography } from '@mui/material';
import { Button } from '@sorbet-ui/react';
import CodeBlock from './CodeBlock';
import { BLOCKS } from '@/lib/blocks-meta';
import { SECTION_FLAVOR } from '@/lib/sections';
import PageHeader from './fun/PageHeader';
import { StickerBadge } from './fun/Decor';

export default function TemplateHeader({ name, description, source, blocks }: { name: string; description: string; source: string; blocks: string[] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <PageHeader
        bleed
        flavor={SECTION_FLAVOR.templates}
        doodle="sundae"
        title={name}
        back={{ href: '/templates', label: 'All templates' }}
        badge={
          <StickerBadge c="success" size={52}>
            Free
          </StickerBadge>
        }
        action={
          <Button variant={open ? 'soft' : 'solid'} color="secondary" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="template-source">
            {open ? 'Hide source' : 'Get the code'}
          </Button>
        }
      >
        {description}
      </PageHeader>
      <Container maxWidth="lg">
      <Collapse in={open}>
        <Box id="template-source" sx={{ mt: 2 }}>
          <CodeBlock code={source} title="app/page.tsx" label={`${name} page source`} />
          <Typography variant="body2" color="text.secondary">
            Blocks used:{' '}
            {blocks.map((id, i) => {
              const b = BLOCKS.find((x) => x.id === id)!;
              return (
                <React.Fragment key={id}>
                  {i > 0 && ', '}
                  <Link component={NextLink} href={`/blocks/${b.category}#${id}`}>
                    {b.name} ({b.category})
                  </Link>
                </React.Fragment>
              );
            })}
          </Typography>
        </Box>
      </Collapse>
      </Container>
    </>
  );
}
