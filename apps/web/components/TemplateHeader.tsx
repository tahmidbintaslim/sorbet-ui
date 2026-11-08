'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Collapse, Link, Stack, Typography } from '@mui/material';
import { Button, Chip } from '@sorbet-ui/react';
import CodeBlock from './CodeBlock';
import { BLOCKS } from '@/lib/blocks-source';

export default function TemplateHeader({ name, description, source, blocks }: { name: string; description: string; source: string; blocks: string[] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Box>
      <Link component={NextLink} href="/templates" underline="hover" sx={{ fontSize: 14 }}>
        ← All templates
      </Link>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { md: 'flex-end' }, mt: 1 }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 32, md: 44 }, letterSpacing: '-0.035em' }}>
              {name}
            </Typography>
            <Chip size="sm" variant="soft" color="success" label="Free" />
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
            {description}
          </Typography>
        </Box>
        <Button variant={open ? 'soft' : 'solid'} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="template-source">
          {open ? 'Hide source' : 'Get the code'}
        </Button>
      </Stack>
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
    </Box>
  );
}
